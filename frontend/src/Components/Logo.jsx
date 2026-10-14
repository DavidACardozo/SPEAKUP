import React from "react";

/**
 * Logos de SpeakUp W&B (Manual de marca, sección 1).
 * - IsoTipo:    solo el símbolo (favicon, ícono, avatar)
 * - LogoTipo:   solo texto
 * - ImagoTipo:  símbolo + texto (logo principal)
 * Variantes: "color" (fondo claro) | "negativo" (fondo azul noche)
 */

export const BRAND = {
  azul: "#2A5DB0",
  noche: "#14295C",
  verde: "#2FC57E",
  celeste: "#E3EEFB",
  pizarra: "#4A5878",
  blanco: "#FFFFFF",
  azulClaro: "#8FB2F0", // "Up" sobre fondo oscuro
};

export const IsoTipo = ({ size = 40, variant = "color", className = "" }) => {
  const neg = variant === "negativo";
  const globo = neg ? BRAND.blanco : BRAND.azul;
  const barra = neg ? BRAND.azul : BRAND.blanco;

  return (
    <svg
      width={size}
      height={(size * 72) / 64}
      viewBox="0 0 64 72"
      role="img"
      aria-label="SpeakUp W&B"
      className={className}
    >
      <rect x="0" y="0" width="64" height="56" rx="14" fill={globo} />
      <polygon points="10,48 10,72 32,52" fill={globo} />
      <rect x="13" y="30" width="9" height="13" rx="4.5" fill={barra} />
      <rect x="27.5" y="23" width="9" height="20" rx="4.5" fill={barra} />
      <rect x="42" y="12" width="9" height="31" rx="4.5" fill={BRAND.verde} />
    </svg>
  );
};

export const LogoTipo = ({ size = 28, variant = "color", className = "" }) => {
  const neg = variant === "negativo";
  return (
    <span
      className={className}
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        color: neg ? BRAND.blanco : BRAND.noche,
        whiteSpace: "nowrap",
      }}
    >
      Speak
      <span style={{ color: neg ? BRAND.azulClaro : BRAND.azul }}>Up</span>
      <span
        style={{
          fontSize: size * 0.42,
          fontWeight: 500,
          letterSpacing: 0,
          marginLeft: size * 0.2,
          color: neg ? BRAND.azulClaro : BRAND.pizarra,
        }}
      >
        W&amp;B
      </span>
    </span>
  );
};

const ImagoTipo = ({ size = 40, variant = "color", className = "" }) => (
  <span
    className={className}
    style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3 }}
  >
    <IsoTipo size={size} variant={variant} />
    <LogoTipo size={size * 0.8} variant={variant} />
  </span>
);

export default ImagoTipo;