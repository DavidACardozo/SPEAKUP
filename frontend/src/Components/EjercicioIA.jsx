import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, Button, Spinner, Alert,  } from "react-bootstrap";
import { generarParrafoIA } from "../Services/aiService";
import { retosLocales } from "../Data/retosLocales";
import { FaMagic, FaEye } from "react-icons/fa";

const EjercicioIA = ({ categoria, vocabulario }) => {
  const [datos, setDatos] = useState(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [errorLocal, setErrorLocal] = useState(null);
  const llamadaEnCurso = useRef(false);

  // 1. Función de respaldo local
  const usarRespaldo = useCallback(() => {
    const opciones = retosLocales[categoria] || retosLocales["Verbos Comunes"];
    const azar = opciones[Math.floor(Math.random() * opciones.length)];
    
    console.log("SOLUCIONES (LOCAL):", azar.soluciones);
    setDatos(azar);
    setRespuestasUsuario({});
    setResultado(null);
    setErrorLocal("Servidor ocupado. Usando retos locales.");
  }, [categoria]);

  // 2. Cargar Reto (Con limpieza de estado crítica)
  const cargarReto = useCallback(async () => {
    if (!vocabulario?.length || llamadaEnCurso.current) return;

    llamadaEnCurso.current = true;
    setCargando(true);
    setResultado(null);
    setErrorLocal(null);
    setDatos(null); // Limpiamos datos anteriores inmediatamente
    setRespuestasUsuario({}); // Limpiamos inputs anteriores

    try {
      const palabras = [...vocabulario]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((v) => v.palabraIngles);

      const data = await generarParrafoIA(categoria, palabras);
      console.log("SOLUCIONES (IA):", data.soluciones);
      setDatos(data);
    } catch (error) {
      console.warn("Falla IA:", error.message);
      usarRespaldo();
    } finally {
      setCargando(false);
      setTimeout(() => { llamadaEnCurso.current = false; }, 1000);
    }
  }, [categoria, vocabulario, usarRespaldo]);

  useEffect(() => {
    cargarReto();
  }, [cargarReto]);

  // 3. Verificar Respuestas
  const verificar = () => {
    console.log(datos.soluciones)
    if (!datos?.soluciones) return;
    const aciertos = datos.soluciones.every((sol, i) => {
      const respuesta = respuestasUsuario[i] || "";
      return respuesta.trim().toLowerCase() === sol.trim().toLowerCase();
    });
    setResultado(aciertos ? "success" : "danger");
  };

  // 4. Mostrar Soluciones (El botón que pediste)
  const mostrarSoluciones = () => {
    if (datos?.soluciones) {
      alert("Respuestas correctas: " + datos.soluciones.join(", "));
    }
  };

  if (cargando) {
    return (
      <div className="text-center p-5 animate__animated animate__fadeIn">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted fw-semibold">Generando desafío personalizado...</p>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg rounded-4 p-4 mt-4 bg-white text-dark animate__animated animate__fadeInUp">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center">
            <FaMagic className="text-primary me-2" />
            <h4 className="fw-bold m-0" style={{ color: "#01579B" }}>{categoria}</h4>
          </div>
          <span className={`badge rounded-pill mt-2 ${errorLocal ? "bg-warning text-dark" : "bg-success"}`}>
            {errorLocal ? "Modo Local" : "IA Online"}
          </span>
        </div>
        
        {/* Botón "Ver Respuestas" integrado en el header */}
        <Button 
          variant="outline-info" 
          size="sm" 
          onClick={mostrarSoluciones}
          className="rounded-pill px-3 fw-bold shadow-sm"
        >
          <FaEye className="me-1" /> Ver Respuestas
        </Button>
      </div>

      {datos?.texto ? (
        <>
          <div className="fs-5 lh-lg p-4 rounded-4 bg-light mb-4 border shadow-sm">
            {datos.texto.split("___").map((parte, i, arr) => (
              <span key={i}>
                {parte}
                {i < arr.length - 1 && (
                  <input
                    type="text"
                    className="mx-2 text-center fw-bold border-0"
                    style={{ width: "140px", borderBottom: "2px solid #01579B", background: "transparent", outline: "none", color: "#0D47A1" }}
                    value={respuestasUsuario[i] || ""}
                    onChange={(e) => setRespuestasUsuario({ ...respuestasUsuario, [i]: e.target.value })}
                  />
                )}
              </span>
            ))}
          </div>

          <div className="d-flex gap-3 flex-wrap">
            <Button onClick={verificar} variant="primary" className="px-4 fw-bold rounded-pill">
              Verificar
            </Button>
            <Button onClick={cargarReto} variant="outline-secondary" className="fw-semibold rounded-pill">
              Generar Otro
            </Button>
          </div>
        </>
      ) : (
        <Alert variant="info" className="rounded-4">Selecciona una categoría para comenzar.</Alert>
      )}

      {resultado && (
        <Alert variant={resultado} className="mt-4 rounded-4 border-0 shadow-sm animate__animated animate__bounceIn">
          {resultado === "success" ? (
            <>
              <h5 className="fw-bold">¡Excelente! 🥳</h5>
              <p className="mb-0">{datos.traduccion}</p>
            </>
          ) : (
            <>
              <h6 className="fw-bold">Hay errores ❌</h6>
              <p className="mb-0">Revisa tu ortografía o usa el botón de arriba para ver las respuestas.</p>
            </>
          )}
        </Alert>
      )}
    </Card>
  );
};

export default EjercicioIA;