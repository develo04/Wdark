"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import defaultLogo from "../img/logo.jpg";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerData, setHeaderData] = useState({
    logo: { src: "", alt: "WDARK Logo" },
    desktopMenu: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  
  // Valor por defecto para el idioma
  const currentLanguage = i18n?.language || 'es';

  // Función para cambiar el idioma
  const changeLanguage = (lng) => {
    if (i18n && i18n.changeLanguage) {
      console.log(`Cambiando idioma a: ${lng}`);
      
      // Cambiar el idioma en i18n
      i18n.changeLanguage(lng);
      
      // Obtener la ruta actual y reemplazar el prefijo de idioma o agregarlo
      const path = window.location.pathname;
      const pathWithoutLang = path.replace(/^\/(es|en)/, '');
      const newPath = `/${lng}${pathWithoutLang || '/'}`;
      
      // Actualizar la URL en el navegador sin recargar la página
      window.history.pushState({}, '', newPath);
      
      // Cerrar el dropdown después de seleccionar
      setLangDropdownOpen(false);
      
      // Recargar los datos del header con el nuevo idioma
      fetchHeaderData();
    }
  };

  // Idiomas disponibles
  const languages = [
    { code: 'en', label: 'ENGLISH' },
    { code: 'es', label: 'ESPAÑOL' }
  ];

  // Función para obtener los datos del header
  const fetchHeaderData = async () => {
    setIsLoading(true);
    try {
      // Usando el formato descrito: /en/json/header-footer o /es/json/header-footer
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${currentLanguage}/json/header-footer`;
      console.log(`Obteniendo datos del header desde: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Adaptar los datos según la estructura proporcionada
      setHeaderData({
        logo: data["section-header"]?.logo || { src: "", alt: "WDARK Logo" },
        desktopMenu: data["section-header"]?.["desktop-menu"] || []
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching header data:", err);
      setError(t('errorLoadingMenu', 'No se pudieron cargar los datos del menú'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLangDropdown = () => {
    setLangDropdownOpen(!langDropdownOpen);
  };

  // Efecto para cerrar el dropdown de idioma al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Efecto para obtener los datos del header
  useEffect(() => {
    fetchHeaderData();
  }, [currentLanguage]); // Refetch cuando cambie el idioma

  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Componente del selector de idioma desplegable
  const LanguageSelector = () => (
    <div className="language-selector" ref={langDropdownRef}>
      <button 
        className="language-current" 
        onClick={toggleLangDropdown}
        aria-expanded={langDropdownOpen}
      >
        <span>{currentLanguage === 'en' ? 'EN' : 'ES'}</span>
        <FaChevronDown className={`dropdown-arrow ${langDropdownOpen ? 'open' : ''}`} />
      </button>
      
      {langDropdownOpen && (
        <ul className="language-dropdown">
          {languages.map((lang) => (
            <li 
              key={lang.code} 
              onClick={() => changeLanguage(lang.code)}
              className={currentLanguage === lang.code ? 'active' : ''}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );



  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-container">
        {/* Logo */}
        <Link href={`/`} className="logo-header">
          {headerData.logo.src ? (
            <Image 
              src={`${process.env.NEXT_PUBLIC_API_URL}${headerData.logo.src}`}
              alt={headerData.logo.alt}
              width={200}
              height={64}
              priority
            />
          ) : (
            <Image 
              src={defaultLogo}
              alt="WDARK Logo"
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
                  <Link href={(item.href)}>
                    {t(`nav.${item.label}`, item.label)}
                  </Link>
                </li>
              ))}
              <li className="lang-dropdown-container"><LanguageSelector /></li>
            </ul>

            {/* Botón hamburguesa en Móvil */}
            <button className="menu-toggle" onClick={toggleMenu} aria-label={t('toggleMenu', 'Toggle menu')}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Menú desplegable en Móvil */}
            <ul className={`mobile-menu ${menuOpen ? "open" : ""}`}>
              {error && <li className="error-message">{error}</li>}
              
              {headerData.desktopMenu.map((item, index) => (
                <li key={index} onClick={toggleMenu}>
                  <Link href={(item.href)}>
                    {t(`nav.${item.label}`, item.label)}
                  </Link>
                </li>
              ))}
              <li className="lang-dropdown-container"><LanguageSelector /></li>
            </ul>
          </>
        )}
      </nav>
    </header>
  );
}