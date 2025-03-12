"use client";


import { useEffect } from "react";
import Image from "next/image";
import Wdark from "../img/WEBDIGITALARK.png";
import Qr from "../img/QR.png"
import FullStack from "../img/Fullstack.png";
import FrontLead from "../img/Frontlead.png";
import FrontJunior from "../img/Frontjunior.png";
import BackLead from "../img/Backlead.png";
import BackJunior from "../img/Backjunior.png";

export default function OurTeam() {
  useEffect(() => {
    // Seleccionar todas las tarjetas después de que el componente se monte
    const cards = document.querySelectorAll('.card');
    
    // Añadir el evento de clic a cada tarjeta
    cards.forEach(card => {
      card.addEventListener('click', function() {
        this.classList.toggle('is-flipped');
      });
    });
    
    // Limpiar los event listeners cuando el componente se desmonte
    return () => {
      cards.forEach(card => {
        card.removeEventListener('click', function() {
          this.classList.toggle('is-flipped');
        });
      });
    };
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  // Datos del equipo
  const teamMembers = [
    {
      name: "BROWIING JIMENEZ",
      role: "JUNIOR-BACK DEVELOPER",
      image: BackJunior,
      alt: "Backjunior"
    },
    {
      name: "DAVID CHAVES",
      role: "BACKLEAD DEVELOPER",
      image: BackLead,
      alt: "Backlead"
    },
    {
      name: "JULIAN ROZO",
      role: "FULLSTACK DEVELOPER",
      image: FullStack,
      alt: "Fullstack"
    },
    {
      name: "MATEO HERNANDEZ",
      role: "FRONTLEAD DEVELOPER",
      image: FrontLead,
      alt: "Frontlead"
    },
    {
      name: "ALEJANDRO PEÑALOZA",
      role: "JUNIOR-FRONT DEVELOPER",
      image: FrontJunior,
      alt: "Frontjunior"
    }
  ];

  return (
    <div className="our-team-page">
      <div className="slide-track">
        {teamMembers.map((member, index) => (
          <div className="scene scene--card" key={index}>
            <div className="card">
              <div className="card__face card__face--front">
                <div className="wrapper">
                  <Image className="cover-image" src={Wdark} alt="wdark" />
                </div>
                <Image 
                  alt={member.alt} 
                  className="character" 
                  src={member.image} 
                  width={200} 
                  height={283} 
                />
                <div className="title">{member.name} {member.role}</div>
              </div>
              
              <div className="card__face card__face--back">
                <Image className="cover-image" src={Qr} alt="wdark" />
                {/* Aquí puedes añadir información adicional para la parte trasera */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}