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
    return $response;
  }
}