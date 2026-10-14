import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
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
  FaPencilAlt,
  FaCheckCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";
import PageTransition from "../Components/PageTransition";

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
          `/usuarios/${user.id}/categorias-desbloqueadas`
        );
        const infoMapeada = response.data
          .map((cat) => ({
            id: cat.id,
            nombre: cat.nombre,
            nivel: cat.descripcion,
            palabras: cat.vocabularios ? cat.vocabularios.length : 0,
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
    (m) => m.estado === "Completado"
  ).length;
  const porcentajeTotal =
    modulosInfo.length > 0 ? (completados / modulosInfo.length) * 100 : 0;

  return (
    <PageTransition>
      <div className="layout-wrapper sp-inicio-page">
        <Sidebar
          menuItems={userMenu}
          brand={{}}
          onLogout={() => console.log("Usuario saliendo...")}
        />

        <main className="main-content">
          <Container fluid className="p-4 p-lg-5">
            {/* Hero Section */}
            <div className="sp-hero-card mb-5">
              <Row className="align-items-center">
                <Col md={8}>
                  <p className="sp-kicker">Panel del Estudiante</p>
                  <h1 className="sp-h1">
                    ¡Hola, {user?.nombre || "Estudiante"}!
                  </h1>
                  <p className="sp-hero-sub">
                    Tu viaje hacia la fluidez continúa. Tienes{" "}
                    <strong>{modulosInfo.length}</strong> módulos activos en
                    tu ruta de aprendizaje.
                  </p>
                </Col>
                <Col md={4} className="text-center d-none d-md-block">
                  <div className="sp-hero-icon-box">
                    <FaChartLine size={48} />
                  </div>
                </Col>
              </Row>
            </div>

            <Row className="g-4">
              <Col lg={8}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="sp-section-title mb-0">Módulos Sugeridos</h2>
                  <Link to="/modulos" className="sp-link-more">
                    Ver todos <FaArrowRight aria-hidden />
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" style={{ color: "var(--azul)" }} />
                  </div>
                ) : error ? (
                  <Alert variant="danger" className="sp-alert">
                    {error}
                  </Alert>
                ) : (
                  <Row className="g-3">
                    {modulosInfo.slice(0, 4).map((modulo) => (
                      <Col md={6} key={modulo.id}>
                        <Card
                          as={Link}
                          to="/modulos"
                          className="h-100 border-0 text-decoration-none sp-module-card"
                        >
                          <Card.Body className="p-4 d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h3 className="sp-card-title mb-0">
                                  {modulo.nombre}
                                </h3>
                                <span className="sp-badge-words">
                                  {modulo.palabras} palabras
                                </span>
                              </div>
                              <p className="sp-card-level mb-3">
                                {modulo.nivel}
                              </p>
                            </div>

                            <div className="sp-card-status">
                              {modulo.estado === "Completado" ? (
                                <span className="status-ok">
                                  <FaCheckCircle aria-hidden /> Completado
                                </span>
                              ) : (
                                <span className="status-progress">
                                  <FaSyncAlt aria-hidden /> Continuar práctica
                                </span>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>

              <Col lg={4}>
                <h2 className="sp-section-title mb-4">Tu Actividad</h2>
                <Card className="border-0 sp-activity-card mb-4">
                  <Card.Header className="bg-transparent border-0 py-4 text-center">
                    <div className="sp-big-stat mb-1">
                      {completados}/{modulosInfo.length}
                    </div>
                    <small className="sp-stat-label">
                      Módulos Completados
                    </small>
                  </Card.Header>
                  <Card.Body className="px-4 pb-4">
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2 small fw-semibold">
                        <span className="text-pizarra">Progreso General</span>
                        <span style={{ color: "var(--azul)" }}>
                          {porcentajeTotal.toFixed(0)}%
                        </span>
                      </div>
                      <ProgressBar
                        now={porcentajeTotal}
                        className="sp-progressbar"
                      />
                    </div>
                    <div className="vstack gap-2">
                      {modulosInfo.map((modulo) => (
                        <div
                          key={modulo.id}
                          className="d-flex justify-content-between align-items-center p-2.5 rounded-3 sp-activity-item"
                        >
                          <span className="text-truncate fw-medium text-noche">
                            {modulo.nombre}
                          </span>
                          <span
                            className={
                              modulo.estado === "Completado"
                                ? "sp-pill sp-pill-ok"
                                : "sp-pill sp-pill-progress"
                            }
                          >
                            {modulo.estado === "Completado"
                              ? "Listo"
                              : "En curso"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          .sp-inicio-page {
            --azul: #2A5DB0;
            --noche: #14295C;
            --verde: #2FC57E;
            --celeste: #E3EEFB;
            --pizarra: #4A5878;
            --borde: #D3E0F3;
            font-family: 'Poppins', sans-serif;
            color: var(--noche);
            background: #F8FAFC;
            min-height: 100vh;
          }

          /* Hero Card Corporativo */
          .sp-hero-card {
            background: var(--noche);
            border-radius: 20px;
            padding: 2.5rem 3rem;
            color: #fff;
            position: relative;
            overflow: hidden;
          }
          .sp-kicker {
            color: #8FB2F0;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.4rem;
          }
          .sp-h1 {
            font-weight: 700;
            font-size: clamp(1.8rem, 3.5vw, 2.5rem);
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
          }
          .sp-hero-sub {
            color: #C9D6EE;
            font-size: 1.05rem;
            margin: 0;
            max-width: 32rem;
          }
          .sp-hero-icon-box {
            width: 88px;
            height: 88px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--verde);
          }

          /* Titulos de seccion */
          .sp-section-title {
            font-weight: 700;
            font-size: 1.35rem;
            color: var(--noche);
            letter-spacing: -0.01em;
          }
          .sp-link-more {
            color: var(--azul);
            font-weight: 600;
            font-size: 0.9rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
          }
          .sp-link-more:hover {
            color: var(--noche);
            text-decoration: underline;
          }

          /* Tarjetas de Modulos */
          .sp-module-card {
            background: #fff;
            border: 1px solid var(--borde) !important;
            border-radius: 16px;
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          }
          .sp-module-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(20, 41, 92, 0.08);
            border-color: var(--azul) !important;
          }
          .sp-card-title {
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--noche);
          }
          .sp-badge-words {
            background: var(--celeste);
            color: var(--azul);
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.25rem 0.65rem;
            border-radius: 999px;
          }
          .sp-card-level {
            color: var(--pizarra);
            font-size: 0.85rem;
            margin: 0;
          }
          .sp-card-status {
            font-size: 0.85rem;
            font-weight: 600;
          }
          .status-ok {
            color: #198754;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
          }
          .status-progress {
            color: var(--azul);
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
          }

          /* Tarjeta de Actividad */
          .sp-activity-card {
            background: #fff;
            border: 1px solid var(--borde);
            border-radius: 16px;
          }
          .sp-big-stat {
            font-size: 2.75rem;
            font-weight: 700;
            color: var(--noche);
            line-height: 1;
          }
          .sp-stat-label {
            color: var(--pizarra);
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* Progressbar */
          .sp-progressbar {
            height: 10px;
            border-radius: 999px;
            background-color: var(--celeste);
            overflow: hidden;
          }
          .sp-progressbar .progress-bar {
            background-color: var(--verde);
          }

          /* Lista de actividad */
          .sp-activity-item {
            background: #F8FAFC;
            border: 1px solid var(--borde);
            border-radius: 10px;
            font-size: 0.85rem;
          }
          .sp-pill {
            font-size: 0.72rem;
            font-weight: 600;
            padding: 0.15rem 0.55rem;
            border-radius: 999px;
          }
          .sp-pill-ok {
            background: rgba(47, 197, 126, 0.2);
            color: #11683E;
          }
          .sp-pill-progress {
            background: var(--celeste);
            color: var(--azul);
          }

          .sp-alert {
            border-radius: 12px;
            background: #FDECEC;
            border-color: #F2B8B8;
            color: #8A1C1C;
          }
        `}</style>
      </div>
    </PageTransition>
  );
}

export default Inicio;