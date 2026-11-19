import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { FaMapMarkedAlt, FaRecycle } from "react-icons/fa";
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

const PuntosAliados = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    recyclingService.getPuntosAliados().then((data) => mounted && setPuntos(data)).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <PageTransition>
      <div className="layout-wrapper">
        <Sidebar menuItems={menu} onLogout={() => { logout(); navigate("/login"); }} mode="recycling" />
        <main className="main-content">
          <Container fluid className="p-4 p-lg-5">
            <div className="mb-4">
              <p className="recycling-kicker text-uppercase">Puntos aliados</p>
              <h1 className="mb-0">Encuentra un punto cercano</h1>
            </div>

            {loading ? <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div> : (
              <Row className="g-4">
                {puntos.map((punto) => (
                  <Col md={6} lg={4} key={punto.id}>
                    <Card className="recycling-panel-card h-100">
                      <Card.Body>
                        <h3>{punto.nombre}</h3>
                        <p className="mb-1">{punto.direccion}</p>
                        <p className="text-muted">{punto.horario}</p>
                        <div className="material-chips mb-3">
                          {punto.materiales.map((material) => <span key={material} className="chip">{material}</span>)}
                        </div>
                        <Button variant="primary" className="rounded-pill" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(punto.direccion)}`} target="_blank" rel="noreferrer">
                          <FaMapMarkedAlt className="me-2" />Cómo llegar
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </main>
      </div>
    </PageTransition>
  );
};

export default PuntosAliados;
