"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Wdark from "../../../img/galaxia.jpg";

export default function InternalBlog() {
  const [blogData, setBlogData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Added state for all categories and tags
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);

  // Intenta obtener los parámetros tanto de la ruta como de las query params
  const categoriaParam = params?.categoria || searchParams.get('categoria') || '';
  const tituloParam = params?.titulo || searchParams.get('titulo') || '';
  
  // Capturamos explícitamente el parámetro nid de la URL
  const nidParam = searchParams.get('nid') || '';

  useEffect(() => {
    console.log("🔍 Parámetros recibidos:", { 
      categoria: categoriaParam, 
      titulo: tituloParam,
      nid: nidParam
    });

    const fetchBlogData = async () => {
      try {
        // Obtain all nodes to get categories and tags
        const nodesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/nodes`);
        if (!nodesResponse.ok) throw new Error(`Error en la respuesta: ${nodesResponse.status}`);
        
        const allNodesData = await nodesResponse.json();
        console.log("📌 Todos los nodos recibidos:", allNodesData);
        
        // Filter blogs that are not "nid: 1"
        const filteredNodes = Array.isArray(allNodesData) ? allNodesData.filter(item => item.nid !== "1") : [];
        
        // Extract all categories and tags
        const categories = Array.from(
          new Set(filteredNodes.map((item) => item?.fields?.field_categories?.[0]?.label || "Sin categoría"))
        );
        
        const tags = Array.from(
          new Set(filteredNodes.flatMap((item) => item?.fields?.field_labels?.map((label) => label.label) || []))
        );
        
        setAllCategories(categories);
        setAllTags(tags);
        
        console.log("📌 Todas las categorías:", categories);
        console.log("📌 Todas las etiquetas:", tags);

        // If we have nid, try to fetch directly
        if (nidParam) {
          console.log("📌 Intentando obtener blog directamente con nid:", nidParam);
          
          const directResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/${nidParam}`);
          
          if (directResponse.ok) {
            const blogDetails = await directResponse.json();
            console.log("✅ Blog encontrado directamente por nid:", blogDetails);
            setBlogData(blogDetails);
            setIsLoading(false);
            return;
          } else {
            console.log("⚠️ No se pudo obtener el blog directamente por nid:", nidParam);
          }
        }

        // Use the filtered nodes data we already have
        if (filteredNodes.length === 0) throw new Error("No hay blogs disponibles");

        // Normalizar cadenas para comparación - MODIFICADO para eliminar espacios completamente
        const normalizeString = (str) => {
          if (!str) return '';
          return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Eliminar tildes
            .replace(/[^\w\s]/gi, "") // Eliminar caracteres especiales
            .replace(/\s+/g, "") // Eliminar todos los espacios
            .trim(); // Eliminar espacios al inicio y al final
        };

        const decodedTitulo = normalizeString(decodeURIComponent(tituloParam));
        const decodedCategoria = normalizeString(decodeURIComponent(categoriaParam));

        console.log("📌 Valores normalizados para búsqueda:");
        console.log("Categoría normalizada:", decodedCategoria);
        console.log("Título normalizado:", decodedTitulo);

        let currentBlog = null;

        // Si aún tenemos el nidParam, intentamos buscar por él en los datos filtrados
        if (nidParam && !currentBlog) {
          currentBlog = filteredNodes.find(blog => blog.nid === nidParam);
          if (currentBlog) {
            console.log("✅ Blog encontrado por nid en datos filtrados:", currentBlog);
          }
        }

        // Si no tenemos blog por nid y tenemos categoría y título, buscamos por ellos
        if (!currentBlog && decodedCategoria && decodedTitulo) {
          // Debemos recorrer cada blog y normalizar sus datos para comparar
          currentBlog = filteredNodes.find(blog => {
            const blogCategory = normalizeString(blog?.fields?.field_categories?.[0]?.label || "");
            const blogTitle = normalizeString(blog.title || "");

            console.log(`Comparando blog ${blog.nid}:`);
            console.log(`Categoría: '${blogCategory}' vs '${decodedCategoria}'`);
            console.log(`Título: '${blogTitle}' vs '${decodedTitulo}'`);
            
            // Verificar si la categoría está contenida en la ruta y el título coincide
            const categoryMatch = decodedCategoria === blogCategory || 
                                 decodedCategoria.includes(blogCategory) ||
                                 blogCategory.includes(decodedCategoria);
            
            const titleMatch = decodedTitulo === blogTitle ||
                              decodedTitulo.includes(blogTitle) ||
                              blogTitle.includes(decodedTitulo);
            
            // Para depuración
            if (categoryMatch && titleMatch) {
              console.log(`✅ Coincidencia encontrada para blog ${blog.nid}`);
            }

            return categoryMatch && titleMatch;
          });
        }

        // Si aún no encontramos el blog y tenemos solo título, intentamos solo con eso
        if (!currentBlog && decodedTitulo) {
          currentBlog = filteredNodes.find(blog => {
            const blogTitle = normalizeString(blog.title || "");
            return blogTitle.includes(decodedTitulo) || decodedTitulo.includes(blogTitle);
          });
          
          if (currentBlog) {
            console.log("✅ Blog encontrado solo por título:", currentBlog);
          }
        }

        // Si todo falla, solo cargamos el primer blog de la lista (para desarrollo)
        if (!currentBlog && process.env.NODE_ENV === 'development') {
          currentBlog = filteredNodes[0];
          console.log("⚠️ No se encontró el blog específico. Cargando el primer blog disponible para desarrollo:", currentBlog);
        }

        if (!currentBlog) {
          console.error("⚠️ No se encontró el blog con los valores dados.");
          console.log("🔍 Búsqueda fallida para: ", { decodedCategoria, decodedTitulo });
          console.log("🔍 ¿Quizás hay un error en la API o los nombres no coinciden exactamente?");
          throw new Error("No se encontró el blog específico");
        }

        console.log("✅ Blog seleccionado finalmente:", currentBlog);

        // Hacer la petición específica al blog encontrado
        const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/${currentBlog.nid}`);
        console.log("Obteniendo detalles para nid:", currentBlog.nid);
        
        if (!blogResponse.ok) throw new Error(`Error al obtener el blog: ${blogResponse.status}`);

        const blogDetails = await blogResponse.json();
        console.log("📌 Detalles del blog:", blogDetails);

        setBlogData(blogDetails);

        // Actualizar la URL para reflejar correctamente el blog que estamos viendo
        if (process.env.NODE_ENV === 'development' && (!categoriaParam || !tituloParam)) {
          // Usar normalizeString para eliminar espacios en la URL
          const categorySlug = encodeURIComponent(normalizeString(blogDetails.fields?.field_categories?.[0]?.label || ''));
          const titleSlug = encodeURIComponent(normalizeString(blogDetails.title || ''));
          
          // Actualiza URL sin refrescar la página
          window.history.replaceState(
            {}, 
            '', 
            `/blog/${categorySlug}/${titleSlug}`
          );
        }
      } catch (err) {
        console.error("⚠️ Error:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [categoriaParam, tituloParam, nidParam]);

  // Función para generar slugs sin espacios
  const generateSlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "") // Eliminar espacios
      .trim();
  };

  const handleCategoryClick = (category) => {
    router.push(`/blog?category=${encodeURIComponent(category)}`);
  };

  const handleTagClick = (tag) => {
    router.push(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  if (isLoading) return <p>Cargando contenido del blog...</p>;
  if (error) return <p style={{ color: "red" }}>Error al cargar el contenido del blog: {error}</p>;
  if (!blogData) return <p>No se encontró el contenido del blog.</p>;

  return (
    <div className="internal-blog">
      <div className="internal-blog-header">
        <div className="internal-blog-header-items">
          <div className="internal-blog-header-title">
            <h1 className="internal-blog-title">{blogData.title}</h1>
            <h2 className="internal-blog-subtitle">{blogData.fields?.field_subtitle}</h2>
            <h2 className="internal-blog-label-general">{blogData.fields?.field_categories?.[0]?.label}</h2>
          </div>
          <div className="internal-blog-breadcrumb">
            <Link href="/">Inicio</Link> / <Link href="/blog">Blog</Link> /
            <Link href={`/blog?category=${encodeURIComponent(blogData.fields?.field_categories?.[0]?.label || '')}`}>
              {blogData.fields?.field_categories?.[0]?.label || ''}
            </Link> / {blogData.title}
          </div>
        </div>
      </div>
      <div className="internal-blog-labels-and-article">
        <div className="internal-blog-labels">
          <div className="internal-blog-labels-categories">
            <h1 className="internal-blog-labels-categories-title">Categorias</h1>
            <div className="internal-blog-labels-categories-items">
              {/* Show all categories instead of just the current blog's categories */}
              {allCategories.map((category, index) => (
                <div 
                  className={`internal-blog-label-categories-item ${blogData.fields?.field_categories?.[0]?.label === category ? "active" : ""}`} 
                  key={index}
                >
                  <a 
                    className="internal-blog-label-categories-link" 
                    onClick={() => handleCategoryClick(category)}
                    style={{ cursor: "pointer" }}
                  >
                    {category}
                  </a>
                </div>
              ))}
              <div className="internal-blog-label-categories-item-all">
                <a 
                  className="internal-blog-label-categories-link" 
                  onClick={() => router.push('/blog')}
                  style={{ cursor: "pointer" }}
                >
                  Todas las categorías
                </a>
              </div>
            </div>
          </div>
          <div className="internal-blog-labels-tag">
            <h1 className="internal-blog-labels-tag-title">Etiquetas</h1>
            <div className="internal-blog-labels-tag-items">
              {/* Show all tags instead of just the current blog's tags */}
              {allTags.map((tag, index) => (
                <div 
                  className={`internal-blog-label-tag-item ${blogData.fields?.field_labels?.some(label => label.label === tag) ? "active" : ""}`} 
                  key={index}
                >
                  <a 
                    className="internal-blog-label-tag-link" 
                    onClick={() => handleTagClick(tag)}
                    style={{ cursor: "pointer" }}
                  >
                    {tag}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="internal-blog-article">
          <div className="internal-blog-article-principal-description" dangerouslySetInnerHTML={{ __html: blogData.fields?.field_full_html_text?.split('</p>')[0] + '</p>' }} />

            <div className="internal-blog-article-image">
              <Image src={blogData.fields?.field_principal_image_blog?.[0]?.src || Wdark} alt={blogData.title} width={800} height={450} />
            </div>

          <div className="internal-blog-article-description">
            <div dangerouslySetInnerHTML={{ 
              __html: blogData.fields?.field_full_html_text?.split('</p>').slice(1).join('</p>') || ''
            }} />
          </div>
          <div className="internal-blog-article-logo-wdark">
            {blogData.fields?.field_logo_wdark && 
              blogData.fields.field_logo_wdark[0] && (
                <Image 
                  src={`${process.env.NEXT_PUBLIC_API_URL}${blogData.fields?.field_logo_wdark?.[0]?.src }`}
                  alt={blogData.fields.field_logo_wdark[0].label || "Logo"}
                  width={150}
                  height={50}
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              )
            }
            <div className="internal-blog-article-auth-name-and-position">
              <h2 className="auth-name">{blogData.fields?.field_auth_name || ""}</h2>
              <h2 className="auth-position">{blogData.fields?.field_auth_position || ""}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}