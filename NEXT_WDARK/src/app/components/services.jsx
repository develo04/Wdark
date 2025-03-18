"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Services() {
  // Estado para almacenar los servicios
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/1`);
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Buscar la sección services dentro de fields.field_componentes
        if (data.fields && data.fields.field_componentes) {
          // Recorre todos los componentes principales
          for (const component of data.fields.field_componentes) {
            // Verifica si tiene la propiedad components
            if (component.components && Array.isArray(component.components)) {
              // Busca en el array de components el que tenga section-services directamente
              const servicesComponent = component.components.find(
                item => item["section-services"]
              );
              
              if (servicesComponent && servicesComponent["section-services"] && 
                  servicesComponent["section-services"].services) {
                setServices(servicesComponent["section-services"].services);
                setIsLoading(false);
                return; // Termina la función una vez encontramos los datos
              }
            }
          }
          
          // Si llegamos aquí, no encontramos la sección
          throw new Error("No se encontró la sección 'section-services' o no contiene servicios");
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
  }, []);

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <section id="services" className="loading-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </section>
    );
  }

  // Si hay un error, mostrar mensaje
  if (error) {
    return (
      <section id="services" className="error-section">
        <div className="error-container">
          <p>Error al cargar los servicios: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services">
      <div className="services-help-you">
        <div className="services-help">
          <div className="services-help-title">
            <h2>Servicios</h2>
            <h4>Podemos ayudarte a crear tú mundo</h4>
          </div>
          <div className="services-help-items">
            {services.map((service, index) => (
              <div className="services-help-item" key={index}>
                <div className="flip flip-vertical">
                  <div className="front">
                    <div className={`services-help-item-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      {service.image && (
                        <Image 
                          src={process.env.NEXT_PUBLIC_API_URL + service.image}
                          alt={`${service.name} Logo`}
                          width={51}
                          height={40}
                          priority
                        />
                      )}
                      <h3>{service.name}</h3>
                    </div>
                  </div>
                  <div className="back">
                    <div className={`services-help-item-${service.name.toLowerCase().replace(/\s+/g, '-')}-description`}>
                      <p dangerouslySetInnerHTML={{ __html: service.description }}></p>
                      <div className={`services-help-item-${service.name.toLowerCase().replace(/\s+/g, '-')}-join-us`}>
                        <a>{service.cta}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}