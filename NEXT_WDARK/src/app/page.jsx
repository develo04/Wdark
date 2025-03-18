"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "./layout/header";
import Footer from "./layout/footer";
import AboutUs from "./components/aboutUs";
import MainBanner from "./components/mainBanner";
import FindUs from "./components/findUs";
import Services from "./components/services";
import Allies from "./components/allies";
import Link from "next/link";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulamos un tiempo para que todos los componentes se carguen
    // En un escenario real, podrías usar Promise.all para esperar múltiples fetches
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <div id="load">
          <div>G</div>
          <div>N</div>
          <div>I</div>
          <div>D</div>
          <div>A</div>
          <div>O</div>
          <div>L</div>
        </div>
      ) : (
        <div className={styles.page}>
          <MainBanner />
          <AboutUs />
          <Services />
          <Allies />
          <FindUs />
        </div>
      )}
    </>
  );
}