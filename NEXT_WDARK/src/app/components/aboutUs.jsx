"use client";
import { useEffect, useState, useRef } from "react";

export default function AboutUs() {
  // Estados para los datos
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [progressData, setProgressData] = useState([]);
  
  // Estados para control de UI
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Fetch de los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/1`, { method: "GET" });
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Buscar la sección about-us dentro de fields.field_componentes
        if (data.fields && data.fields.field_componentes) {
          // Encuentra el objeto que contiene section-about-us
          const aboutUsComponent = data.fields.field_componentes.find(
            component => component["section-about-us"]
          );
          
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
            
            // Marcar los datos como cargados
            setDataLoaded(true);
          } else {
            throw new Error("No se encontró la sección 'section-about-us'");
          }
        } else {
          throw new Error("No se encontró la estructura esperada en los datos");
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);



  return (
    <section id="about" ref={sectionRef}>
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
    </section>
  );
}