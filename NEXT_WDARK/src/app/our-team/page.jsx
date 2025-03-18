"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function OurTeam() {
  const [teamData, setTeamData] = useState({
    title: "",
    description: "",
    mainImage: { src: "", alt: "" },
    services: [],
    teamMembers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/4`, {
          method: "GET"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extraer los datos según la estructura del JSON
        const componentes = data.fields.field_componentes || [];
        let extractedData = {
          title: "",
          description: "",
          mainImage: { src: "", alt: "" },
          services: [],
          teamMembers: []
        };

        // Recorrer los componentes para extraer la información necesaria
        componentes.forEach(componentGroup => {
          if (componentGroup.components && Array.isArray(componentGroup.components)) {
            componentGroup.components.forEach(component => {
              // Extraer título de la sección
              if (component["section-title"]) {
                if (component["section-title"].title) {
                  extractedData.title = component["section-title"].title;
                }
                if (component["section-title"].subtitle === "Nuestros servicios") {
                  // Marcar que estamos en la sección de servicios
                }
                if (component["section-title"].subtitle === "Nuestro equipo") {
                  // Marcar que estamos en la sección de equipo
                }
              }

              // Extraer descripción completa
              if (component["section-description-full-html"] && 
                  component["section-description-full-html"].field_text_full_html) {
                extractedData.description = component["section-description-full-html"].field_text_full_html;
              }

              // Extraer imagen principal
              if (component["section-media-component"] && 
                  component["section-media-component"].field_media && 
                  component["section-media-component"].field_media.length > 0) {
                extractedData.mainImage = {
                  src: component["section-media-component"].field_media[0].src,
                  alt: component["section-media-component"].field_media[0].alt
                };
              }

              // Extraer servicios/valores
              if (component["section-services"] && 
                  component["section-services"].services) {
                extractedData.services = component["section-services"].services;
              }

              // Extraer miembros del equipo
              if (component["section-business-cards"] && 
                  component["section-business-cards"].field_cover_letters) {
                extractedData.teamMembers = component["section-business-cards"].field_cover_letters.map(member => {
                  if (member["section-integrantes"]) {
                    const memberData = member["section-integrantes"];
                    return {
                      name: memberData.field_name || "",
                      position: memberData.field_position || "",
                      photo: memberData.field_photo && memberData.field_photo.length > 0 
                             ? memberData.field_photo[0].url : "",
                      linkedin: memberData.field_link && memberData.field_link.length > 0 
                               ? memberData.field_link[0].url : "",
                      email: memberData.field_link_to_social_media && memberData.field_link_to_social_media.length > 0
                            ? memberData.field_link_to_social_media[0].url : ""
                    };
                  }
                  return null;
                }).filter(Boolean);
              }
            });
          }
        });

        setTeamData(extractedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();

    // Configuración de animaciones al scroll
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      
      // Animación de elementos al desplazarse
      const animatedElements = document.querySelectorAll('.about-text, .about-image');
      const valueCards = document.querySelectorAll('.value-card');
      const teamMembers = document.querySelectorAll('.team-member');
      
      animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          el.classList.add('animated');
        }
      });
      
      // Animación secuencial de las tarjetas de valores
      valueCards.forEach((card, index) => {
        const elementTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          setTimeout(() => {
            card.classList.add('animated');
          }, index * 200);
        }
      });
      
      // Animación secuencial de los miembros del equipo
      teamMembers.forEach((member, index) => {
        const elementTop = member.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          setTimeout(() => {
            member.classList.add('animated');
          }, index * 200);
        }
      });
    };

    // Función para activar animaciones en la carga inicial
    const handleLoad = () => {
      const animatedElements = document.querySelectorAll('.about-text, .about-image, .value-card, .team-member');
      
      animatedElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          el.classList.add('animated');
        }
      });
    };

    // Agregar los event listeners
    window.addEventListener('scroll', handleScroll);
    
    // Ejecutar handleLoad una vez que el componente esté montado
    handleLoad();

    // Limpiar los event listeners cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error al cargar los datos: {error}</div>;

  // Función para procesar HTML
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <section id="our-team">
      <div className="our-team-page">
        <section className="hero-our-team">
          <div className="container">
            <div className="hero-content-our-team">
              <div className="hero-content-title">
                <h1>{teamData.title}</h1>
                <div dangerouslySetInnerHTML={createMarkup(teamData.description)} />
              </div>
              <div className="about-image">
                {teamData.mainImage.src && (
                  <img 
                    src={teamData.mainImage.src} 
                    alt={teamData.mainImage.alt} 
                    width={500}
                    height={300}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="section-title-our-team">
              <h2>Nuestros Valores</h2>
            </div>
            
            <div className="values-container">
              {teamData.services.map((service, index) => (
                <div className="value-card" key={index}>
                  <div className="value-icon">{service.name.charAt(0)}</div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  {service.image && (
                    <div className="value-image">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      
        <section className="team-section">
          <div className="container">
            <div className="section-title-our-team">
              <h2>Nuestro Equipo</h2>
            </div>
            
            <div className="team-container">
              {teamData.teamMembers.map((member, index) => (
                <div className="team-member" key={index}>
                  <div className="member-image">
                    {member.photo && (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        width={200}
                        height={200}
                      />
                    )}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <span className="member-position">{member.position}</span>
                    <div className="social-links">
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <i>L</i>
                        </a>
                      )}
                      {member.email && (
                        <a href={member.email} target="_blank" rel="noopener noreferrer">
                          <i>E</i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}