import React, { useState } from "react";
// 1. Cambiamos axios por tu configuración centralizada
import clienteAxios from "../Api/axiosConfig";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import LOGO from "../Assets/buho.png";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });

  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setRespuesta(null);

    const dataToSend = {
      ...formData,
      password: "password-dummy-react-client",
    };

    try {
      const response = await clienteAxios.post("/auth/registro", dataToSend);
      setRespuesta(response.data);
      setFormData({ nombre: "", apellido: "", email: "" });
    } catch (err) {
      const mensajeError =
        err.response?.data?.mensaje || "Error al registrar el usuario.";
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-page">
      <Container className="registro-container">
        <Row className="align-items-center">
          <Col md={6} className="registro-illustration d-none d-md-block">
            <div className="illustration-box text-center">
              <img
                src={LOGO}
                alt="SpeakUp Logo"
                className="illustration-img mb-3"
              />
              <h3 className="illustration-text">
                ¡Aprende inglés con confianza!
              </h3>
              <p>Regístrate para comenzar tu viaje lingüístico hoy.</p>
            </div>
          </Col>

          <Col md={6}>
            <Card className="registro-card shadow">
              <Card.Body className="p-4">
                <h2 className="text-center mb-4 title-text">Crea tu cuenta</h2>

                {respuesta && (
                  <Alert
                    variant="success"
                    className="mb-4 border-start border-4 border-success"
                  >
                    <div className="d-flex align-items-center mb-2">
                      <span className="fs-4 me-2">🎉</span>
                      <h5 className="mb-0 fw-bold">¡Registro Exitoso!</h5>
                    </div>
                    <p>
                      Hola <strong>{formData.nombre || "estudiante"}</strong>,
                      usa estos datos para entrar:
                    </p>
                    <div className="bg-white p-3 rounded border shadow-sm my-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Usuario:</span>
                        <code className="bg-light px-2 py-1 rounded text-primary fw-bold fs-6">
                          {respuesta.username}
                        </code>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Contraseña:</span>
                        <code className="bg-light px-2 py-1 rounded text-primary fw-bold fs-6">
                          {respuesta.password}
                        </code>
                      </div>
                    </div>
                    <Button
                      variant="success"
                      className="w-100 fw-bold"
                      onClick={() => navigate("/login")}
                    >
                      IR AL LOGIN AHORA
                    </Button>
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      placeholder="Ej: Andres"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      disabled={cargando}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      placeholder="Tu apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                      disabled={cargando}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={cargando}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 mb-2"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Registrarme ahora"
                    )}
                  </Button>

                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={handleLoginClick}
                  >
                    Ya tengo cuenta - Iniciar sesión
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Registro;
