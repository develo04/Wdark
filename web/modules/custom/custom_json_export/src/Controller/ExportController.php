<?php

namespace Drupal\custom_json_export\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\NodeInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class ExportController extends ControllerBase {

  /**
   * Exporta un nodo a JSON y lo muestra en la URL.
   */
  public function exportNode(NodeInterface $node) {
    $data = _custom_json_export_process_node($node);
    $response = new JsonResponse($data ?: []);
    $this->addCorsHeaders($response);
    return $response;
  }
/**
 * Exporta todos los bloques de header a JSON y los muestra en la URL.
 */
public function exportHeader() {
  $theme = $this->config('system.theme')->get('default');
  $block_storage = \Drupal::entityTypeManager()->getStorage('block');
  
  // Buscar el bloque site_branding para el logo
  $branding_block = $block_storage->loadByProperties([
    'theme' => $theme,
    'plugin' => 'system_branding_block',
    'region' => 'header',
  ]);
  
  // Si no encuentra el bloque específico, buscar cualquier bloque en la región header
  if (empty($branding_block)) {
    $branding_block = $block_storage->loadByProperties([
      'theme' => $theme,
      'id' => 'olivero_site_branding',
    ]);
  }
  
  // Procesar el bloque para el header
  $header_data = [];
  if (!empty($branding_block)) {
    $branding_block = reset($branding_block);
    $header_data = _custom_json_export_process_block($branding_block);
  } else {
    // Crear un resultado por defecto si no se encuentra el bloque
    $header_data = [
      'logo' => [
        'src' => '',
        'alt' => 'WDARK Logo',
      ],
      'desktop-menu' => [],
    ];
    
    // Cargar elementos del menú directamente
    $menu_name = 'header-menu';
    $menu_tree = \Drupal::menuTree()->load($menu_name, new \Drupal\Core\Menu\MenuTreeParameters());
    $menu_items = [];
    
    foreach ($menu_tree as $menu_link) {
      if (isset($menu_link->link)) {
        $menu_items[] = [
          'label' => strtoupper($menu_link->link->getTitle()),
          'href' => $menu_link->link->getUrlObject()->toString(),
        ];
      }
    }
    
    if (!empty($menu_items)) {
      $header_data['desktop-menu'] = $menu_items;
    }
  }

  $data = [
    'section-header' => $header_data,
  ];

  $response = new JsonResponse($data);
  $response->setPublic(); // Forzar acceso público para pruebas
  $this->addCorsHeaders($response);
  return $response;
}

  /**
   * Exporta el bloque "Block footer" a JSON y lo muestra en la URL.
   */
  public function exportFooter() {
    $theme = $this->config('system.theme')->get('default');
    $block_storage = \Drupal::entityTypeManager()->getStorage('block');
    $footer_blocks = $block_storage->loadByProperties([
      'theme' => $theme,
      'region' => 'footer',
    ]);

    $footer_data = null;
    foreach ($footer_blocks as $block) {
      if ($block->id() === 'block-olivero-blockfooter') {
        $footer_data = _custom_json_export_process_block($block);
        break;
      }
    }

    $data = [
      'section-footer' => $footer_data ?: [],
    ];

    $response = new JsonResponse($data);
    $this->addCorsHeaders($response);
    return $response;
  }

  /**
   * Exporta todos los nodos del sitio a JSON y los muestra en la URL.
   */
  public function exportNodes() {
    $node_storage = \Drupal::entityTypeManager()->getStorage('node');
    $nids = $node_storage->getQuery()
      ->condition('status', 1)
      ->accessCheck(TRUE)
      ->execute();
    $nodes = $node_storage->loadMultiple($nids);

    $data = [];
    foreach ($nodes as $node) {
      $node_data = _custom_json_export_process_node($node);
      if (!empty($node_data)) {
        $data[] = $node_data;
      }
    }

    $response = new JsonResponse($data);
    $this->addCorsHeaders($response);
    return $response;
  }

  /**
   * Agrega encabezados CORS y desactiva la caché en la respuesta.
   */
  private function addCorsHeaders(JsonResponse $response) {
    $response->headers->set('Access-Control-Allow-Origin', '');
    $response->headers->set('Access-Control-Allow-Methods', '');
    $response->headers->set('Access-Control-Allow-Headers', '');
    $response->headers->set('Access-Control-Max-Age', '');
    $response->headers->set('Cache-Control', 'no-cache, must-revalidate');
  }
}