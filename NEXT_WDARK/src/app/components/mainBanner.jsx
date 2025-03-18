"use client";
import { useState, useEffect } from 'react';

export default function MainBanner() {
  const [bannerData, setBannerData] = useState({
    id: "",
    title: "",
    subtitle: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/node/1`, {
          method: "GET"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Extract the section-main-banner data
        // Based on your JSON structure, we need to navigate properly to the data
        const componentes = data.fields.field_componentes || [];
        
        // Look for the component that contains section-main-banner
        for (const componentGroup of componentes) {
          if (componentGroup.components && Array.isArray(componentGroup.components)) {
            for (const component of componentGroup.components) {
              if (component["section-main-banner"]) {
                setBannerData(component["section-main-banner"]);
                break;
              }
            }
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching banner data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error loading banner data: {error}</div>;

  return (
    <section id={bannerData.id || "inicio"} className="banner-section">
      <div className="banner-home">
      <div className="banner-home-image-and-description">
          <h2 className="banner-subtitle">{bannerData.subtitle}</h2>
          <h1 className="banner-title">{bannerData.title}</h1>
          <a href="/#about" className="button-see-more-banner">Ver mas</a>
        </div>
      </div>
    </section>
  );
}