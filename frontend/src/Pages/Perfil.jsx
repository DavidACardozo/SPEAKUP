import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Form,
  Badge,
} from "react-bootstrap";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";
import {
  FaHome,
  FaLayerGroup,
  FaUserCircle,
  FaBookOpen,
  FaEnvelope,
  FaTag,
  FaMicrophone,
  FaPencilAlt
} from "react-icons/fa";
import Sidebar from "../Components/Sidebar";

const cardStyle = {
  background: "#FFFFFF",
  borderRadius: "15px",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  padding: "30px",
  minHeight: "450px",
};

const valueStyle = {
  color: "#01579B",
  fontWeight: "600",
};

const Perfil = () => {
  const { user, setUser } = useAuth();

  const [mostrarFormPassword, setMostrarFormPassword] = useState(false);
  const [mostrarFormCorreo, setMostrarFormCorreo] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [mensaje, setMensaje] = useState(null);
   const userMenu = [
     { name: "Inicio", path: "/inicio", Icon: FaHome },
     { name: "Módulos", path: "/modulos", Icon: FaLayerGroup },
     { name: "Historial", path: "/historial-quizes", Icon: FaBookOpen },
     { name: "Perfil", path: "/perfil", Icon: FaUserCircle },
     { name: "Speaking", path: "/PracticeWithIA", Icon: FaMicrophone },
     { name: "Gap Fill", path: "/PracticeWords", Icon: FaPencilAlt }, 
   ];

  const handleCambiarPassword = async () => {
    if (passwordNueva !== passwordConfirm) {
      setMensaje({ tipo: "danger", texto: "Las contraseñas no coinciden." });
      return;
    }

    try {
      await clienteAxios.put(`/usuarios/${user.id}/perfil`, {
        passwordActual: passwordActual,
        nuevaPassword: passwordNueva,
      });

      setMensaje({
        tipo: "success",
        texto: "Contraseña actualizada con éxito.",
      });
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirm("");
      setMostrarFormPassword(false);
    } catch (err) {
      setMensaje({
        tipo: "danger",
        texto: err.response?.data?.mensaje || "Error al cambiar contraseña.",
      });
    }
  };

  const handleCambiarCorreo = async () => {
    try {
      await clienteAxios.put(`/usuarios/${user.id}/perfil`, {
        nuevoEmail: nuevoCorreo,
      });

      setMensaje({ tipo: "success", texto: "Correo actualizado con éxito." });

      const userActualizado = { ...user, email: nuevoCorreo };
      setUser(userActualizado);
      localStorage.setItem("usuario", JSON.stringify(userActualizado));

      setNuevoCorreo("");
      setMostrarFormCorreo(false);
    } catch (err) {
      setMensaje({
        tipo: "danger",
        texto: err.response?.data?.mensaje || "Error al cambiar correo.",
      });
    }
  };

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning">
          No se encontraron datos de perfil. Inicie sesión.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Sidebar
        menuItems={userMenu}
        brand={{ name: "SpeakUp! W&B", logo: "🦉" }}
        onLogout={() => console.log("Usuario saliendo...")}
      />
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <h2 className="mb-4 fw-bold" style={{ color: "#01579B" }}>
            <FaUserCircle className="me-2" /> Mi Perfil
          </h2>

          {mensaje && (
            <Alert
              variant={mensaje.tipo}
              onClose={() => setMensaje(null)}
              dismissible
              className="text-center"
            >
              {mensaje.texto}
            </Alert>
          )}

          <Card style={cardStyle} className="border-0">
            <Card.Body>
              <Row className="align-items-center mb-4">
                <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                  <div
                    style={{
                      fontSize: "5rem",
                      background: "#E1F5FE",
                      borderRadius: "50%",
                      width: "120px",
                      height: "120px",
                      lineHeight: "120px",
                      margin: "0 auto",
                    }}
                  >
                    🦉
                  </div>
                </Col>
                <Col xs={12} md={9} className="text-center text-md-start">
                  <h3 className="mb-1 fw-bold" style={{ color: "#01579B" }}>
                    {user.nombre} {user.apellido}
                  </h3>
                  <p className="text-muted mb-2">@{user.username}</p>
                  <Badge
                    bg={user.rol === "ADMIN" ? "danger" : "success"}
                    className="px-3 py-2"
                  >
                    {user.rol}
                  </Badge>
                </Col>
              </Row>

              <hr style={{ borderColor: "#B3E5FC" }} />

              <Row className="g-4 py-3">
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-center p-3 rounded-3 bg-light">
                    <FaTag className="me-3 fs-4" style={{ color: "#4FC3F7" }} />
                    <div>
                      <small className="text-muted d-block">
                        ID de Usuario
                      </small>
                      <span style={valueStyle}>{user.id}</span>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="d-flex align-items-center p-3 rounded-3 bg-light">
                    <FaEnvelope
                      className="me-3 fs-4"
                      style={{ color: "#4FC3F7" }}
                    />
                    <div>
                      <small className="text-muted d-block">
                        Correo Electrónico
                      </small>
                      <span style={valueStyle}>{user.email}</span>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-4 g-2">
                <Col md={6}>
                  <Button
                    variant="outline-primary"
                    className="w-100 py-2 fw-bold"
                    onClick={() => {
                      setMostrarFormPassword(!mostrarFormPassword);
                      setMostrarFormCorreo(false);
                    }}
                  >
                    Cambiar contraseña
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
                    variant="outline-primary"
                    className="w-100 py-2 fw-bold"
                    onClick={() => {
                      setMostrarFormCorreo(!mostrarFormCorreo);
                      setMostrarFormPassword(false);
                    }}
                  >
                    Cambiar correo
                  </Button>
                </Col>
              </Row>

              {/* Formulario Password */}
              {mostrarFormPassword && (
                <Card
                  className="mt-4 p-4 border-0 shadow-sm"
                  style={{ background: "#f8fdff" }}
                >
                  <h5 className="mb-3 fw-bold" style={{ color: "#01579B" }}>
                    Seguridad: Nueva Contraseña
                  </h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña Actual</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Tu clave actual"
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={passwordNueva}
                          onChange={(e) => setPasswordNueva(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmar Nueva</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Repite la clave"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="success"
                    className="w-100 fw-bold"
                    onClick={handleCambiarPassword}
                  >
                    ACTUALIZAR CONTRASEÑA
                  </Button>
                </Card>
              )}

              {/* Formulario Correo */}
              {mostrarFormCorreo && (
                <Card
                  className="mt-4 p-4 border-0 shadow-sm"
                  style={{ background: "#f8fdff" }}
                >
                  <h5 className="mb-3 fw-bold" style={{ color: "#01579B" }}>
                    Configuración: Nuevo Correo
                  </h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Nueva dirección de correo</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={nuevoCorreo}
                      onChange={(e) => setNuevoCorreo(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="success"
                    className="w-100 fw-bold"
                    onClick={handleCambiarCorreo}
                  >
                    GUARDAR NUEVO CORREO
                  </Button>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;
