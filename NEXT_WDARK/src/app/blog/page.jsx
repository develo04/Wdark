"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Wdark from "../img/galaxia.jpg";

export default function BlogHome() {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const categoryFromUrl = searchParams.get("category");
  const tagFromUrl = searchParams.get("tag");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || null);
  const [selectedTag, setSelectedTag] = useState(tagFromUrl || null);

  const extractWords = (htmlText, wordCount = 35) => {
    if (!htmlText) return "";
    const textWithoutTags = htmlText.replace(/<[^>]*>/g, " ");
    const words = textWithoutTags.split(/\s+/).filter((word) => word.length > 0);
    return words.slice(0, wordCount).join(" ") + (words.length > wordCount ? "..." : "");
  };

  // Función para normalizar y eliminar espacios en strings
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

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/json/nodes`;
        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const data = await response.json();
        // Filtra por tipo "blog" en lugar de excluir nid "1"
        const filteredData = Array.isArray(data) ? data.filter((item) => item.type === "blog") : [];
        setBlogData(filteredData);

        const categories = Array.from(
          new Set(filteredData.map((item) => item?.fields?.field_categories?.[0]?.label || "Sin categoría"))
        );
        const tags = Array.from(
          new Set(filteredData.flatMap((item) => item?.fields?.field_labels?.map((label) => label.label) || []))
        );

        setAllCategories(categories);
        setAllTags(tags);
      } catch (err) {
        console.error("Error al obtener los datos del blog:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // MODIFICADO: La función handleArticleClick ahora elimina los espacios en la URL
  const handleArticleClick = (blog) => {
    const category = blog.fields?.field_categories?.[0]?.label || "sin-categoria";
    const title = blog.title;
    const nid = blog.nid;

    // Usar la función normalizeString para eliminar espacios
    const normalizedCategory = normalizeString(category);
    const normalizedTitle = normalizeString(title);

    // Construir la URL sin espacios
    router.push(`/blog/${normalizedCategory}/${normalizedTitle}?nid=${nid}`);
  };

  const handleCategorySelect = (category) => {
    const newCategory = category === selectedCategory ? null : category;
    setSelectedCategory(newCategory);
    updateUrl(newCategory, selectedTag);
  };

  const handleTagSelect = (tag) => {
    const newTag = tag === selectedTag ? null : tag;
    setSelectedTag(newTag);
    updateUrl(selectedCategory, newTag);
  };

  const updateUrl = (category, tag) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    router.push(params.toString() ? `?${params.toString()}` : "");
  };

  useEffect(() => {
    if (blogData.length > 0) {
      let filtered = [...blogData];

      if (selectedCategory) {
        filtered = filtered.filter((blog) =>
          blog?.fields?.field_categories?.[0]?.label === selectedCategory
        );
      }

      if (selectedTag) {
        filtered = filtered.filter((blog) =>
          blog?.fields?.field_labels?.some((label) => label.label === selectedTag)
        );
      }

      setFilteredArticles(filtered);
    } else {
      setFilteredArticles([]);
    }
  }, [blogData, selectedCategory, selectedTag]);

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="principal-blog">
      <div className="principal-blog-header">
        <div className="principal-blog-header-items">
          <div className="principal-blog-header-title">
            <h1 className="principal-blog-title">Blog</h1>
            <h2 className="principal-blog-subtitle">
              Nuestro conocimiento en tus manos
            </h2>
          </div>
          <div className="principal-blog-breadcrumb">
            <Link href="/">Inicio</Link> / Blog
            {selectedCategory && <> / {selectedCategory}</>}
            {selectedTag && <> / {selectedTag}</>}
          </div>
        </div>
      </div>
      <div className="principal-blog-labels-and-articles">
        <div className="principal-blog-labels">
          <div className="principal-blog-labels-categories">
            <h1 className="principal-blog-labels-categories-title">Categorías</h1>
            <div className="principal-blog-labels-categories-items">
              {allCategories.map((category, index) => (
                <a
                  className={`principal-blog-label-categories-item ${selectedCategory === category ? "active" : ""}`}
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  style={{ cursor: "pointer" }}
                >
                  {category}
                </a>
              ))}
              <div className="principal-blog-label-categories-item-all">
                <a
                  className="principal-blog-label-categories-link"
                  onClick={() => handleCategorySelect(null)}
                  style={{ cursor: "pointer" }}
                >
                  Todas las categorías
                </a>
              </div>
            </div>
          </div>
          <div className="principal-blog-labels-tag">
            <h1 className="principal-blog-labels-tag-title">Etiquetas</h1>
            <div className="principal-blog-labels-tag-items">
              {allTags.map((tag, index) => (
                <div
                  className={`principal-blog-label-tag-item ${selectedTag === tag ? "active" : ""}`}
                  key={index}
                >
                  <a
                    className="principal-blog-label-tag-link"
                    onClick={() => handleTagSelect(tag)}
                    style={{ cursor: "pointer" }}
                  >
                    {tag}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="principal-blog-articles">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((blog, index) => (
              <div onClick={() => handleArticleClick(blog)} style={{ cursor: "pointer" }} 
              className="principal-blog-article" key={index}>
                <div className="principal-blog-article-title">{blog.title}</div>
                <div className="principal-blog-article-image">
                  <Image
                    className="principal-blog-image"
                    src={blog.fields?.field_principal_image_blog?.[0]?.src || Wdark}
                    alt={blog.title || "Imagen del blog"}
                    width={300}
                    height={150}
                    priority
                  />
                  <div className="principal-blog-article-date">
                    <p>{new Date(blog.created * 1000).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>
                <div className="principal-blog-article-label">
                  <span>{blog.fields?.field_categories?.[0]?.label || "Sin categoría"}</span>
                </div>
                <div className="principal-blog-article-description">
                  <p>{extractWords(blog.fields?.field_full_html_text, 35)}</p>
                </div>
                <div className="principal-blog-article-see-more">
                  <a onClick={() => handleArticleClick(blog)} style={{ cursor: "pointer" }}>
                    Ver más
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="principal-blog-no-articles">No hay artículos disponibles</div>
          )}
        </div>
      </div>
    </div>
  );
}