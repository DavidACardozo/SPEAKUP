import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { FaRecycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import PageTransition from "../../Components/PageTransition";
import { useAuth } from "../../Context/AuthContext";
import { recyclingService } from "../../Services/recyclingService";

const menu = [
  { name: "Mi reciclaje", path: "/reciclaje", Icon: FaRecycle },
  { name: "Guía de canecas", path: "/reciclaje/guia-canecas", Icon: FaRecycle },
  { name: "Historial", path: "/reciclaje/historial", Icon: FaRecycle },
  { name: "Puntos aliados", path: "/reciclaje/puntos-aliados", Icon: FaRecycle },
  { name: "Perfil", path: "/perfil", Icon: FaRecycle },
];

const ReciclajeHistorial = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [material, setMaterial] = useState("Todos");
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await recyclingService.getHistorial(material);
        if (mounted) setHistorial(data);
      } catch {
        if (mounted) setError("No pudimos cargar el historial.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [material]);

  const total = historial.reduce((sum, item) => sum + Number(item.peso || 0), 0);

  return (
    <PageTransition>
      <div className="layout-wrapper">
        <Sidebar menuItems={menu} onLogout={() => { logout(); navigate("/login"); }} mode="recycling" />
        <main className="main-content">
          <Container fluid className="p-4 p-lg-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div>
                <p className="recycling-kicker text-uppercase">Historial</p>
                <h1 className="mb-0">Tus entregas</h1>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Form.Select value={material} onChange={(e) => setMaterial(e.target.value)} style={{ width: 220 }}>
                  <option>Todos</option>
                  <option>Plástico</option>
                  <option>Vidrio</option>
                  <option>Papel y cartón</option>
                  <option>Metal</option>
                </Form.Select>
              </div>
            </div>

            <Card className="recycling-panel-card mb-4">
              <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="fw-semibold">Total del filtro</span>
                <strong className="fs-4">{total.toFixed(1)} kg</strong>
              </Card.Body>
            </Card>

            {loading ? <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div> : error ? <Alert variant="danger">{error}</Alert> : (
              <Card className="recycling-panel-card">
                <Card.Body className="p-0">
                  <Table responsive hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Punto aliado</th>
                        <th>Material</th>
                        <th>Peso</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.length === 0 ? <tr><td colSpan={4} className="text-center py-4">Aún no hay entregas para este filtro.</td></tr> : historial.map((item) => (
                        <tr key={item.id}>
                          <td>{item.punto}</td>
                          <td>{item.material}</td>
                          <td>{Number(item.peso).toFixed(1)} kg</td>
                          <td>{new Date(item.fecha).toLocaleDateString("es-ES")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </Container>
        </main>
      </div>
    </PageTransition>
  );
};

export default ReciclajeHistorial;
