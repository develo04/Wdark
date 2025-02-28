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
  
  // Buscar el bloque Logo header en la región header
  $logo_block = $block_storage->loadByProperties([
    'theme' => $theme,
    'id' => 'logo_header', // Usar el ID del bloque Logo header según tu captura
    'region' => 'header',
  ]);
  
  // Procesar el bloque para el header
  $header_data = [];
  if (!empty($logo_block)) {
    $logo_block = reset($logo_block);
    $header_data = _custom_json_export_process_block($logo_block);
  } else {
    // No crear un resultado por defecto; devolver datos dinámicos del menú si existen
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

  // Si no hay datos dinámicos (ni logo ni menú), devolver un array vacío
  if (empty($header_data['logo']) && empty($header_data['desktop-menu'])) {
    $header_data = [];
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