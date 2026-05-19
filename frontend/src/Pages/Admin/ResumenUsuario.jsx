import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import clienteAxios from "../../Api/axiosConfig";
import { useAuth } from "../../Context/AuthContext";
import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import {
  FaUserCog,
  FaCog,
  FaEdit,
  FaArrowLeft,
  FaGraduationCap,
  FaHistory,
  FaUnlockAlt,
  FaUserCircle,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const DetalleUsuario = () => {
  const { usuarioId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [categoriasDesbloqueadas, setCategoriasDesbloqueadas] = useState([]);
  const [historialQuizzes, setHistorialQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const userMenu = [
    { name: "Gestionar categorias", path: "/admin", Icon: FaCog },
    { name: "Gestionar usuarios", path: "/usuarios", Icon: FaUserCog },
    { name: "Gestionar Quiz", path: "/Quiz", Icon: FaEdit },
  ];

  const formatFecha = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  useEffect(() => {
    const cargarProgresoUsuario = async () => {
      try {
        setLoading(true);
        if (!usuarioId) return;

        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const resCategorias = await clienteAxios.get(
          `/usuarios/${usuarioId}/categorias-desbloqueadas`,
          { headers },
        );

        setCategoriasDesbloqueadas(resCategorias.data);
        setHistorialQuizzes([]);
        setCategoriaSeleccionada(null);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          "No se pudo recopilar el historial o progreso del estudiante.",
        );
      } finally {
        setLoading(false);
      }
    };

    cargarProgresoUsuario();
  }, [usuarioId]);

  const cargarHistorialCategoria = async (categoriaId, nombreCat) => {
    try {
      const token = localStorage.getItem("token");
      setCategoriaSeleccionada(nombreCat);

      const resHistorial = await clienteAxios.get(
        `/usuarios/${usuarioId}/historial`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { categoriaId: categoriaId },
        },
      );
      setHistorialQuizzes(resHistorial.data);
    } catch (err) {
      console.error(err);
      setHistorialQuizzes([]);
      alert(
        `Este usuario aún no registra intentos guardados para la categoría: ${nombreCat}`,
      );
    }
  };

  return (
    <div className="d-flex w-100 style-wrapper">
      <Sidebar
        menuItems={userMenu}
        brand={{ name: "SpeakUp! W&B", logo: "🦉" }}
        onLogout={logout}
      />

      <div
        className="flex-grow-1"
        style={{
          background: "#f0f7ff",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Container fluid className="p-3 p-sm-4 p-lg-5">
          <Button
            variant="light"
            className="rounded-pill shadow-sm mb-4 px-3 d-inline-flex align-items-center"
            onClick={() => navigate("/usuarios")}
          >
            <FaArrowLeft className="me-2" /> Volver a Usuarios
          </Button>

          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3 text-muted">
                Consultando base de datos del estudiante...
              </p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
              {error}
            </Alert>
          ) : (
            <Row className="g-4">
              <Col xs={12} lg={4}>
                <Card className="border-0 shadow-sm rounded-4 text-center p-4 bg-white">
                  <Card.Body>
                    <FaUserCircle size={80} className="text-primary mb-3" />
                    <h4 className="fw-bold text-dark mb-1">
                      Progreso Académico
                    </h4>
                    <p className="text-muted small text-mono text-break">
                      ID: {usuarioId}
                    </p>
                    <hr className="my-4 text-muted" />

                    <div className="d-flex justify-content-around">
                      <div>
                        <h3 className="fw-bold text-success">
                          {categoriasDesbloqueadas.length}
                        </h3>
                        <small className="text-muted">Módulos OK</small>
                      </div>
                      <div className="border-start"></div>
                      <div>
                        <h3 className="fw-bold text-primary">
                          {historialQuizzes.length}
                        </h3>
                        <small className="text-muted">Intentos Cat.</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} lg={8}>
                <Card className="border-0 shadow-sm rounded-4 mb-4 bg-white">
                  <Card.Header className="bg-transparent border-0 pt-4 px-4">
                    <h5 className="fw-bold m-0 text-dark d-flex align-items-center">
                      <FaUnlockAlt className="text-warning me-2" /> Módulos y
                      Categorías Desbloqueadas
                    </h5>
                  </Card.Header>
                  <Card.Body className="px-4 pb-4">
                    {categoriasDesbloqueadas.length === 0 ? (
                      <p className="text-muted my-2 small">
                        El estudiante no ha desbloqueado niveles aún.
                      </p>
                    ) : (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {categoriasDesbloqueadas.map((cat, i) => (
                          <Button
                            key={cat.id || i}
                            variant={
                              categoriaSeleccionada === cat.nombre
                                ? "primary"
                                : "outline-primary"
                            }
                            className="rounded-pill btn-sm px-3 shadow-sm text-start"
                            onClick={() =>
                              cargarHistorialCategoria(cat.id, cat.nombre)
                            }
                          >
                            <FaGraduationCap className="me-1" />{" "}
                            {cat.nombre || "Módulo Integrado"}
                            <Badge bg="success" className="ms-2">
                              Activo
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    )}
                    <small className="text-muted d-block mt-3 italic">
                      💡 Haz clic sobre cualquier categoría de arriba para
                      cargar su historial detallado de intentos abajo.
                    </small>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                  <Card.Header className="bg-transparent border-0 pt-4 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                    <h5 className="fw-bold m-0 text-dark d-flex align-items-center">
                      <FaHistory className="text-primary me-2" /> Historial de
                      Cuestionarios Completados
                    </h5>
                    {categoriaSeleccionada && (
                      <Badge bg="secondary" className="px-3 py-2">
                        Viendo: {categoriaSeleccionada}
                      </Badge>
                    )}
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover responsive align="middle" className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="py-3 ps-4 text-center">Intento</th>
                          <th className="py-3">Fecha de Realización</th>
                          <th className="py-3 text-center">Puntaje</th>
                          <th className="py-3 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historialQuizzes.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-4 text-muted small"
                            >
                              {categoriaSeleccionada
                                ? "No se registraron intentos para este módulo todavía."
                                : "Selecciona un módulo activo arriba para cargar las calificaciones obtenidas por este alumno."}
                            </td>
                          </tr>
                        ) : (
                          historialQuizzes.map((item, index) => (
                            <tr
                              key={
                                `${item.fechaRealizacion}-${item.numeroIntento}` ||
                                index
                              }
                            >
                              <td className="text-center fw-bold text-primary py-3">
                                #{item.numeroIntento}
                              </td>
                              <td className="text-dark font-medium">
                                <div className="d-flex align-items-center">
                                  <FaCalendarAlt className="text-muted me-2" />
                                  <span>
                                    {formatFecha(item.fechaRealizacion)}
                                  </span>
                                </div>
                              </td>
                              <td
                                className="text-center fw-bold fs-5"
                                style={{
                                  color:
                                    item.puntaje >= 70 ? "#28a745" : "#dc3545",
                                }}
                              >
                                {item.puntaje.toFixed(1)}%
                              </td>
                              <td className="text-center">
                                <Badge
                                  bg={item.puntaje >= 70 ? "success" : "danger"}
                                  pill
                                  className="px-3 py-2"
                                >
                                  {item.puntaje >= 70 ? (
                                    <>
                                      <FaCheckCircle className="me-1" /> OK
                                    </>
                                  ) : (
                                    <>
                                      <FaTimesCircle className="me-1" /> FALLÓ
                                    </>
                                  )}
                                </Badge>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default DetalleUsuario;
