"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Allies() {
  const [allies, setAllies] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/1`);

        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const data = await response.json();
        
        // Buscar la sección "section-allies" dentro de field_componentes
        const alliesSection = data.fields.field_componentes.find(
          component => component["section-allies"]
        );
        
        if (alliesSection && alliesSection["section-allies"]) {
          setAllies(alliesSection["section-allies"].allies || []);
          setTitle(alliesSection["section-allies"].title || "");
        } else {
          throw new Error("No se encontró la sección 'section-allies'.");
        }
      } catch (err) {
        console.error("Error al obtener los aliados:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllies();
  }, []);

  if (isLoading) {
    return (
      <section className="loading-section">
        <p>Cargando aliados...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="error-section">
        <p>Error al cargar los aliados: {error}</p>
      </section>
    );
  }

  return (
    <section>
      <div className="our-allies-wda">
        <div className="our-allies-wda-title">
          <h2>{title}</h2>
        </div>
        <div className="our-allies-wda-items">
          {allies.map((ally, index) => (
            <div className="our-allies-wda-item" key={index}>
              <div className="our-allies-wda-item-link-image">
                {ally.link ? (
                  <a href={ally.link} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={process.env.NEXT_PUBLIC_API_URL + ally.image}
                      alt={ally.alt || ""}
                      width={150}
                      height={100}
                      style={{ height: "auto" }}
                      priority
                    />
                  </a>
                ) : (
                  <Image
                    src={process.env.NEXT_PUBLIC_API_URL + ally.image}
                    alt={ally.alt || ""}
                    width={150}
                    height={100}
                    style={{ height: "auto" }}
                    priority
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}