<?php

namespace Drupal\custom_json_export\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\NodeInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\taxonomy\Entity\Term;

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
   * Exporta todos los nodos del sitio a JSON y los muestra en la URL, con filtro opcional por categoría.
   */
  public function exportNodes(Request $request) {
    $node_storage = \Drupal::entityTypeManager()->getStorage('node');
    $query = $node_storage->getQuery()
      ->condition('status', 1)
      ->accessCheck(TRUE);

    // Obtener el parámetro de consulta 'category' si existe
    $category = $request->query->get('category');

    if (!empty($category)) {
      // Cargar los términos de taxonomía 'categories' que coincidan con el valor proporcionado
      $term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
      $tids = $term_storage->getQuery()
        ->condition('vid', 'categories') // Vocabulario 'categories'
        ->condition('name', $category) // Nombre del término (Creatividad, Drupal, Github)
        ->accessCheck(TRUE)
        ->execute();

      if (!empty($tids)) {
        // Filtrar los nodos que referencian alguno de estos términos en field_categories
        $query->condition('field_categories', array_values($tids), 'IN');
      } else {
        // Si no se encuentran términos, devolver un array vacío (sin nodos)
        return new JsonResponse([]);
      }
    }

    // Ejecutar la consulta
    $nids = $query->execute();
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