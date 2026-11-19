import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { FaArrowRight, FaRecycle, FaWeightHanging } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import PageTransition from "../../Components/PageTransition";
import { useAuth } from "../../Context/AuthContext";
import { recyclingService } from "../../Services/recyclingService";

const menu = [
  { name: "Mi reciclaje", path: "/reciclaje", Icon: FaRecycle },
  { name: "Guía de canecas", path: "/reciclaje/guia-canecas", Icon: FaWeightHanging },
  { name: "Historial", path: "/reciclaje/historial", Icon: FaWeightHanging },
  { name: "Puntos aliados", path: "/reciclaje/puntos-aliados", Icon: FaRecycle },
  { name: "Perfil", path: "/perfil", Icon: FaRecycle },
];

const labelMaterial = (material) => {
  const map = {
    plastico: "Plástico",
    vidrio: "Vidrio",
    papel: "Papel y cartón",
    metal: "Metal",
    organico: "Orgánico",
    no_aprovechable: "No aprovechable",
  };
  return map[material] || material;
};

const ReciclajeInicio = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [valoresHistoricos, setValoresHistoricos] = useState("");
  const [pasosFuturos, setPasosFuturos] = useState(1);
  const [proyeccion, setProyeccion] = useState(null);
  const [calculandoProyeccion, setCalculandoProyeccion] = useState(false);
  const [errorProyeccion, setErrorProyeccion] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await recyclingService.getResumenUsuario();
        if (mounted) setSummary(data);
      } catch (e) {
        if (mounted) setError("No pudimos cargar tu resumen de reciclaje.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProyectarReciclaje = async (event) => {
    event.preventDefault();
    const valores = valoresHistoricos.split(",").map((valor) => valor.trim());
    const numericos = valores.map(Number);

    if (valores.length < 2 || valores.some((valor) => valor === "") || numericos.some((valor) => !Number.isFinite(valor) || valor < 0)) {
      setErrorProyeccion("Ingresa al menos dos valores históricos válidos, separados por comas.");
      setProyeccion(null);
      return;
    }

    const pasos = Number(pasosFuturos);
    if (!Number.isInteger(pasos) || pasos < 1 || pasos > 24) {
      setErrorProyeccion("Elige entre 1 y 24 periodos para proyectar.");
      setProyeccion(null);
      return;
    }

    setCalculandoProyeccion(true);
    setErrorProyeccion(null);
    try {
      const resultado = await recyclingService.proyectarReciclaje(numericos, pasos);
      setProyeccion(resultado);
    } catch (e) {
      setProyeccion(null);
      setErrorProyeccion(e.response?.data?.mensaje || "No pudimos calcular la proyección. Intenta de nuevo.");
    } finally {
      setCalculandoProyeccion(false);
    }
  };

  if (loading) return (
    <PageTransition>
      <div className="layout-wrapper">
        <Sidebar menuItems={menu} onLogout={handleLogout} mode="recycling" />
        <main className="main-content" style={{ minHeight: "100vh" }}>
          <Container fluid className="p-4 p-lg-5">
            <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
          </Container>
        </main>
      </div>
    </PageTransition>
  );

  if (error) return (
    <PageTransition>
      <div className="layout-wrapper">
        <Sidebar menuItems={menu} onLogout={handleLogout} mode="recycling" />
        <main className="main-content">
          <Container fluid className="p-4 p-lg-5">
            <Alert variant="danger" className="rounded-4">
              {error}
              <div className="mt-3"><Button onClick={() => window.location.reload()}>Reintentar</Button></div>
            </Alert>
          </Container>
        </main>
      </div>
    </PageTransition>
  );

  if (!summary) return null;

  return (
    <PageTransition>
      <div className="layout-wrapper recyclaje-page">
        <Sidebar menuItems={menu} onLogout={handleLogout} mode="recycling" />
        <main className="main-content">
          <Container fluid className="p-4 p-lg-5">
            <div className="recycling-hero mb-4">
              <Row className="align-items-center g-3">
                <Col md={8}>
                  <p className="recycling-kicker">Mi reciclaje</p>
                  <h1>¡Hola, {user?.nombre || "Ana"}!</h1>
                  <p>Así va tu reciclaje. Cada kilo cuenta.</p>
                </Col>
                <Col md={4} className="text-md-end">
                  <div className="recycling-total-box">
                    <span>Total</span>
                    <strong>{summary.totalKg.toFixed(1)} kg</strong>
                  </div>
                </Col>
              </Row>
            </div>

            <Row className="g-4 mb-4">
              <Col md={4}><Card className="recycling-stat-card"><Card.Body><small>Entregas</small><h3>{summary.entregas}</h3></Card.Body></Card></Col>
              <Col md={4}><Card className="recycling-stat-card"><Card.Body><small>Material principal</small><h3>{summary.materialPrincipal}</h3></Card.Body></Card></Col>
              <Col md={4}><Card className="recycling-stat-card"><Card.Body><small>Última entrega</small><h3>{summary.ultimaEntrega}</h3></Card.Body></Card></Col>
            </Row>

            <Row className="g-4 mb-4">
              <Col lg={8}>
                <Card className="recycling-panel-card">
                  <Card.Body>
                    <h3 className="mb-4">Kilos por material</h3>
                    {Object.entries(summary.kilosPorMaterial).map(([key, value]) => {
                      const materialLabel = labelMaterial(key);
                      const max = Math.max(...Object.values(summary.kilosPorMaterial), 1);
                      const percent = Math.max((value / max) * 100, value > 0 ? 18 : 0);
                      return (
                        <div key={key} className="recycling-bar-row">
                          <div className="d-flex justify-content-between mb-1"><span>{materialLabel}</span><strong>{Number(value).toFixed(1)} kg</strong></div>
                          <div className="recycling-bar-track"><div className="recycling-bar-fill" style={{ width: `${percent}%` }} /></div>
                        </div>
                      );
                    })}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="recycling-panel-card">
                  <Card.Body>
                    <h3 className="mb-3">Mi código</h3>
                    <div className="code-box">{summary.codigo}</div>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(summary.codigo)}`} alt="QR de reciclaje" className="qr-box" />
                    <p className="mt-3 mb-0 text-center">Muéstralo en el punto aliado</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="recycling-panel-card mb-4">
              <Card.Body className="p-4 p-lg-5">
                <Row className="align-items-center g-4">
                  <Col lg={7}>
                    <p className="recycling-kicker text-primary mb-2">Proyección</p>
                    <h3 className="mb-2">Proyecta tu reciclaje</h3>
                    <p className="text-muted mb-4">Escribe los kilos de tus últimos periodos en orden, del más antiguo al más reciente. La regresión lineal estimará los próximos periodos.</p>
                    <Form onSubmit={handleProyectarReciclaje}>
                      <Form.Group className="mb-3">
                        <Form.Label>Kilos históricos (separados por coma)</Form.Label>
                        <Form.Control
                          type="text"
                          inputMode="decimal"
                          placeholder="Ejemplo: 2.5, 3, 4.2, 5"
                          value={valoresHistoricos}
                          onChange={(event) => setValoresHistoricos(event.target.value)}
                          aria-describedby="proyeccion-ayuda"
                        />
                        <Form.Text id="proyeccion-ayuda" muted>Ingresa al menos dos valores no negativos. Usa punto para decimales.</Form.Text>
                      </Form.Group>
                      <Row className="align-items-end g-3">
                        <Col xs={6} sm={4}>
                          <Form.Group>
                            <Form.Label>Periodos a proyectar</Form.Label>
                            <Form.Control type="number" min="1" max="24" required value={pasosFuturos} onChange={(event) => setPasosFuturos(event.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col xs={6} sm="auto">
                          <Button type="submit" variant="primary" disabled={calculandoProyeccion}>
                            {calculandoProyeccion ? "Calculando…" : "Calcular proyección"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    {errorProyeccion && <Alert variant="danger" className="mt-3 mb-0">{errorProyeccion}</Alert>}
                  </Col>
                  <Col lg={5}>
                    {proyeccion ? (
                      <div className="projection-result" aria-live="polite">
                        <small>Estimación del periodo {proyeccion.periodoProyectado}</small>
                        <strong>{Number(proyeccion.valorProyectado).toFixed(2)} kg</strong>
                        <span>Tendencia {proyeccion.tendencia.toLowerCase()} · {Number(proyeccion.pendiente).toFixed(2)} kg por periodo</span>
                        <span className="projection-note">Es una estimación basada en los valores que ingresaste.</span>
                      </div>
                    ) : (
                      <div className="projection-placeholder">El resultado de tu proyección aparecerá aquí.</div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="recycling-banner mb-4 border-0">
              <Card.Body className="d-flex justify-content-between align-items-center flex-column flex-md-row gap-3">
                <div>
                  <h4>¿Quieres aprender inglés?</h4>
                  <p className="mb-0">Sigue avanzando con tus módulos desde el modo inglés.</p>
                </div>
                <Button variant="light" className="rounded-pill px-4" onClick={() => navigate("/inicio")}>Ir a inglés <FaArrowRight /></Button>
              </Card.Body>
            </Card>
          </Container>
        </main>
      </div>

      <style>{`
        .recyclaje-page { --azul: #2A5DB0; --noche: #14295C; --verde: #2FC57E; --celeste: #E3EEFB; --pizarra: #4A5878; --blanco: #fff; }
        .recycling-hero { background: linear-gradient(135deg, var(--noche), var(--azul)); color: var(--blanco); border-radius: 24px; padding: 2rem; }
        .recycling-kicker { font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; opacity: .8; margin-bottom: .7rem; }
        .recycling-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: .5rem; }
        .recycling-hero p { color: rgba(255,255,255,.85); margin-bottom: 0; }
        .recycling-total-box { display: inline-flex; flex-direction: column; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); border-radius: 18px; padding: 1rem 1.25rem; }
        .recycling-total-box span { font-size: .75rem; opacity: .8; }
        .recycling-total-box strong { font-size: 1.8rem; }
        .recycling-stat-card, .recycling-panel-card { border: 0; border-radius: 18px; box-shadow: 0 10px 25px rgba(20,41,92,.08); }
        .recycling-stat-card small { color: var(--pizarra); display: block; margin-bottom: .5rem; }
        .recycling-stat-card h3 { color: var(--noche); margin: 0; font-size: 1.5rem; }
        .projection-result, .projection-placeholder { min-height: 190px; border-radius: 18px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center; gap: .45rem; background: #f1f6ff; color: var(--noche); }
        .projection-result strong { color: var(--azul); font-size: clamp(2rem, 4vw, 2.8rem); line-height: 1.1; }
        .projection-result small, .projection-result span, .projection-placeholder { color: var(--pizarra); }
        .projection-result .projection-note { margin-top: .5rem; font-size: .85rem; }
        .recycling-bar-row + .recycling-bar-row { margin-top: 1.25rem; }
        .recycling-bar-track { height: 12px; background: #e8eefc; border-radius: 999px; overflow: hidden; }
        .recycling-bar-fill { height: 100%; background: linear-gradient(90deg, var(--azul), #6f99d9); border-radius: 999px; }
        .code-box { background: #f4f8ff; border: 1px dashed var(--azul); border-radius: 14px; padding: .9rem; text-align: center; font-weight: 700; color: var(--noche); letter-spacing: .12em; }
        .qr-box { width: 180px; height: 180px; display: block; margin: 1rem auto 0; border-radius: 16px; background: #fff; padding: .5rem; box-shadow: 0 10px 25px rgba(20,41,92,.08); }
        .recycling-banner { background: linear-gradient(135deg, #edf4ff, #dfeeff); border-radius: 20px; }
        .recycling-banner h4 { color: var(--noche); margin-bottom: .3rem; }
        .recycling-banner p { color: var(--pizarra); }
      `}</style>
    </PageTransition>
  );
};

export default ReciclajeInicio;
