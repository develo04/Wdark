"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Portfolio() {
  // Estado para almacenar los datos del portafolio
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Categorías para filtrar los proyectos (se podrían extraer de los datos)
  const categories = ['Todos', 'Web', 'Mobile', 'E-commerce', 'SaaS'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Proyectos filtrados
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  // Obtener datos del API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/5`, {
          method: "GET"
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        
        const data = await response.json();
        setPortfolioData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Procesar los datos y extraer proyectos
  useEffect(() => {
    if (portfolioData) {
      // Extraer proyectos del JSON recibido
      const components = portfolioData.fields.field_componentes || [];
      const portfolioSection = components.find(item => 
        item.components && item.components.some(comp => comp['section-porta'])
      );
      
      if (portfolioSection) {
        // Extraer todos los proyectos (section-porta)
        const projects = portfolioSection.components
          .filter(comp => comp['section-porta'])
          .map((comp, index) => {
            const projectData = comp['section-porta'];
            return {
              id: index + 1,
              title: projectData.field_text || '',
              description: projectData.field_description || '',
              image: projectData.field_image && projectData.field_image[0] ? 
                projectData.field_image[0].src : '/api/placeholder/600/400',
              imageAlt: projectData.field_image && projectData.field_image[0] ? 
                projectData.field_image[0].alt : '',
              category: index % 2 === 0 ? 'Web' : 'Mobile', // Asignación de ejemplo, ajusta según necesites
              link: projectData.field_link && projectData.field_link[0] ? 
                projectData.field_link[0].url.replace('internal:', '') : '/',
              linkText: projectData.field_link && projectData.field_link[0] ? 
                projectData.field_link[0].title : 'Ver'
            };
          });
          
        // Filtrar según categoría seleccionada
        setFilteredProjects(
          selectedCategory === 'Todos' 
            ? projects 
            : projects.filter(project => project.category === selectedCategory)
        );
      }
    }
  }, [portfolioData, selectedCategory]);
  
  // Animación de elementos al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const projectCards = document.querySelectorAll('.project-card');
      
      projectCards.forEach((card, index) => {
        const elementTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          setTimeout(() => {
            card.classList.add('animated');
          }, index * 150);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Ejecutar una vez al cargar
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filteredProjects]);

  // Extraer textos de las secciones
  const getHeroContent = () => {
    if (!portfolioData) return { title: '', subtitle: '' };
    
    const components = portfolioData.fields.field_componentes || [];
    const heroSection = components[0]?.components?.find(comp => comp['section-title']);
    
    return {
      title: heroSection?.['section-title']?.title || '',
      subtitle: heroSection?.['section-title']?.subtitle || ''
    };
  };
  
  const getPortfolioTitle = () => {
    if (!portfolioData) return '';
    
    const components = portfolioData.fields.field_componentes || [];
    const portfolioSection = components[1]?.components?.find(comp => comp['section-title']);
    
    return portfolioSection?.['section-title']?.subtitle || '';
  };
  
  const getCtaContent = () => {
    if (!portfolioData) return { title: '', subtitle: '', buttonText: '', buttonLink: '/' };
    
    const components = portfolioData.fields.field_componentes || [];
    const ctaSection = components[2]?.components || [];
    const titleComp = ctaSection.find(comp => comp['section-title']);
    const buttonComp = ctaSection.find(comp => comp['section-component-button-general']);
    
    return {
      title: titleComp?.['section-title']?.title || '',
      subtitle: titleComp?.['section-title']?.subtitle || '',
      buttonText: buttonComp?.['section-component-button-general']?.field_link?.[0]?.title || '',
      buttonLink: buttonComp?.['section-component-button-general']?.field_link?.[0]?.url?.replace('internal:', '') || '/'
    };
  };
  
  // Contenido de las secciones
  const heroContent = getHeroContent();
  const portfolioTitle = getPortfolioTitle();
  const ctaContent = getCtaContent();

  if (loading) {
    return <div className="loading">Cargando proyectos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <section id='portfolio'>
      <div className="portfolio-page">
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>{heroContent.title}</h1>
              <p>{heroContent.subtitle}</p>
            </div>
          </div> 
        </section>

        <section className="all-projects">
          <div className="container">
            <div className="section-title">
              <h2>{portfolioTitle}</h2>
            </div>
            
            <div className="filter-container">
              <ul className="filter-categories">
                {categories.map((category) => (
                  <li key={category}>
                    <button 
                      className={selectedCategory === category ? 'active' : ''}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    <img src={project.image} alt={project.imageAlt} />
                    <div className="project-overlay">
                      <Link href={project.link} className="btn-view">
                        {project.linkText}
                      </Link>
                    </div>
                  </div>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <span className="project-category">{project.category}</span>
                    <p>{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>{ctaContent.title}</h2>
              <p>{ctaContent.subtitle}</p>
              <Link href={ctaContent.buttonLink} className="btn-primary">
                {ctaContent.buttonText}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}