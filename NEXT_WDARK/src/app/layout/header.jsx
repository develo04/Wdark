"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import defaultLogo from "../img/logo.jpg"; // Asegúrate de que esta ruta sea correcta
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerData, setHeaderData] = useState({
    logo: { src: "", alt: "WDARK Logo" },
    desktopMenu: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los datos del header
  const fetchHeaderData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/json/header-footer`);
      
      const data = await response.json();
      
      // Adaptar los datos según la estructura proporcionada
      setHeaderData({
        logo: data["section-header"].logo,
        desktopMenu: data["section-header"]["desktop-menu"]
      });
      console.log(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching header data:", err);
      setError("No se pudieron cargar los datos del menú");
      // Mantener los datos por defecto si falla la API
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Efecto para obtener los datos del header
  useEffect(() => {
    fetchHeaderData();
  }, []);

  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    // Agregar el event listener
    window.addEventListener('scroll', handleScroll);
    
    // Verificar el estado inicial
    handleScroll();
    
    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container">
        {/* Logo */}
        <Link href="/" className="logo-header">
          {headerData.logo.src ? (
            // Si tenemos un logo del servidor
            <Image 
              src={`${process.env.NEXT_PUBLIC_API_URL}${headerData.logo.src}`}
              alt={headerData.logo.alt}
              width={200}
              height={64}
              priority
            />
          ) : (
            // Logo por defecto (importado)
            <Image 
              src={defaultLogo}
              alt="Logo por defecto"
              width={200}
              height={64}
              priority
            />
          )}
        </Link>

        {isLoading ? (
          <div className="loading-indicator"></div>
        ) : (
          <>
            {/* Menú en Desktop */}
            <ul className="desktop-menu">
              {error && <li className="error-message">{error}</li>}
              
              {headerData.desktopMenu.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>ES ▾</li>
            </ul>

            {/* Botón hamburguesa en Móvil */}
            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Menú desplegable en Móvil */}
            <ul className={`mobile-menu ${menuOpen ? "open" : ""}`}>
              {error && <li className="error-message">{error}</li>}
              
              {headerData.desktopMenu.map((item, index) => (
                <li key={index} onClick={toggleMenu}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>ES ▾</li>
            </ul>
          </>
        )}
      </nav>
    </header>
  );
}