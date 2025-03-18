"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/header-footer`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setFooterData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchFooterData();
  }, []);

  if (loading) return <footer className="site-footer"></footer>;
  if (!footerData) return null;

  const { "section-footer": sectionFooter } = footerData;
  
  return (
    <footer className="site-footer">
      <div className="region-footer-first">
        <div className="footer-image-logo">
          <a>
            <Image 
              src={`${process.env.NEXT_PUBLIC_API_URL}${sectionFooter.logo.src}`}
              alt={sectionFooter.logo.alt} 
              width={75} 
              height={75} 
              priority
            />
          </a>
        </div>
        <div className="footer-social-networks">
          <div className="footer-social-networks-items">
            {sectionFooter["social-networks"].map((network, index) => (
              <div key={index} className="footer-social-networks-item">
                <a href={network.url} target="_blank" rel="noopener noreferrer">
                  {/* Si tienes imágenes específicas para cada red social, puedes usar un switch o un objeto para mapearlas */}
                  {network.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="site-footer-bottom">
        <div className="site-footer-bottom-name-and-motto">
          <p>{sectionFooter.copyright}</p>
          <p>
            <a>{sectionFooter.motto.main}</a>/ {sectionFooter.motto.secondary}
          </p>
        </div>
      </div>
    </footer>
  );
}