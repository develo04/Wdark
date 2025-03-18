"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function FindUs() {
  const [contactMethods, setContactMethods] = useState([]);
  const [contactTitle, setContactTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/1`);
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Buscar la sección "section-contact" dentro de field_componentes
        if (data.fields && data.fields.field_componentes) {
          // Recorrer todos los componentes principales
          for (const component of data.fields.field_componentes) {
            // Verifica si tiene la propiedad components
            if (component.components && Array.isArray(component.components)) {
              // Busca en el array de components el que tenga section-contact directamente
              const contactComponent = component.components.find(
                item => item["section-contact"]
              );
              
              if (contactComponent && contactComponent["section-contact"]) {
                setContactMethods(contactComponent["section-contact"]["contact-methods"] || []);
                setContactTitle(contactComponent["section-contact"].title || "ENCUÉNTRANOS");
                setIsLoading(false);
                return; // Termina la función una vez encontramos los datos
              }
            }
          }
          
          // Si llegamos aquí, no encontramos la sección
          throw new Error("No se encontró la sección 'section-contact' o está vacía");
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

  if (isLoading) {
    return <p>Cargando información de contacto...</p>;
  }

  if (error) {
    return <p>Error al cargar la información de contacto: {error}</p>;
  }

  return (
    <section id="contact">
      <div className="find-us">
        <div className="find-us-title">
          <h1>{contactTitle}</h1>
        </div>
        <div className="find-us-items">
          {contactMethods.map((method, index) => (
            <div className="find-us-item" key={index}>
              <div className="find-us-image">
                <Image
                  src={process.env.NEXT_PUBLIC_API_URL + method.image}
                  alt={method.alt || method.title}
                  width={31}
                  height={40}
                  priority
                />
              </div>
              <div className="find-us-description">
                <h2 className="find-us-title-description">{method.title}</h2>
                <a href={method.link} target="_blank" rel="noopener noreferrer">
                  {method.value}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}