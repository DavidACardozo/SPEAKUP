import React, { useState, useEffect } from "react";
// 🔥 Se eliminó la coma extra después de Spinner
import { Container, Button, Card, Row, Col, Badge, Spinner } from "react-bootstrap"; 
import { FaHome, FaLayerGroup, FaUserCircle, FaBookOpen, FaMicrophone, FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";
import EjercicioIA from "../Components/EjercicioIA"; 

const IAChallengePage = () => {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

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
        console.error("Error al cargar categorías", err);
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
          <div className="mb-4">
            <h1 className="fw-bold display-5" style={{ color: "#01579B" }}>
              Completa las oraciones <FaPencilAlt size={30} className="ms-2" />
            </h1>
            <p className="text-muted fs-5">Completa los desafíos generados en tiempo real por inteligencia artificial.</p>
            <hr style={{ width: "100px", borderTop: "4px solid #01579B", borderRadius: "10px" }} />
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <Spinner animation="grow" variant="primary" />
            </div>
          ) : selectedCategoria ? (
            <div className="animate__animated animate__fadeIn">
              <Button 
                variant="link" 
                className="text-secondary mb-4 p-0 fs-5 text-decoration-none" 
                onClick={() => setSelectedCategoria(null)}
              >
                <FaArrowLeft className="me-2" /> Cambiar de categoría
              </Button>

              <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-primary text-white">
                <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold mb-1">{selectedCategoria.nombre}</h3>
                    <span>Reto de gramática y contexto</span>
                  </div>
                  <Badge bg="light" text="primary" pill className="px-3 py-2 fs-6">
                    {selectedCategoria.vocabularios?.length || 0} palabras disponibles
                  </Badge>
                </Card.Body>
              </Card>

              <EjercicioIA 
                categoria={selectedCategoria.nombre} 
                vocabulario={selectedCategoria.vocabularios} 
              />
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
                    <h5 className="fw-bold mb-2" style={{ color: "#01579B" }}>{cat.nombre}</h5>
                    <p className="text-muted small mb-0">
                      Haz clic para generar un reto basado en el vocabulario de esta categoría.
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </main>
    </div>
  );
};

export default IAChallengePage;
