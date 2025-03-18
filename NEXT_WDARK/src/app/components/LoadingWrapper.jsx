"use client";

import { useState, useEffect } from "react";

export default function LoadingWrapper({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulamos un tiempo para la carga inicial
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
        children
      )}
    </>
  );
}