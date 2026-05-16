import React, { useState, useEffect, useCallback } from "react";
import {
  Container, Button, Card, Row, Col, Modal, Badge, Spinner, Alert,
} from "react-bootstrap";
import {
  FaHome, FaLayerGroup, FaUserCircle, FaBookOpen, FaMicrophone, FaArrowLeft, FaMagic,FaPencilAlt
} from "react-icons/fa";
import SpeechButton from "../Components/SpeechButton";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";
import { generarParrafoIA } from "../Services/aiService";

// --- SUB-COMPONENTE: RETO DE IA ---
const EjercicioIA = ({ categoria, vocabulario }) => {
  const [datos, setDatos] = useState(null);
  const [respuestasUsuario, setRespuestasUsuario] = useState({});
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const cargarReto = useCallback(async () => {
    if (!vocabulario || vocabulario.length === 0) return;

    // 1. LIMPIEZA PREVENTIVA: Evita que se mezclen datos viejos con nuevos
    setCargando(true);
    setDatos(null); 
    setResultado(null);
    setRespuestasUsuario({});

    try {
      const palabrasClave = [...vocabulario]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((v) => v.palabraIngles);

      const data = await generarParrafoIA(categoria, palabrasClave);
      
      // Validación de integridad de datos
      if (data && data.texto && data.soluciones) {
        setDatos(data);
      } else {
        throw new Error("Datos de IA incompletos");
      }
    } catch (error) {
      console.error("Error al generar reto:", error);
    } finally {
      setCargando(false);
    }
  }, [categoria, vocabulario]);

  useEffect(() => {
    cargarReto();
  }, [cargarReto]);

  const verificar = () => {
    console.log(datos.soluciones)
    if (!datos?.soluciones) return;

    const aciertos = datos.soluciones.every(
      (sol, i) =>
        respuestasUsuario[i]?.toLowerCase().trim() === sol.toLowerCase().trim()
    );
    setResultado(aciertos ? "success" : "danger");
  };

  if (cargando) return (
    <div className="text-center p-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">Generando desafío personalizado...</p>
    </div>
  );

  if (!datos) return (
    <Alert variant="warning" className="mt-4 rounded-4">
      No se pudo cargar el reto. Intenta "Generar Otro" o verifica tu conexión.
    </Alert>
  );

  return (
    <Card className="border-0 shadow-lg rounded-4 p-4 mt-4 bg-white animate__animated animate__fadeInUp">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <FaMagic className="text-primary me-2" />
          <h4 className="fw-bold mb-0" style={{ color: "#01579B" }}>Desafío de Contexto</h4>
        </div>
        {/* Botón de auxilio visual si lo necesitas */}
        <Button 
          variant="outline-info" 
          size="sm" 
          onClick={() => alert(`Pista: ${datos.soluciones.join(", ")}`)}
          className="rounded-pill"
        >
          ¿Necesitas ayuda?
        </Button>
      </div>

      <div className="fs-5 lh-lg bg-light p-4 rounded-4 border mb-4">
        {datos.texto.split("___").map((p, i, arr) => (
          <span key={i}>
            {p}
            {i < arr.length - 1 && (
              <input
                type="text"
                className="mx-1 border-0 border-bottom text-center fw-bold"
                style={{ width: "130px", borderBottom: "3px solid #01579B", background: "transparent", outline: "none" }}
                value={respuestasUsuario[i] || ""}
                onChange={(e) => setRespuestasUsuario({ ...respuestasUsuario, [i]: e.target.value })}
              />
            )}
          </span>
        ))}
      </div>

      <div className="d-flex gap-3">
        <Button onClick={verificar} variant="primary" className="rounded-pill px-4 fw-bold">
          Verificar Respuestas
        </Button>
        <Button onClick={cargarReto} variant="outline-secondary" className="rounded-pill px-4">
          Generar Otro
        </Button>
      </div>

      {resultado && (
        <Alert variant={resultado} className="mt-4 rounded-4 border-0 shadow-sm animate__animated animate__bounceIn">
          {resultado === "success" ? (
            <>
              <h5 className="fw-bold">¡Lo lograste! 🎉</h5>
              <p className="mb-0"><b>Traducción:</b> {datos.traduccion}</p>
            </>
          ) : (
            "Aún hay errores. ¡Revisa tu ortografía!"
          )}
        </Alert>
      )}
    </Card>
  );
};

