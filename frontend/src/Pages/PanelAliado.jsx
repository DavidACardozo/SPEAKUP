import React, { useMemo, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { FaRecycle, FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import PageTransition from "../Components/PageTransition";
import { recyclingService } from "../Services/recyclingService";

const MATERIALS = ["Plástico", "Vidrio", "Papel y cartón", "Metal", "Orgánico", "No aprovechable"];

const PanelAliado = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState({ nombre: "Ana García", codigo: "AN-4821" });
  const [material, setMaterial] = useState("Plástico");
  const [peso, setPeso] = useState(2.4);
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState(null);

  const dashboard = useMemo(() => recyclingService.getAliadoDashboard ? recyclingService.getAliadoDashboard() : { usuario: user?.nombre || "Aliado", punto: "Centro Verde", ultimosRegistros: [] }, [user]);

  const buscarUsuario = () => {
    if (!codigo.trim()) return setMessage({ type: "warning", text: "Escribe el código del usuario." });
    const code = codigo.trim().toUpperCase();
    if (code === "AN-4821") {
      setUsuarioEncontrado({ nombre: "Ana García", codigo: code });
      setMessage({ type: "success", text: "Usuario encontrado: Ana García." });
      return;
    }
    setMessage({ type: "warning", text: "Código no encontrado. Verifica el dato." });
  };

  const guardarEntrega = () => {
    const kg = Number(peso);
    if (!usuarioEncontrado?.nombre) return setMessage({ type: "warning", text: "Primero busca un usuario." });
    if (!kg || kg <= 0 || kg > 100) return setMessage({ type: "warning", text: "El peso debe ser un valor válido mayor a 0 y menor a 100 kg." });
    setMessage({ type: "success", text: `¡Entrega registrada! Sumaste ${kg.toFixed(1)} kg de ${material.toLowerCase()}.` });
    setConfirm(false);
  };

  return (
    <PageTransition>
      <div className="layout-wrapper">
        <header className="aliado-topbar">
          <div className="d-flex justify-content-between align-items-center px-4 py-3">
            <div className="fw-bold">Panel de aliado · {dashboard.punto}</div>
            <Button variant="link" className="text-white text-decoration-none" onClick={() => { logout(); navigate("/login"); }}>Cerrar sesión</Button>
          </div>
        </header>
        <main className="main-content p-4 p-lg-5">
          <Container fluid>
            <Row className="g-4">
              <Col lg={7}>
                <Card className="recycling-panel-card">
                  <Card.Body>
                    <h2 className="mb-4">Registrar entrega</h2>
                    <div className="mb-4">
                      <Form.Label>1. Usuario</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        <Form.Control value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Código del usuario" />
                        <Button onClick={buscarUsuario}>Buscar</Button>
                      </div>
                      {usuarioEncontrado && <div className="mt-3 fw-semibold">Confirmado: {usuarioEncontrado.nombre} ({usuarioEncontrado.codigo})</div>}
                    </div>

                    <div className="mb-4">
                      <Form.Label>2. Material</Form.Label>
                      <div className="material-chips">
                        {MATERIALS.map((item) => <button type="button" key={item} className={`chip ${material === item ? "active" : ""}`} onClick={() => setMaterial(item)}>{item}</button>)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <Form.Label>3. Peso (kg)</Form.Label>
                      <Form.Control type="number" step="0.1" min="0.1" max="100" value={peso} onChange={(e) => setPeso(e.target.value)} />
                    </div>

                    {!confirm ? (
                      <Button variant="primary" className="rounded-pill" onClick={() => setConfirm(true)}>Continuar</Button>
                    ) : (
                      <>
                        <Card className="border-0 bg-light mb-3">
                          <Card.Body>
                            <p className="mb-1"><strong>Usuario:</strong> {usuarioEncontrado.nombre}</p>
                            <p className="mb-1"><strong>Material:</strong> {material}</p>
                            <p className="mb-0"><strong>Peso:</strong> {Number(peso).toFixed(1)} kg</p>
                          </Card.Body>
                        </Card>
                        <Button variant="success" className="rounded-pill" onClick={guardarEntrega}>Guardar entrega</Button>
                      </>
                    )}
                    {message && <Alert variant={message.type === "success" ? "success" : message.type === "warning" ? "warning" : "danger"} className="mt-3 rounded-4">{message.text}</Alert>}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={5}>
                <Card className="recycling-panel-card">
                  <Card.Body>
                    <h3 className="mb-3">Mis últimos registros</h3>
                    <Table responsive hover>
                      <thead><tr><th>Usuario</th><th>Material</th><th>kg</th></tr></thead>
                      <tbody>
                        {(dashboard.ultimosRegistros || []).map((registro, index) => (
                          <tr key={`${registro.usuario}-${index}`}>
                            <td>{registro.usuario}</td>
                            <td>{registro.material}</td>
                            <td>{registro.kg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
      <style>{`
        .aliado-topbar { background: var(--noche, #14295C); color: #fff; }
        .material-chips { display: flex; flex-wrap: wrap; gap: .6rem; }
        .chip { border: 1px solid #dfe9ff; background: #fff; padding: .55rem .8rem; border-radius: 999px; font-weight: 500; }
        .chip.active { background: #2A5DB0; color: #fff; border-color: #2A5DB0; }
      `}</style>
    </PageTransition>
  );
};

export default PanelAliado;
