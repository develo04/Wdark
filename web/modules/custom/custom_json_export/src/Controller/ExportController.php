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
    $response = new JsonResponse($data);
    $this->addCorsHeaders($response);
    return $response;
  }

  /**
   * Exporta todos los bloques de header a JSON y los muestra en la URL.
   */
  public function exportHeader() {
    $blocks = [];
    $theme = $this->config('system.theme')->get('default');
    $block_storage = \Drupal::entityTypeManager()->getStorage('block');
    $header_blocks = $block_storage->loadByProperties([
      'theme' => $theme,
      'region' => 'header',
    ]);

    uasort($header_blocks, function ($a, $b) {
      return $a->getWeight() - $b->getWeight();
    });

    foreach ($header_blocks as $block) {
      $blocks[] = _custom_json_export_process_block($block);
    }

    $data = [
      'section-header' => $blocks[0] ?? [],
    ];

    $response = new JsonResponse($data);
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
      if (stripos($block->label(), 'Block footer') !== false || $block->id() === 'block_footer') {
        $footer_data = _custom_json_export_process_block($block);
        break;
      }
    }

    $data = [
      'section-footer' => $footer_data ?: $this->getDefaultFooter(),
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
      $data[] = _custom_json_export_process_node($node);
    }

    $response = new JsonResponse($data);
    $this->addCorsHeaders($response);
    return $response;
  }

  /**
   * Agrega encabezados CORS y desactiva la caché en la respuesta.
   */
  private function addCorsHeaders(JsonResponse $response) {
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Accept');
    $response->headers->set('Access-Control-Max-Age', '3600');
    $response->headers->set('Cache-Control', 'no-cache, must-revalidate');
  }

  /**
   * Proporciona un footer por defecto si no hay bloques.
   */
  private function getDefaultFooter() {
    return [
      'logo' => [
        'src' => '/img/footer-logo.jpg',
        'alt' => 'WDARK Footer Logo',
      ],
      'social-networks' => [
        ['name' => 'Facebook', 'url' => 'https://facebook.com'],
        ['name' => 'Instagram', 'url' => 'https://instagram.com'],
      ],
      'copyright' => '© Web & Digital Ark SAS 2019',
      'motto' => [
        'main' => 'CREANDO MUNDOS',
        'secondary' => 'CONECTANDO REALIDADES',
      ],
    ];
  }
}