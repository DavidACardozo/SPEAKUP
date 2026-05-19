import React, { useState, useEffect } from "react";
import {
  Container, Button, Card, Row, Col, Modal, Badge, Spinner,
} from "react-bootstrap";
import {
  FaHome, FaLayerGroup, FaUserCircle, FaBookOpen, FaMicrophone, FaArrowLeft, FaPencilAlt
} from "react-icons/fa";
import SpeechButton from "../Components/SpeechButton";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";

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
              <Button variant="link" className="text-secondary mb-4 p-0 fs-5 text-decoration-none" onClick={() => setSelectedCategoria(null)}>
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
                      <p className="text-muted">Revisa las palabras e interactúa con el botón de reproducción por voz.</p>
                      <Button size="lg" variant="primary" className="px-5 rounded-pill fw-bold" onClick={() => setShowModal(true)}>
                        🚀 Ver Vocabulario
                      </Button>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>

              {/* 🔥 Se eliminó la etiqueta <EjercicioIA /> de aquí */}
            </div>
          ) : (
            <Row className="g-4">
              {categorias.map((cat) => (
                <Col lg={4} md={6} key={cat.id}>
                  <Card 
                    as="button" 
                    onClick={() => setSelectedCategoria(cat)} 
                    className="w-100 h-100 shadow-sm border-0 p-4 rounded-4 text-start practice-card bg-white" 
                    style={{ borderLeft: "6px solid #01579B", transition: "0.3s", cursor: "pointer" }}
                  >
                    <h5 className="fw-bold" style={{ color: "#01579B" }}>{cat.nombre}</h5>
                    <p className="text-muted small mb-0">{cat.descripcion || "Mejora tu fluidez auditiva y hablada."}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton className="border-0 bg-light px-4">
          <Modal.Title className="fw-bold text-primary">Diccionario: {selectedCategoria?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          {selectedCategoria?.vocabulario?.map((v, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center py-3 border-bottom">
              <div>
                <span className="fw-bold fs-5 d-block text-dark">{v.palabraIngles}</span>
                <Badge bg="secondary" className="opacity-75">{v.pronunciacion}</Badge>
              </div>
              <div className="d-flex align-items-center gap-3">
                <SpeechButton palabraCorrecta={v.palabraIngles} />
                <span className="text-success fw-bold fs-5">{v.palabraEspanol}</span>
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PracticeWithIA;