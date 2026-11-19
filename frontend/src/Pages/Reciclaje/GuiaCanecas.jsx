import React, { useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { FaCamera, FaRecycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import PageTransition from "../../Components/PageTransition";
import { useAuth } from "../../Context/AuthContext";
import { MATERIALS, recyclingService } from "../../Services/recyclingService";

const menu = [
  { name: "Mi reciclaje", path: "/reciclaje", Icon: FaRecycle },
  { name: "Guía de canecas", path: "/reciclaje/guia-canecas", Icon: FaRecycle },
  { name: "Historial", path: "/reciclaje/historial", Icon: FaRecycle },
  { name: "Puntos aliados", path: "/reciclaje/puntos-aliados", Icon: FaRecycle },
  { name: "Perfil", path: "/perfil", Icon: FaRecycle },
];

const resumenCanecas = [
  { nombre: "Plástico", caneca: "Blanca", texto: "Limpio y seco. Aplasta botellas y envases." },
  { nombre: "Orgánico", caneca: "Verde", texto: "Cáscaras, frutas, verduras y restos de comida cruda." },
  { nombre: "No aprovechable", caneca: "Negra", texto: "Papel higiénico, servilletas usadas, comida preparada." },
];

const GuiaCanecas = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const inputRef = useRef(null);
  const [selectedMaterial, setSelectedMaterial] = useState("plastico");
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleAnalyze = async (materialOverride) => {
    setLoading(true);
    setError(null);
    try {
      const material = materialOverride || selectedMaterial;
      const result = await recyclingService.getCanecaSuggestion(material);
      setAdvice(result);
    } catch (e) {
      setError("No estamos seguros. Elige el material.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilePick = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("La foto debe pesar menos de 10 MB.");
      return;
    }

    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setLoading(true);
    setError(null);
    try {
      const detected = await recyclingService.detectarMaterialDesdeFoto(file);
      setSelectedMaterial(detected.material);
      setAdvice({
        items: detected.items,
        material: detected.label,
        caneca: detected.caneca,
        recomendacion: detected.recomendacion,
        nota: detected.nota,
        mensaje: detected.mensaje,
        source: detected.source,
        confidence: detected.confidence,
      });
    } catch (error) {
      setAdvice(null);
      setError(error.response?.data?.error || error.message || "No estamos seguros. Elige el material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="layout-wrapper">
        <Sidebar menuItems={menu} onLogout={() => { logout(); navigate("/login"); }} mode="recycling" />
        <main className="main-content">
          <Container fluid className="p-4 p-lg-5">
            <div className="mb-4">
              <p className="recycling-kicker text-uppercase">Guía de canecas</p>
              <h1 className="mb-2">¿En qué caneca va?</h1>
            </div>

            <Row className="g-4">
              <Col lg={5}>
                <Card className="recycling-panel-card h-100">
                  <Card.Body>
                    <div className="upload-zone text-center">
                      <div className="upload-icon"><FaCamera /></div>
                      <p className="mb-3">Súbelo o toma una foto para revisar una sugerencia.</p>
                      <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={handleFilePick} className="d-none" id="upload-recycling" />
                      <label htmlFor="upload-recycling" className="btn btn-primary rounded-pill px-4">Elegir foto</label>
                      {previewUrl && <img src={previewUrl} alt="Vista previa del residuo" className="photo-preview mt-3" />}
                    </div>

                    <div className="mt-4">
                      <p className="fw-semibold mb-3">O elige el material</p>
                      <div className="material-chips">
                        {MATERIALS.map((material) => (
                          <button key={material.value} type="button" className={`chip ${selectedMaterial === material.value ? "active" : ""}`} onClick={() => { setSelectedMaterial(material.value); handleAnalyze(material.value); }}>
                            {material.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={7}>
                <Card className="recycling-panel-card h-100">
                  <Card.Body>
                    {loading ? <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div> : advice ? (
                      <>
                        <h3 className="mb-3">{advice.mensaje}</h3>
                        {Array.isArray(advice.items) ? (
                          advice.items.length > 0 ? <div className="detected-items">
                            {advice.items.map((item, index) => (
                              <section className="detected-item" key={`${item.objeto}-${item.material}-${index}`}>
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                  <h5 className="mb-2">{item.objeto}{item.cantidad > 1 ? ` · ${item.cantidad} aprox.` : ""}</h5>
                                  <span className="caneca-tag">Caneca {item.caneca}</span>
                                </div>
                                <p className="mb-1"><strong>Material estimado:</strong> {item.label}</p>
                                <p className="mb-1"><strong>Cómo reciclarlo:</strong> {item.recomendacion}</p>
                                <p className="small text-muted mb-0">Confianza estimada: {Math.round(Number(item.confidence || 0) * 100)}%</p>
                              </section>
                            ))}
                          </div> : <Alert variant="light" className="rounded-4 border">No identificamos residuos con claridad. Prueba con una foto más cercana y bien iluminada.</Alert>
                        ) : (
                          <>
                            <div className="caneca-tag mb-3">{advice.caneca}</div>
                            <h5>Cómo prepararlo</h5>
                            <p>{advice.recomendacion}</p>
                          </>
                        )}
                        <p className="small text-muted">{advice.nota}</p>
                        {advice.source === "vision-api" && (
                          <p className="small text-primary mb-3">Clasificación por IA · confianza {Number(advice.confidence || 0.6).toFixed(2)}</p>
                        )}
                        <Button variant="outline-primary" className="rounded-pill" onClick={() => setAdvice(null)}>Cambiar material</Button>
                      </>
                    ) : (
                      <Alert variant="light" className="rounded-4 border">
                        No estamos seguros. Elige el material.
                      </Alert>
                    )}
                    {error && <Alert variant="warning" className="mt-3 rounded-4">{error}</Alert>}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="mt-5">
              <h3 className="mb-3">Resumen de canecas</h3>
              <Row className="g-3">
                {resumenCanecas.map((caneca) => (
                  <Col md={4} key={caneca.nombre}>
                    <Card className="recycling-summary-card h-100">
                      <Card.Body>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <strong>{caneca.nombre}</strong>
                          <span className="caneca-dot" style={{ background: caneca.caneca === "Verde" ? "#1F7A4D" : caneca.caneca === "Negra" ? "#2B2B2B" : "#F4F4F4", border: caneca.caneca === "Blanca" ? "1px solid #c9d6ee" : "none" }} />
                        </div>
                        <p className="mb-0"><span className="fw-semibold">Caneca:</span> {caneca.caneca}</p>
                        <p className="mb-0 mt-2">{caneca.texto}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Container>
        </main>
      </div>
      <style>{`
        .upload-zone { border: 1.5px dashed #c9d6ee; border-radius: 20px; background: #f8fbff; padding: 2rem; }
        .photo-preview { width: 100%; max-height: 280px; object-fit: contain; border-radius: 14px; background: #eef4fc; }
        .detected-items { display: grid; gap: .85rem; }
        .detected-item { padding: 1rem; border: 1px solid #dfe9ff; border-radius: 16px; background: #f8fbff; }
        .upload-icon { width: 68px; height: 68px; border-radius: 50%; display: grid; place-items: center; font-size: 1.7rem; background: #e3eefb; color: var(--azul); margin: 0 auto 1rem; }
        .material-chips { display: flex; flex-wrap: wrap; gap: .6rem; }
        .chip { border: 1px solid #dfe9ff; background: #fff; padding: .55rem .8rem; border-radius: 999px; font-weight: 500; }
        .chip.active { background: var(--azul); color: #fff; border-color: var(--azul); }
        .caneca-tag { display: inline-block; padding: .55rem .8rem; border-radius: 999px; background: #e8f7ef; color: #1f7a4d; font-weight: 700; }
        .recycling-summary-card { border: 0; border-radius: 18px; box-shadow: 0 10px 25px rgba(20,41,92,.08); }
        .caneca-dot { width: 18px; height: 18px; display: inline-block; border-radius: 50%; }
      `}</style>
    </PageTransition>
  );
};

export default GuiaCanecas;
