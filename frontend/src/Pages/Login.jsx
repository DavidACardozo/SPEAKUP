import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1.Importamos AMBOS para manejar errores y peticiones
import axios from "axios"; 
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
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const response = await clienteAxios.post("/auth/login", formData);

      const { token, datos, success, mensaje, tipo } = response.data;

      if (token || success) {

        localStorage.setItem("token", token);

        const usuarioParaAlmacenar = { ...datos, tipo, token };
        localStorage.setItem("usuario", JSON.stringify(usuarioParaAlmacenar));

        login(usuarioParaAlmacenar);

        if (tipo && tipo.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/inicio");
        }
        return;
      }

      setError(mensaje || "Credenciales incorrectas.");
    } catch (err) {
      console.error("Error en login:", err);
      
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.mensaje || "Error al iniciar sesión.");
      } else {
        setError("No hay conexión con el servidor. Verifica tu API.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-page">
      <Container className="registro-container">
        <Row className="align-items-center min-vh-100">
          <Col md={6} className="d-none d-md-block">
            <div className="illustration-box text-center">
              <img src={LOGO} alt="SpeakUp Logo" className="illustration-img mb-4" style={{maxWidth: '250px'}} />
              <h3 className="illustration-text">¡Bienvenido!</h3>
              <p>Continúa tu camino hacia la fluidez en inglés.</p>
            </div>
          </Col>

          <Col md={6}>
            <Card className="registro-card shadow-lg border-0">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4 fw-bold" style={{color: '#01579B'}}>Inicia Sesión</h2>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Usuario o Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Tu usuario de SpeakUp!"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="py-2"
                    />
                  </Form.Group>

                  <Button type="submit" className="w-100 py-2 fw-bold" disabled={cargando} style={{backgroundColor: '#0277BD', border: 'none'}}>
                    {cargando ? <Spinner animation="border" size="sm" /> : "ENTRAR"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="small">¿Nuevo en SpeakUp? <a href="/registro" className="fw-bold" style={{color: '#0277BD'}}>Crea una cuenta</a></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;