<?php

namespace Drupal\custom_json_export\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Block\BlockManagerInterface;
use Drupal\Core\Theme\ThemeManagerInterface;
use Drupal\Core\Render\RendererInterface;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controlador para mostrar información detallada de bloques por región.
 */
class BlockInfoController extends ControllerBase {

  /**
   * El gestor de entidades.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * El gestor de bloques.
   *
   * @var \Drupal\Core\Block\BlockManagerInterface
   */
  protected $blockManager;

  /**
   * El gestor de temas.
   *
   * @var \Drupal\Core\Theme\ThemeManagerInterface
   */
  protected $themeManager;

  /**
   * El servicio de renderizado.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * Constructor del controlador.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   El gestor de entidades.
   * @param \Drupal\Core\Block\BlockManagerInterface $block_manager
   *   El gestor de bloques.
   * @param \Drupal\Core\Theme\ThemeManagerInterface $theme_manager
   *   El gestor de temas.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   El servicio de renderizado.
   */
  public function __construct(
    EntityTypeManagerInterface $entity_type_manager,
    BlockManagerInterface $block_manager,
    ThemeManagerInterface $theme_manager,
    RendererInterface $renderer
  ) {
    $this->entityTypeManager = $entity_type_manager;
    $this->blockManager = $block_manager;
    $this->themeManager = $theme_manager;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('plugin.manager.block'),
      $container->get('theme.manager'),
      $container->get('renderer')
    );
  }

  /**
   * Devuelve la información de los bloques en las regiones header, footer_top y footer_bottom.
   * 
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   Respuesta JSON con la información de bloques.
   */
  public function content() {
    $all_blocks = $this->getBlocksByRegion();
    
    // Filtrar las regiones 'header', 'footer_top' y 'footer_bottom'
    $filtered_blocks = [];
    
    if (isset($all_blocks['header'])) {
      $filtered_blocks['header'] = $all_blocks['header'];
    }
    
    if (isset($all_blocks['footer_top'])) {
      $filtered_blocks['footer_top'] = $all_blocks['footer_top'];
    }
    
    if (isset($all_blocks['footer_bottom'])) {
      $filtered_blocks['footer_bottom'] = $all_blocks['footer_bottom'];
    }
    
    // Opcionalmente, puedes agrupar ambas regiones de footer en una sola
    // si deseas mantener la estructura original esperada
    $filtered_blocks['footer'] = [];
    if (isset($all_blocks['footer_top'])) {
      foreach ($all_blocks['footer_top'] as $block) {
        $block['region_original'] = 'footer_top';
        $filtered_blocks['footer'][] = $block;
      }
    }
    
    if (isset($all_blocks['footer_bottom'])) {
      foreach ($all_blocks['footer_bottom'] as $block) {
        $block['region_original'] = 'footer_bottom';
        $filtered_blocks['footer'][] = $block;
      }
    }
    
    return new JsonResponse($filtered_blocks);
  }

  /**
   * Obtiene todos los bloques agrupados por región con su contenido detallado.
   *
   * @param string|null $theme
   *   (opcional) El nombre del tema. Si no se proporciona, se usará el tema activo.
   *
   * @return array
   *   Un array asociativo con las regiones como claves y los bloques como valores.
   */
  protected function getBlocksByRegion($theme = NULL) {
    // Si no se proporciona un tema, usamos el tema activo.
    if (!$theme) {
      $theme = $this->themeManager->getActiveTheme()->getName();
    }

    // Obtenemos todos los bloques definidos.
    $block_storage = $this->entityTypeManager->getStorage('block');
    $blocks = $block_storage->loadByProperties(['theme' => $theme]);

    // Array para almacenar bloques por región.
    $blocks_by_region = [];

    // Agrupamos los bloques por región.
    foreach ($blocks as $block) {
      if ($block->status()) {
        $region = $block->getRegion();
        
        // Obtenemos información básica del bloque.
        $block_info = [
          'id' => $block->id(),
          'plugin_id' => $block->getPluginId(),
          'label' => $block->label(),
          'provider' => $block->getPlugin()->getPluginDefinition()['provider'],
          'weight' => $block->getWeight(),
          'status' => $block->status(),
          'settings' => $block->get('settings'),
        ];
        
        // Obtenemos el contenido detallado del bloque.
        $block_info['content'] = $this->getBlockContent($block);
        
        // Agregamos el bloque a la región correspondiente.
        $blocks_by_region[$region][] = $block_info;
      }
    }

    // Ordenamos los bloques por peso dentro de cada región.
    foreach ($blocks_by_region as &$region_blocks) {
      usort($region_blocks, function ($a, $b) {
        return $a['weight'] <=> $b['weight'];
      });
    }

    return $blocks_by_region;
  }

  /**
   * Extrae el contenido detallado de un bloque incluyendo imágenes, enlaces y texto.
   *
   * @param \Drupal\block\Entity\Block $block
   *   La entidad del bloque.
   *
   * @return array
   *   Un array con el contenido detallado del bloque.
   */
  protected function getBlockContent($block) {
    $content = [];
    
    try {
      // Obtener la instancia del plugin del bloque.
      $plugin = $block->getPlugin();
      $plugin_id = $plugin->getPluginId();
      
      // Procesamos diferentes tipos de bloques.
      switch (TRUE) {
        // Bloques de contenido personalizado (Custom Block).
        case strpos($plugin_id, 'block_content') === 0:
          $content = $this->processCustomBlockContent($plugin);
          break;
        
        // Bloques de vistas.
        case strpos($plugin_id, 'views_block') === 0:
          $content = $this->processViewsBlockContent($plugin);
          break;
        
        // Bloques de menú.
        case strpos($plugin_id, 'system_menu_block') === 0:
          $content = $this->processMenuBlockContent($plugin);
          break;
        
        // Bloques de entidades (Entity blocks).
        case strpos($plugin_id, 'entity_block') === 0:
          $content = $this->processEntityBlockContent($plugin);
          break;
          
        // Bloques básicos o cualquier otro tipo.
        default:
          $content = $this->processDefaultBlockContent($plugin);
          break;
      }
    }
    catch (\Exception $e) {
      $content['error'] = $e->getMessage();
    }
    
    return $content;
  }
  
  /**
   * Procesa el contenido de un bloque personalizado (Custom Block).
   *
   * @param object $plugin
   *   El plugin del bloque.
   *
   * @return array
   *   El contenido procesado.
   */
  protected function processCustomBlockContent($plugin) {
    $content = [];
    
    // Obtenemos el UUID del bloque personalizado.
    $uuid = $plugin->getDerivativeId();
    
    // Cargamos la entidad del bloque personalizado.
    $block_content_storage = $this->entityTypeManager->getStorage('block_content');
    $block_content = current($block_content_storage->loadByProperties(['uuid' => $uuid]));
    
    if ($block_content) {
      // Iteramos sobre los campos del bloque.
      foreach ($block_content->getFields() as $field_name => $field) {
        // Ignoramos campos internos.
        if (in_array($field_name, ['id', 'uuid', 'revision_id', 'langcode', 'info', 'type', 'revision_log', 'changed', 'revision_created', 'revision_user', 'revision_translation_affected', 'default_langcode', 'created'])) {
          continue;
        }
        
        $field_type = $field->getFieldDefinition()->getType();
        $field_value = [];
        
        // Procesamos según el tipo de campo.
        switch ($field_type) {
          // Campos de imagen.
          case 'image':
            $field_value = $this->processImageField($field);
            break;
            
          // Campos de enlace.
          case 'link':
            $field_value = $this->processLinkField($field);
            break;
            
          // Campos de texto.
          case 'text':
          case 'text_long':
          case 'text_with_summary':
            $field_value = $this->processTextField($field);
            break;
            
          // Campos de referencia a entidades.
          case 'entity_reference':
            $field_value = $this->processEntityReferenceField($field);
            break;
            
          // Campos de archivo.
          case 'file':
            $field_value = $this->processFileField($field);
            break;
            
          // Otros tipos de campo.
          default:
            $field_value = $this->processDefaultField($field);
            break;
        }
        
        $content['fields'][$field_name] = $field_value;
      }
    }
    
    return $content;
  }
  
  /**
   * Procesa el contenido de un bloque de vistas.
   *
   * @param object $plugin
   *   El plugin del bloque.
   *
   * @return array
   *   El contenido procesado.
   */
  protected function processViewsBlockContent($plugin) {
    $content = [];
    
    // Obtenemos el ID de la vista y la visualización.
    $derivative_id = $plugin->getDerivativeId();
    list($view_id, $display_id) = explode('-', $derivative_id);
    
    $content['view'] = [
      'id' => $view_id,
      'display' => $display_id,
    ];
    
    // Intentamos obtener la configuración de la vista.
    try {
      $view_storage = $this->entityTypeManager->getStorage('view');
      $view = $view_storage->load($view_id);
      if ($view) {
        $content['view']['title'] = $view->label();
        $content['view']['description'] = $view->get('description');
      }
    }
    catch (\Exception $e) {
      $content['view']['error'] = $e->getMessage();
    }
    
    return $content;
  }
  
  /**
   * Procesa el contenido de un bloque de menú.
   *
   * @param object $plugin
   *   El plugin del bloque.
   *
   * @return array
   *   El contenido procesado.
   */
  protected function processMenuBlockContent($plugin) {
    $content = [];
    
    // Obtenemos el ID del menú.
    $menu_name = $plugin->getDerivativeId();
    $content['menu'] = [
      'id' => $menu_name,
    ];
    
    // Obtenemos el árbol del menú.
    try {
      $menu_tree = \Drupal::menuTree();
      $parameters = $menu_tree->getCurrentRouteMenuTreeParameters($menu_name);
      $tree = $menu_tree->load($menu_name, $parameters);
      $manipulators = [
        ['callable' => 'menu.default_tree_manipulators:checkAccess'],
        ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
      ];
      $tree = $menu_tree->transform($tree, $manipulators);
      
      // Procesamos los ítems del menú.
      $content['menu']['items'] = $this->processMenuItems($tree);
    }
    catch (\Exception $e) {
      $content['menu']['error'] = $e->getMessage();
    }
    
    return $content;
  }
  
  /**
   * Procesa el contenido de un bloque de entidad.
   *
   * @param object $plugin
   *   El plugin del bloque.
   *
   * @return array
   *   El contenido procesado.
   */
  protected function processEntityBlockContent($plugin) {
    $content = [];
    
    // Intentamos obtener la entidad referenciada.
    try {
      $configuration = $plugin->getConfiguration();
      if (isset($configuration['entity']) && isset($configuration['entity_type'])) {
        $entity_type = $configuration['entity_type'];
        $entity_id = $configuration['entity'];
        
        $entity = $this->entityTypeManager->getStorage($entity_type)->load($entity_id);
        if ($entity) {
          $content['entity'] = [
            'type' => $entity_type,
            'id' => $entity_id,
            'label' => $entity->label(),
          ];
        }
      }
    }
    catch (\Exception $e) {
      $content['error'] = $e->getMessage();
    }
    
    return $content;
  }
  
  /**
   * Procesa el contenido de un bloque genérico/predeterminado.
   *
   * @param object $plugin
   *   El plugin del bloque.
   *
   * @return array
   *   El contenido procesado.
   */
  protected function processDefaultBlockContent($plugin) {
    $content = [];
    
    // Intentamos renderizar el bloque y obtener su contenido en forma de HTML.
    try {
      $build = $plugin->build();
      $rendered_content = $this->renderer->renderRoot($build);
      $content['html'] = (string) $rendered_content;
    }
    catch (\Exception $e) {
      $content['error'] = $e->getMessage();
    }
    
    return $content;
  }
  
  /**
   * Procesa los ítems de un menú.
   *
   * @param array $tree
   *   El árbol del menú.
   *
   * @return array
   *   Los ítems procesados.
   */
  protected function processMenuItems(array $tree) {
    $items = [];
    
    foreach ($tree as $key => $element) {
      $link = $element->link;
      $url = $link->getUrlObject();
      
      $item = [
        'title' => $link->getTitle(),
        'url' => $url->toString(),
        'description' => $link->getDescription(),
        'enabled' => $link->isEnabled(),
        'expanded' => $link->isExpanded(),
        'weight' => $link->getWeight(),
      ];
      
      // Si hay subítems, procesamos recursivamente.
      if ($element->subtree) {
        $item['children'] = $this->processMenuItems($element->subtree);
      }
      
      $items[] = $item;
    }
    
    return $items;
  }
  
  /**
   * Procesa un campo de imagen.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $field
   *   El campo de imagen.
   *
   * @return array
   *   La información del campo procesado.
   */
  protected function processImageField($field) {
    $result = [];
    
    foreach ($field->getValue() as $delta => $value) {
      if (isset($value['target_id'])) {
        $file = File::load($value['target_id']);
        
        if ($file) {
          $image_info = [
            'fid' => $file->id(),
            'filename' => $file->getFilename(),
            'url' => $file->createFileUrl(FALSE),
            'alt' => $value['alt'] ?? '',
            'title' => $value['title'] ?? '',
            'width' => $value['width'] ?? NULL,
            'height' => $value['height'] ?? NULL,
          ];
          
          // Añadimos URLs para estilos de imagen comunes.
          try {
            $image_styles = ImageStyle::loadMultiple();
            $image_info['image_styles'] = [];
            
            foreach ($image_styles as $style_name => $style) {
              $image_info['image_styles'][$style_name] = $style->buildUrl($file->getFileUri());
            }
          }
          catch (\Exception $e) {
            $image_info['image_styles_error'] = $e->getMessage();
          }
          
          $result[$delta] = $image_info;
        }
      }
    }
    
    return $result;
  }
  
  /**
   * Procesa un campo de enlace.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $field
   *   El campo de enlace.
   *
   * @return array
   *   La información del campo procesado.
   */
  protected function processLinkField($field) {
    $result = [];
    
    foreach ($field->getValue() as $delta => $value) {
      $link_info = [
        'title' => $value['title'] ?? '',
        'url' => $value['uri'] ?? '',
        'options' => $value['options'] ?? [],
      ];
      
      // Si la URL es interna, obtenemos la ruta absoluta.
      if (isset($value['uri']) && strpos($value['uri'], 'internal:') === 0) {
        try {
          $path = substr($value['uri'], 9); // Eliminar 'internal:'
          $url = Url::fromUserInput($path);
          $link_info['absolute_url'] = $url->setAbsolute()->toString();
        }
        catch (\Exception $e) {
          $link_info['error'] = $e->getMessage();
        }
      }
      
      $result[$delta] = $link_info;
    }
    
    return $result;
  }
  
  /**
   * Procesa un campo de texto.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $field
   *   El campo de texto.
   *
   * @return array
   *   La información del campo procesado.
   */
  protected function processTextField($field) {
    $result = [];
    
    foreach ($field->getValue() as $delta => $value) {
      $text_info = [];
      
      if (isset($value['value'])) {
        $text_info['value'] = $value['value'];
        $text_info['format'] = $value['format'] ?? NULL;
        
        // Si hay un formato de texto, generamos también el HTML procesado.
        if (isset($value['format']) && !empty($value['format'])) {
          try {
            $text_info['processed'] = check_markup($value['value'], $value['format']);
          }
          catch (\Exception $e) {
            $text_info['processed_error'] = $e->getMessage();
          }
        }
      }
      
      // Para campos con resumen.
      if (isset($value['summary'])) {
        $text_info['summary'] = $value['summary'];
        
        // Si hay un formato de texto, generamos también el HTML procesado para el resumen.
        if (isset($value['format']) && !empty($value['format'])) {
          try {
            $text_info['summary_processed'] = check_markup($value['summary'], $value['format']);
          }
          catch (\Exception $e) {
            $text_info['summary_processed_error'] = $e->getMessage();
          }
        }
      }
      
      $result[$delta] = $text_info;
    }
    
    return $result;
  }
  
  /**
   * Procesa un campo de referencia a entidades.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $field
   *   El campo de referencia a entidades.
   *
   * @return array
   *   La información del campo procesado.
   */
  protected function processEntityReferenceField($field) {
    $result = [];
    $field_definition = $field->getFieldDefinition();
    $target_type = $field_definition->getSetting('target_type');
    
    foreach ($field->getValue() as $delta => $value) {
        if (isset($value['target_id'])) {
            try {
                $entity = $this->entityTypeManager->getStorage($target_type)->load($value['target_id']);
                
                if ($entity) {
                    $entity_info = [
                        'id' => $entity->id(),
                        'type' => $target_type,
                        'label' => $entity->label(),
                        'url' => $entity->hasLinkTemplate('canonical') ? $entity->toUrl()->toString() : NULL,
                    ];
                    
                    // Para párrafos, extraemos todos sus campos, incluidas referencias a otros párrafos
                    if ($target_type == 'paragraph') {
                        $entity_info['paragraph_type'] = $entity->bundle();
                        $entity_info['fields'] = [];
                        
                        // Iteramos sobre los campos del párrafo
                        foreach ($entity->getFields() as $paragraph_field_name => $paragraph_field) {
                            // Ignoramos campos internos
                            if (in_array($paragraph_field_name, ['id', 'uuid', 'revision_id', 'langcode', 'type', 'status', 'created', 'parent_id', 'parent_type', 'parent_field_name', 'behavior_settings', 'default_langcode', 'revision_translation_affected', 'revision_default'])) {
                                continue;
                            }
                            
                            $paragraph_field_type = $paragraph_field->getFieldDefinition()->getType();
                            $paragraph_field_settings = $paragraph_field->getFieldDefinition()->getSettings();
                            
                            // Procesamos el campo según su tipo
                            switch ($paragraph_field_type) {
                                case 'image':
                                    $entity_info['fields'][$paragraph_field_name] = $this->processImageField($paragraph_field);
                                    break;
                                case 'link':
                                    $entity_info['fields'][$paragraph_field_name] = $this->processLinkField($paragraph_field);
                                    break;
                                case 'text':
                                case 'text_long':
                                case 'text_with_summary':
                                    $entity_info['fields'][$paragraph_field_name] = $this->processTextField($paragraph_field);
                                    break;
                                case 'entity_reference':
                                    // Verificamos si es una referencia a párrafo o a otro tipo de entidad
                                    $referenced_type = isset($paragraph_field_settings['target_type']) ? 
                                        $paragraph_field_settings['target_type'] : '';
                                        
                                    // Procesamos de manera recursiva
                                    $entity_info['fields'][$paragraph_field_name] = $this->processEntityReferenceField($paragraph_field);
                                    
                                    // Añadir información para debug
                                    if ($referenced_type) {
                                        $entity_info['fields'][$paragraph_field_name . '_target_type'] = $referenced_type;
                                    }
                                    break;
                                case 'file':
                                    $entity_info['fields'][$paragraph_field_name] = $this->processFileField($paragraph_field);
                                    break;
                                default:
                                    $entity_info['fields'][$paragraph_field_name] = $this->processDefaultField($paragraph_field);
                                    break;
                            }
                        }
                    }
                    
                    // Para nodos, taxonomías y usuarios (el código existente)
                    elseif ($target_type == 'node') {
                        $entity_info['nid'] = $entity->id();
                        $entity_info['title'] = $entity->getTitle();
                        $entity_info['bundle'] = $entity->bundle();
                        $entity_info['status'] = $entity->isPublished();
                        $entity_info['created'] = $entity->getCreatedTime();
                        $entity_info['changed'] = $entity->getChangedTime();
                    }
                    elseif ($target_type == 'taxonomy_term') {
                        $entity_info['tid'] = $entity->id();
                        $entity_info['name'] = $entity->getName();
                        $entity_info['description'] = $entity->getDescription();
                        $entity_info['vocabulary'] = $entity->bundle();
                    }
                    elseif ($target_type == 'user') {
                        $entity_info['uid'] = $entity->id();
                        $entity_info['name'] = $entity->getAccountName();
                        $entity_info['mail'] = $entity->getEmail();
                        $entity_info['status'] = $entity->isActive();
                        $entity_info['created'] = $entity->getCreatedTime();
                        $entity_info['roles'] = $entity->getRoles();
                    }
                    elseif ($target_type == 'block_content') {
                        // Procesamos bloques de contenido de manera similar a los párrafos
                        $entity_info['bundle'] = $entity->bundle();
                        $entity_info['fields'] = [];
                        
                        foreach ($entity->getFields() as $block_field_name => $block_field) {
                            // Ignoramos campos internos
                            if (in_array($block_field_name, ['id', 'uuid', 'revision_id', 'langcode', 'info', 'type', 'revision_log', 'changed', 'revision_created', 'revision_user', 'revision_translation_affected', 'default_langcode', 'created'])) {
                                continue;
                            }
                            
                            $block_field_type = $block_field->getFieldDefinition()->getType();
                            
                            // Procesamos el campo del bloque según su tipo (similar a párrafos)
                            switch ($block_field_type) {
                                case 'image':
                                    $entity_info['fields'][$block_field_name] = $this->processImageField($block_field);
                                    break;
                                case 'link':
                                    $entity_info['fields'][$block_field_name] = $this->processLinkField($block_field);
                                    break;
                                case 'text':
                                case 'text_long':
                                case 'text_with_summary':
                                    $entity_info['fields'][$block_field_name] = $this->processTextField($block_field);
                                    break;
                                case 'entity_reference':
                                    $entity_info['fields'][$block_field_name] = $this->processEntityReferenceField($block_field);
                                    break;
                                case 'file':
                                    $entity_info['fields'][$block_field_name] = $this->processFileField($block_field);
                                    break;
                                default:
                                    $entity_info['fields'][$block_field_name] = $this->processDefaultField($block_field);
                                    break;
                            }
                        }
                    }
                    
                    $result[$delta] = $entity_info;
                }
            }
            catch (\Exception $e) {
                $result[$delta] = [
                    'target_id' => $value['target_id'],
                    'type' => $target_type,
                    'error' => $e->getMessage(),
                ];
            }
        }
    }
    
    return $result;
}
  
  /**
   * Procesa un campo de archivo.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $field
   *   El campo de archivo.
   *
   * @return array
   *   La información del campo procesado.
   */
  protected function processFileField($field) {
    $result = [];
    
    foreach ($field->getValue() as $delta => $value) {
      if (isset($value['target_id'])) {
        try {
          $file = File::load($value['target_id']);
          
          if ($file) {
            $file_info = [
              'fid' => $file->id(),
              'filename' => $file->getFilename(),
              'url' => $file->createFileUrl(FALSE),
              'size' => $file->getSize(),
              'mime' => $file->getMimeType(),
              'description' => $value['description'] ?? '',
              'display' => $value['display'] ?? 1,
            ];
            
            $result[$delta] = $file_info;
          }
        }
        catch (\Exception $e) {
          $result[$delta] = [
            'target_id' => $value['target_id'],
            'error' => $e->getMessage(),
          ];
        }
      }
    }
    
    return $result;
  }
  
  /**
   * Procesa un campo genérico.
   *
   * @param \Drupal\Core\Field\FieldItemListInterface $field
   *   El campo.
   *
   * @return array
   *   La información del campo procesado.
   */
  protected function processDefaultField($field) {
    return $field->getValue();
  }
}