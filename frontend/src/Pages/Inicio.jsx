import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Badge,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import {
  FaHome,
  FaLayerGroup,
  FaUserCircle,
  FaBookOpen,
  FaMicrophone,
  FaArrowRight,
  FaChartLine,
  FaPencilAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";

function Inicio() {
  const { user } = useAuth();
  const [modulosInfo, setModulosInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userMenu = [
    { name: "Inicio", path: "/inicio", Icon: FaHome },
    { name: "Módulos", path: "/modulos", Icon: FaLayerGroup },
    { name: "Historial", path: "/historial-quizes", Icon: FaBookOpen },
    { name: "Perfil", path: "/perfil", Icon: FaUserCircle },
    { name: "Speaking", path: "/PracticeWithIA", Icon: FaMicrophone },
    { name: "Gap Fill", path: "/PracticeWords", Icon: FaPencilAlt }, 
  ];

  useEffect(() => {
    const fetchCategoriasDesbloqueadas = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await clienteAxios.get(
          `/usuarios/${user.id}/categorias-desbloqueadas`,
        );
        const infoMapeada = response.data
          .map((cat) => ({
            id: cat.id,
            nombre: cat.nombre,
            nivel: cat.descripcion,
            palabras: cat.vocabulario ? cat.vocabulario.length : 0,
            estado: cat.completada ? "Completado" : "En Curso",
          }))
          .sort((a, b) => a.id - b.id);
        setModulosInfo(infoMapeada);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar tus módulos.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoriasDesbloqueadas();
  }, [user?.id]);

  const completados = modulosInfo.filter(
    (m) => m.estado === "Completado",
  ).length;
  const porcentajeTotal =
    modulosInfo.length > 0 ? (completados / modulosInfo.length) * 100 : 0;

  return (
    <div className="layout-wrapper">
      <Sidebar
        menuItems={userMenu}
        brand={{ name: "SpeakUp!", logo: "🦉" }}
        onLogout={() => console.log("Usuario saliendo...")}
      />

      <main className="main-content">
        <Container fluid className="p-4 p-lg-5">
          {/* Hero Section */}
          <Card
            className="border-0 shadow-lg mb-5 overflow-hidden rounded-4 animate__animated animate__fadeIn"
            style={{
              background: "linear-gradient(45deg, #01579B 0%, #0288D1 100%)",
              color: "white",
            }}
          >
            <Card.Body className="p-4 p-md-5">
              <Row className="align-items-center">
                <Col md={8}>
                  <h1 className="display-4 fw-bold mb-2">
                    👋 ¡Hola, {user?.nombre || "Estudiante"}!
                  </h1>
                  <p className="fs-5 opacity-90">
                    Tu viaje hacia la fluidez continúa. Tienes{" "}
                    <strong>{modulosInfo.length}</strong> módulos activos.
                  </p>
                </Col>
                <Col md={4} className="text-center d-none d-md-block">
                  <div className="bg-white bg-opacity-25 p-4 rounded-circle d-inline-block shadow-sm">
                    <FaChartLine size={60} />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row className="g-4">
            <Col lg={8}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0 text-primary-emphasis">
                  Módulos Sugeridos
                </h3>
                <Link to="/modulos" className="text-decoration-none fw-bold">
                  Ver todos <FaArrowRight />
                </Link>
              </div>

              {loading ? (
                <div className="text-center p-5">
                  <Spinner animation="grow" variant="primary" />
                </div>
              ) : error ? (
                <Alert variant="danger" className="rounded-4">
                  {error}
                </Alert>
              ) : (
                <Row className="g-3">
                  {modulosInfo.slice(0, 4).map((modulo) => (
                    <Col md={6} key={modulo.id}>
                      <Card
                        as={Link}
                        to="/modulos"
                        className="h-100 border-0 shadow-sm rounded-4 text-decoration-none category-card"
                        style={{ borderLeft: "6px solid #01579B" }}
                      >
                        <Card.Body className="p-4">
                          <div className="d-flex justify-content-between mb-2">
                            <h5 className="fw-bold text-dark mb-0">
                              {modulo.nombre}
                            </h5>
                            <Badge
                              bg={
                                modulo.estado === "Completado"
                                  ? "success"
                                  : "info"
                              }
                              pill
                            >
                              {modulo.palabras} palabras
                            </Badge>
                          </div>
                          <p className="text-muted small mb-3">
                            {modulo.nivel}
                          </p>
                          <small
                            className={
                              modulo.estado === "Completado"
                                ? "text-success fw-bold"
                                : "text-primary fw-bold"
                            }
                          >
                            {modulo.estado === "Completado"
                              ? "Completado ✅"
                              : "Continuar práctica 🔄"}
                          </small>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>

            <Col lg={4}>
              <h3 className="fw-bold mb-4 text-primary-emphasis">
                Tu Actividad
              </h3>
              <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                <Card.Header className="bg-white border-0 py-4 text-center">
                  <div className="display-4 fw-bold text-primary mb-0">
                    {completados}/{modulosInfo.length}
                  </div>
                  <small className="text-muted text-uppercase fw-bold ls-1">
                    Módulos Completados
                  </small>
                </Card.Header>
                <Card.Body className="px-4 pb-4">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2 small fw-bold">
                      <span>Progreso General</span>
                      <span>{porcentajeTotal.toFixed(0)}%</span>
                    </div>
                    <ProgressBar
                      now={porcentajeTotal}
                      variant="success"
                      className="rounded-pill"
                      style={{ height: "10px" }}
                    />
                  </div>
                  <div className="vstack gap-2">
                    {modulosInfo.map((modulo) => (
                      <div
                        key={modulo.id}
                        className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <span
                          className="text-truncate fw-medium"
                          style={{ maxWidth: "140px" }}
                        >
                          {modulo.nombre}
                        </span>
                        <Badge
                          bg={
                            modulo.estado === "Completado"
                              ? "success"
                              : "primary"
                          }
                          pill
                        >
                          {modulo.estado === "Completado"
                            ? "Listo"
                            : "En curso"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default Inicio;
