import React, { useState, useEffect } from "react";
import {
  Container,
  Alert,
  Spinner,
  Card,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import {
  FaHome,
  FaLayerGroup,
  FaUserCircle,
  FaBookOpen,
  FaMicrophone,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaPencilAlt
} from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";

function Historial() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
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

  const formatFecha = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const fetchHistorial = async (categoriaId) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const url = `/usuarios/${user.id}/historial${categoriaId ? `?categoriaId=${categoriaId}` : ""}`;
      const response = await clienteAxios.get(url);
      setHistorial(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || "Error al cargar el historial.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    if (!user?.id) return;
    try {
      const response = await clienteAxios.get(`/usuarios/${user.id}/categorias-desbloqueadas`);
      setCategorias(response.data);
      if (response.data.length > 0) {
        setCategoriaSeleccionada(response.data[0].id.toString());
      }
    } catch (e) {
      console.error("Error al cargar categorías", e);
    }
  };

  useEffect(() => {
    if (user?.id) fetchCategorias();
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && categoriaSeleccionada) {
      fetchHistorial(categoriaSeleccionada);
    } else if (user?.id && categorias.length === 0) {
      setLoading(false);
    }
  }, [user?.id, categoriaSeleccionada]);

  if (!user)
    return (
      <Alert variant="warning" className="m-5 shadow-sm rounded-4">
        Inicie sesión para ver su historial.
      </Alert>
    );

  return (
    
    <div className="layout-wrapper">
      <Sidebar
        menuItems={userMenu}
        brand={{ name: "SpeakUp!", logo: "🦉" }}
        onLogout={() => console.log("Usuario saliendo...")}
      />

      
      <main className="main-content">
        <Container fluid className="p-4 p-lg-5">
          
          
          <div className="mb-4 mb-lg-5 animate__animated animate__fadeIn text-center text-md-start">
            <h1 className="fw-bold display-5" style={{ color: "#01579B" }}>
              Tu Progreso <FaBookOpen size={30} className="ms-2" />
            </h1>
            <p className="text-muted fs-5">
              Revisa tus intentos pasados y sigue mejorando.
            </p>
            <hr className="mx-auto mx-md-0" style={{ width: "100px", borderTop: "4px solid #01579B", borderRadius: "10px" }} />
          </div>

          
          <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <Card.Body className="p-4 bg-white">
              <Row className="align-items-center">
                <Col md={7} className="d-flex align-items-center mb-3 mb-md-0">
                  <div className="bg-primary text-white p-3 rounded-3 me-3 d-none d-sm-block">
                    <FaFilter />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">Filtrar por Módulo</h5>
                    <small className="text-muted">Selecciona una categoría para ver tus notas</small>
                  </div>
                </Col>
                <Col md={5}>
                  <Form.Select
                    size="lg"
                    className="rounded-3 border-2"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    disabled={categorias.length === 0}
                  >
                    {categorias.length === 0 && <option value="">No hay categorías</option>}
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "30vh" }}>
              <Spinner animation="grow" variant="primary" />
            </div>
          ) : error ? (
            <Alert variant="danger" className="rounded-4">{error}</Alert>
          ) : historial.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white">
              <div className="display-1 text-muted opacity-25 mb-3">📂</div>
              <h4 className="text-muted">Aún no has completado quizes aquí.</h4>
            </Card>
          ) : (
            <div className="animate__animated animate__fadeInUp">
              {historial.map((item) => (
                <Card
                  key={`${item.fechaRealizacion}-${item.numeroIntento}`}
                  className="border-0 shadow-sm rounded-4 mb-3 history-card"
                  style={{ borderLeft: `6px solid ${item.puntaje >= 70 ? "#28a745" : "#dc3545"}` }}
                >
                  <Card.Body className="p-4">
                    <Row className="align-items-center text-center text-md-start">
                      
                      <Col xs={4} md={1} className="mb-2 mb-md-0">
                        <div className="text-muted small fw-bold">INTENTO</div>
                        <div className="fs-3 fw-bold text-primary">#{item.numeroIntento}</div>
                      </Col>

                      
                      <Col xs={8} md={4} className="mb-3 mb-md-0 border-start-md ps-md-4">
                        <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                          <FaCalendarAlt className="text-muted me-2" />
                          <span className="fw-bold">{formatFecha(item.fechaRealizacion)}</span>
                        </div>
                        <Badge bg="light" text="dark" className="border mt-2 text-wrap">
                          {item.nombreCategoria}
                        </Badge>
                      </Col>

                      
                      <Col xs={6} md={3} className="mt-2 mt-md-0">
                        <div className="small text-muted mb-1">Puntaje</div>
                        <h3 className={`fw-bold mb-0 ${item.puntaje >= 70 ? "text-success" : "text-danger"}`}>
                          {item.puntaje.toFixed(1)}%
                        </h3>
                      </Col>

                      
                      <Col xs={6} md={4} className="text-end mt-2 mt-md-0">
                        <Badge 
                          bg={item.puntaje >= 70 ? "success" : "danger"} 
                          className="px-3 py-2 px-md-4 rounded-pill fs-6 w-50 w-md-auto"
                        >
                          {item.puntaje >= 70 ? <><FaCheckCircle className="me-1" /> APROBADO</> : <><FaTimesCircle className="me-1" /> FALLIDO</>}
                        </Badge>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

export default Historial;