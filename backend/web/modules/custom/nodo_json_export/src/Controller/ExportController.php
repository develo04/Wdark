<?php

namespace Drupal\nodo_json_export\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\NodeInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Drupal\block\Entity\Block;

class ExportController extends ControllerBase {

  /**
   * Exporta un nodo a JSON.
   *
   * @param \Drupal\node\NodeInterface $node
   *   El nodo a exportar.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   Respuesta con el archivo JSON.
   */
  public function exportNode(NodeInterface $node) {
    // Procesar el nodo
    $data = _nodo_json_export_process_node($node);
    
    // Convertir a JSON con formato elegante
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    // Crear respuesta
    $response = new Response($json);
    
    // Configurar headers para descarga de archivo
    $disposition = $response->headers->makeDisposition(
      ResponseHeaderBag::DISPOSITION_ATTACHMENT,
      'node-' . $node->id() . '.json'
    );
    
    $response->headers->set('Content-Disposition', $disposition);
    $response->headers->set('Content-Type', 'application/json');
    
    return $response;
  }
  
  /**
   * Exporta todos los bloques de header a JSON.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   Respuesta con el archivo JSON.
   */
  public function exportHeader() {
    $blocks = [];
    $theme = $this->config('system.theme')->get('default');
    
    // Buscar todos los bloques en la región 'header'
    $block_storage = \Drupal::entityTypeManager()->getStorage('block');
    $header_blocks = $block_storage->loadByProperties([
      'theme' => $theme,
      'region' => 'header',
    ]);
    
    // Ordenar bloques por peso
    uasort($header_blocks, function ($a, $b) {
      return $a->getWeight() - $b->getWeight();
    });
    
    // Procesar cada bloque
    foreach ($header_blocks as $block) {
      $blocks[] = _nodo_json_export_process_block($block);
    }
    
    $data = [
      'theme' => $theme,
      'region' => 'header',
      'blocks' => $blocks,
    ];
    
    // Convertir a JSON con formato elegante
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    // Crear respuesta
    $response = new Response($json);
    
    // Configurar headers para descarga de archivo
    $disposition = $response->headers->makeDisposition(
      ResponseHeaderBag::DISPOSITION_ATTACHMENT,
      'header-blocks.json'
    );
    
    $response->headers->set('Content-Disposition', $disposition);
    $response->headers->set('Content-Type', 'application/json');
    
    return $response;
  }
  
  /**
   * Exporta todos los bloques de footer a JSON.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   Respuesta con el archivo JSON.
   */
  public function exportFooter() {
    $blocks = [];
    $theme = $this->config('system.theme')->get('default');
    
    // Buscar todos los bloques en la región 'footer'
    $block_storage = \Drupal::entityTypeManager()->getStorage('block');
    $footer_blocks = $block_storage->loadByProperties([
      'theme' => $theme,
      'region' => 'footer',
    ]);
    
    // Ordenar bloques por peso
    uasort($footer_blocks, function ($a, $b) {
      return $a->getWeight() - $b->getWeight();
    });
    
    // Procesar cada bloque
    foreach ($footer_blocks as $block) {
      $blocks[] = _nodo_json_export_process_block($block);
    }
    
    $data = [
      'theme' => $theme,
      'region' => 'footer',
      'blocks' => $blocks,
    ];
    
    // Convertir a JSON con formato elegante
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    // Crear respuesta
    $response = new Response($json);
    
    // Configurar headers para descarga de archivo
    $disposition = $response->headers->makeDisposition(
      ResponseHeaderBag::DISPOSITION_ATTACHMENT,
      'footer-blocks.json'
    );
    
    $response->headers->set('Content-Disposition', $disposition);
    $response->headers->set('Content-Type', 'application/json');
    
    return $response;
  }
}