// --- COMPONENTE PRINCIPAL ---
const PracticeWithIA = () => {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [showModal, setShowModal] = useState(false);

   const userMenu = [
     { name: "Inicio", path: "/inicio", Icon: FaHome },
     { name: "Módulos", path: "/modulos", Icon: FaLayerGroup },
     { name: "Historial", path: "/historial-quizes", Icon: FaBookOpen },
     { name: "Perfil", path: "/perfil", Icon: FaUserCircle },
     { name: "Speaking", path: "/PracticeWithIA", Icon: FaMicrophone },
     { name: "Gap Fill", path: "/PracticeWords", Icon: FaPencilAlt }, 
   ];

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const { data } = await clienteAxios.get(`/usuarios/${user.id}/categorias-desbloqueadas`);
        setCategorias(data);
      } catch (err) {
        console.error("Error al cargar módulos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, [user]);

  return (
    <div className="layout-wrapper">
      <Sidebar menuItems={userMenu} brand={{ name: "SpeakUp!", logo: "🦉" }} onLogout={() => {}} />
      <main className="main-content">
        <Container fluid className="p-4 p-lg-5">
          <h1 className="fw-bold display-5" style={{ color: "#01579B" }}>
            Practice With IA <FaMicrophone size={30} className="ms-2" />
          </h1>
          <hr style={{ width: "100px", borderTop: "4px solid #01579B", borderRadius: "10px" }} />

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <Spinner animation="grow" variant="primary" />
            </div>
          ) : selectedCategoria ? (
            <div className="animate__animated animate__fadeIn">
              <Button variant="link" className="text-secondary mb-4 p-0 fs-5" onClick={() => setSelectedCategoria(null)}>
                <FaArrowLeft className="me-2" /> Volver a categorías
              </Button>

              <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                <Row className="g-0">
                  <Col md={4} className="bg-primary d-flex align-items-center justify-content-center p-5 text-white">
                    <div className="text-center">
                      <h2 className="fw-bold">{selectedCategoria.nombre}</h2>
                      <Badge bg="light" text="primary" pill className="px-3 py-2 mt-2">
                        {selectedCategoria.vocabulario?.length || 0} Palabras
                      </Badge>
                    </div>
                  </Col>
                  <Col md={8}>
                    <Card.Body className="p-5 text-center">
                      <h3 className="fw-bold mb-3">¿Repasamos la pronunciación?</h3>
                      <p className="text-muted">Revisa las palabras antes de iniciar el desafío de IA.</p>
                      <Button size="lg" variant="primary" className="px-5 rounded-pill" onClick={() => setShowModal(true)}>
                        🚀 Ver Vocabulario
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>

              <EjercicioIA categoria={selectedCategoria.nombre} vocabulario={selectedCategoria.vocabulario} />
            </div>
          ) : (
            <Row className="g-4">
              {categorias.map((cat) => (
                <Col lg={4} md={6} key={cat.id}>
                  <Card as="button" onClick={() => setSelectedCategoria(cat)} className="w-100 h-100 shadow-sm border-0 p-4 rounded-4 text-start practice-card" style={{ borderLeft: "6px solid #01579B" }}>
                    <h5 className="fw-bold" style={{ color: "#01579B" }}>{cat.nombre}</h5>
                    <p className="text-muted small mb-0">{cat.descripcion || "Practica con IA."}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton className="border-0 bg-light px-4">
          <Modal.Title className="fw-bold">Diccionario: {selectedCategoria?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategoria?.vocabulario?.map((v, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div>
                <span className="fw-bold fs-5 d-block">{v.palabraIngles}</span>
                <Badge bg="secondary" className="opacity-75">{v.pronunciacion}</Badge>
              </div>
              <SpeechButton palabraCorrecta={v.palabraIngles} />
              <span className="text-success fw-bold fs-5">{v.palabraEspanol}</span>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PracticeWithIA;