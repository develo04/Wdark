"use client";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "next-i18next";

export default function AboutUs() {
  // Estados para los datos
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [progressData, setProgressData] = useState([]);
  
  // Estados para control de UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  
  // Obtener el idioma actual usando next-i18next
  const { i18n } = useTranslation();
  const currentLanguage = i18n?.language || 'es'; // 'es' como valor predeterminado
  
  console.log(`AboutUs: idioma actual es ${currentLanguage}`);

  // Fetch de los datos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Usar el idioma actual en la URL
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${currentLanguage}/json/node/1`;
        console.log(`AboutUs: Obteniendo datos desde ${apiUrl}`);
        
        const response = await fetch(apiUrl, { method: "GET" });
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Buscar la sección about-us dentro de fields.field_componentes
        if (data.fields && data.fields.field_componentes) {
          // Recorre todos los componentes
          for (const component of data.fields.field_componentes) {
            // Verifica si tiene la propiedad components
            if (component.components && Array.isArray(component.components)) {
              // Busca en el array de components el que tenga section-about-us directamente
              const aboutUsComponent = component.components.find(item => item["section-about-us"]);
              
              if (aboutUsComponent && aboutUsComponent["section-about-us"]) {
                const aboutData = aboutUsComponent["section-about-us"];
                
                // Actualizar estados con los datos del JSON
                setTitle(aboutData.title || "");
                setDescription(aboutData.description || "");
                setCtaText(aboutData.cta_text || "");
                
                // Verificar y procesar los datos de skills
                if (aboutData.skills && aboutData.skills.list && aboutData.skills.percents) {
                  // Crear array de objetos combinando list y percents
                  const newProgressData = aboutData.skills.list.map((title, index) => ({
                    title: title,
                    value: aboutData.skills.percents[index] || 0
                  }));
                  
                  setProgressData(newProgressData);
                }
                
                setIsLoading(false);
                console.log(`AboutUs: Datos cargados correctamente en ${currentLanguage}`);
                return; // Termina la función una vez que encontramos los datos
              }
            }
          }
          
          // Si llegamos aquí, no encontramos la sección
          throw new Error("No se encontró la sección 'section-about-us'");
        } else {
          throw new Error("No se encontró la estructura esperada en los datos");
        }
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentLanguage]); // Dependencia para que se vuelva a ejecutar cuando cambie el idioma

  return (
    <section id="about" ref={sectionRef}>
      {isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Cargando contenido en {currentLanguage === 'en' ? 'inglés' : 'español'}...</p>
        </div>
      ) : error ? (
        <div className="error-container">Error: {error}</div>
      ) : (
        <div className="about-us">
          <div className="about-us-title">
            <h1>{title}</h1>
            <a>{ctaText}</a>
          </div>

          <div className="about-us-description">
            <div className="about-us-description-progress">
              {progressData.map((item, index) => (
                <div className="tpl-progres" key={index}>
                  <div className="progress-bar">
                    <h5>{item.title}</h5>

                    {/* Barra de progreso animada */}
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.value}%`,
                        transition: "width 1s ease",
                      }}
                    ></div>

                    <span>{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-us-description-full">
              <div className="description-full">
                <p 
                  dangerouslySetInnerHTML={{ __html: description }}>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}