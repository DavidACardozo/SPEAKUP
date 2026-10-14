import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaBookOpen,
  FaPencilAlt,
  FaUnlockAlt,
  FaLock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import ImagoTipo, { IsoTipo, LogoTipo } from "../Components/Logo";
// 1. Importas el componente reutilizable de animación
import PageTransition from "../Components/PageTransition";

const PASOS = [
  {
    icon: <FaBookOpen />,
    titulo: "Estudia una categoría",
    texto:
      "El vocabulario está agrupado por temas. Aprendes las palabras de una categoría a la vez, sin saturarte.",
  },
  {
    icon: <FaPencilAlt />,
    titulo: "Escribe tus respuestas",
    texto:
      "El quiz es de respuesta escrita: no hay opciones para adivinar. Demuestras que sabes la palabra y recibes retroalimentación al instante.",
  },
  {
    icon: <FaUnlockAlt />,
    titulo: "Desbloquea la siguiente",
    texto:
      "Con el 100 % en el quiz se abre la siguiente categoría. Así avanzas solo cuando dominas lo anterior.",
  },
];

const COMPARACION = [
  ["Costo", "Freemium: lo completo requiere suscripción", "Gratuita, sin funciones bloqueadas"],
  ["Cómo se avanza", "Se puede pasar de nivel sin dominar el contenido", "Se desbloquea solo con el 100 % en el quiz"],
  ["Evaluación", "Preguntas de selección donde se puede adivinar", "Respuesta escrita para demostrar que sabes"],
  ["Seguimiento", "Rachas y puntos centrados en la constancia", "Dashboard e historial de intentos por categoría"],
  ["Contexto", "Contenido genérico para todo el mundo", "Pensada para hispanohablantes en Colombia"],
];

const LandingPage = () => {
  return (
    <PageTransition>
      <div className="su-landing">
        <header className="su-nav">
          <Container className="d-flex align-items-center justify-content-between">
            <Link to="/" aria-label="SpeakUp W&B, inicio" className="text-decoration-none">
              <ImagoTipo size={38} />
            </Link>

            <nav className="su-nav-links" aria-label="Principal">
              <a href="#como-funciona">Cómo funciona</a>
              <a href="#diferencias">Por qué SpeakUp</a>
            </nav>

            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="su-btn su-btn-text">
                Iniciar sesión
              </Link>
              <Link to="/registro" className="su-btn su-btn-primary">
                Crear cuenta
              </Link>
            </div>
          </Container>
        </header>

        <section className="su-hero">
          <Container>
            <Row className="justify-content-center">
              <Col lg={9} xl={8} className="text-center">
                <p className="su-kicker">Vocabulario en inglés para hispanohablantes</p>
                <h1 className="su-h1">
                  Alza tu voz, <span>palabra a palabra.</span>
                </h1>
                <p className="su-lead mx-auto">
                  Aprende vocabulario en inglés categoría por categoría. Responde
                  escribiendo, recibe retroalimentación inmediata y desbloquea el
                  siguiente nivel cuando domines el 100 %. Gratis y desde tu
                  navegador.
                </p>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
                  <Link to="/registro" className="su-btn su-btn-primary su-btn-lg">
                    Speak up. Tu inglés empieza hoy.
                  </Link>
                  <a href="#como-funciona" className="su-btn su-btn-outline su-btn-lg">
                    Ver cómo funciona
                  </a>
                </div>

                <ul className="su-checks justify-content-center">
                  <li><FaCheck aria-hidden /> Sin suscripción</li>
                  <li><FaCheck aria-hidden /> Quiz de respuesta escrita</li>
                  <li><FaCheck aria-hidden /> Dashboard de progreso</li>
                </ul>
              </Col>
            </Row>
          </Container>
        </section>

        <section id="como-funciona" className="su-section su-section-celeste">
          <Container>
            <div className="su-section-head">
              <h2 className="su-h2">Un método simple: dominar antes de avanzar</h2>
              <p>
                Cada categoría es un territorio por conquistar. Avanzas a tu
                ritmo, con una meta clara en cada paso.
              </p>
            </div>

            <Row className="g-4">
              {PASOS.map((p, i) => (
                <Col md={4} key={p.titulo}>
                  <article className="su-step">
                    <div className="su-step-top">
                      <span className="su-step-icon">{p.icon}</span>
                      <span className="su-step-num">{i + 1}</span>
                    </div>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </article>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        <section id="diferencias" className="su-section">
          <Container>
            <Row className="g-5 align-items-start">
              <Col lg={4}>
                <h2 className="su-h2">Hecha para que de verdad aprendas</h2>
                <p className="su-muted">
                  Las apps comerciales buscan que vuelvas todos los días.
                  SpeakUp W&amp;B busca que recuerdes las palabras.
                </p>
                <Link to="/registro" className="su-btn su-btn-primary mt-2">
                  Crear cuenta gratis
                </Link>
              </Col>

              <Col lg={8}>
                <div className="su-table-wrap">
                  <table className="su-table">
                    <thead>
                      <tr>
                        <th scope="col"><span className="visually-hidden">Criterio</span></th>
                        <th scope="col">Apps comerciales</th>
                        <th scope="col" className="su-th-us">SpeakUp W&amp;B</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARACION.map(([criterio, otros, nosotros]) => (
                        <tr key={criterio}>
                          <th scope="row">{criterio}</th>
                          <td><FaTimes aria-hidden className="su-x" /> {otros}</td>
                          <td className="su-td-us"><FaCheck aria-hidden className="su-ok" /> {nosotros}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="su-cta">
          <Container className="text-center">
            <IsoTipo size={56} variant="negativo" />
            <h2>
              Cada palabra que aprendes <span>sube el volumen de tu voz.</span>
            </h2>
            <p>Crea tu cuenta gratis y empieza hoy con tu primera categoría.</p>
            <Link to="/registro" className="su-btn su-btn-light su-btn-lg">
              Speak up. Tu inglés empieza hoy.
            </Link>
          </Container>
        </section>

        <footer className="su-footer">
          <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <LogoTipo size={22} />
            <small>Alza tu voz, palabra a palabra.</small>
          </Container>
        </footer>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          .su-landing {
            --azul: #2A5DB0;
            --noche: #14295C;
            --verde: #2FC57E;
            --celeste: #E3EEFB;
            --pizarra: #4A5878;
            --borde: #D3E0F3;
            font-family: 'Poppins', sans-serif;
            color: var(--noche);
            background: #fff;
            overflow-x: hidden;
          }
          .su-landing h1, .su-landing h2, .su-landing h3 { font-family: 'Poppins', sans-serif; font-weight: 700; letter-spacing: -0.02em; }
          .su-landing p { color: var(--pizarra); }
          .su-landing a:focus-visible, .su-landing button:focus-visible { outline: 3px solid var(--azul); outline-offset: 3px; }

          /* Botones */
          .su-btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; padding: .6rem 1.25rem; border-radius: 999px; font-weight: 500; font-size: .95rem; text-decoration: none; border: 2px solid transparent; transition: background .2s, color .2s, border-color .2s; }
          .su-btn-lg { padding: .85rem 1.75rem; font-size: 1rem; font-weight: 600; }
          .su-btn-primary { background: var(--azul); color: #fff; }
          .su-btn-primary:hover { background: var(--noche); color: #fff; }
          .su-btn-outline { border-color: var(--azul); color: var(--azul); background: transparent; }
          .su-btn-outline:hover { background: var(--azul); color: #fff; }
          .su-btn-text { color: var(--noche); }
          .su-btn-text:hover { color: var(--azul); }
          .su-btn-light { background: #fff; color: var(--noche); }
          .su-btn-light:hover { background: var(--celeste); color: var(--noche); }

          /* Navbar */
          .su-nav { position: sticky; top: 0; z-index: 20; background: #fff; border-bottom: 1px solid var(--borde); padding: .75rem 0; }
          .su-nav-links { display: none; gap: 2rem; }
          .su-nav-links a { color: var(--pizarra); text-decoration: none; font-weight: 500; font-size: .95rem; }
          .su-nav-links a:hover { color: var(--azul); }
          @media (min-width: 992px) { .su-nav-links { display: flex; } }
          @media (max-width: 575px) { .su-btn-text { display: none; } }

          /* Hero */
          .su-hero { background: #fff; padding: 4.5rem 0 5rem; }
          .su-kicker { color: var(--azul); font-weight: 600; font-size: .95rem; margin-bottom: 1rem; }
          .su-h1 { font-size: clamp(2.4rem, 5.5vw, 3.9rem); line-height: 1.08; margin-bottom: 1.25rem; }
          .su-h1 span { color: var(--azul); }
          .su-lead { font-size: 1.1rem; line-height: 1.7; max-width: 34rem; }
          .su-checks { list-style: none; padding: 0; margin: 2rem 0 0; display: flex; flex-wrap: wrap; gap: .75rem 1.5rem; font-size: .9rem; color: var(--pizarra); }
          .su-checks svg { color: var(--verde); margin-right: .4rem; }

          /* Vista previa */
          .su-preview { background: var(--celeste); border-radius: 28px; padding: 2rem; display: grid; gap: 1rem; }
          .su-card { background: #fff; border: 1px solid var(--borde); border-radius: 20px; padding: 1.25rem 1.5rem; }
          .su-card-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1rem; }
          .su-card-head span { font-size: .8rem; color: var(--pizarra); }
          .su-cat { margin-bottom: 1rem; }
          .su-cat:last-child { margin-bottom: 0; }
          .su-cat-row { display: flex; justify-content: space-between; align-items: center; font-size: .9rem; font-weight: 500; margin-bottom: .4rem; }
          .su-cat-locked { opacity: .65; }
          .su-badge { font-size: .75rem; font-weight: 600; color: var(--pizarra); display: inline-flex; align-items: center; gap: .3rem; }
          .su-badge-ok { background: var(--verde); color: var(--noche); padding: .1rem .55rem; border-radius: 999px; }
          .su-bar { height: 8px; background: var(--celeste); border-radius: 999px; overflow: hidden; }
          .su-bar i { display: block; height: 100%; border-radius: 999px; }
          .su-quiz small { color: var(--pizarra); }
          .su-input { margin: .5rem 0; padding: .6rem 1rem; border: 2px solid var(--azul); border-radius: 12px; font-weight: 500; }
          .su-feedback { background: var(--verde); color: var(--noche); font-weight: 600; font-size: .85rem; padding: .5rem .9rem; border-radius: 12px; }

          /* Secciones */
          .su-section { padding: 5rem 0; }
          .su-section-celeste { background: var(--celeste); }
          .su-section-head { max-width: 40rem; margin-bottom: 2.5rem; }
          .su-h2 { font-size: clamp(1.7rem, 3.5vw, 2.4rem); line-height: 1.15; margin-bottom: 1rem; }
          .su-muted { line-height: 1.7; }

          .su-step { background: #fff; border-radius: 20px; padding: 1.75rem; height: 100%; border: 1px solid var(--borde); }
          .su-step-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
          .su-step-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--azul); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 1.2rem; }
          .su-step-num { font-weight: 700; font-size: 1.6rem; color: var(--borde); }
          .su-step h3 { font-size: 1.15rem; margin-bottom: .5rem; }
          .su-step p { margin: 0; line-height: 1.65; font-size: .95rem; }

          /* Tabla */
          .su-table-wrap { overflow-x: auto; border: 1px solid var(--borde); border-radius: 20px; }
          .su-table { width: 100%; min-width: 560px; border-collapse: collapse; font-size: .92rem; }
          .su-table th, .su-table td { padding: 1rem 1.25rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--borde); }
          .su-table tbody tr:last-child th, .su-table tbody tr:last-child td { border-bottom: 0; }
          .su-table thead th { font-weight: 600; color: var(--pizarra); background: #fff; }
          .su-table thead .su-th-us { background: var(--azul); color: #fff; }
          .su-table tbody th { font-weight: 600; color: var(--noche); width: 18%; }
          .su-table td { color: var(--pizarra); }
          .su-td-us { background: var(--celeste); color: var(--noche) !important; font-weight: 500; }
          .su-x { color: #B0B9CC; margin-right: .4rem; }
          .su-ok { color: var(--verde); margin-right: .4rem; }

          /* CTA */
          .su-cta { background: var(--noche); padding: 5rem 0; }
          .su-cta h2 { color: #fff; font-size: clamp(1.8rem, 4vw, 2.8rem); max-width: 40rem; margin: 1.5rem auto 1rem; }
          .su-cta h2 span { color: #8FB2F0; }
          .su-cta p { color: #C9D6EE; margin-bottom: 2rem; }

          /* Footer */
          .su-footer { padding: 1.75rem 0; border-top: 1px solid var(--borde); background: #fff; }
          .su-footer small { color: var(--pizarra); }

          html { scroll-behavior: smooth; }
          @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } .su-btn { transition: none; } }
        `}</style>
      </div>
    </PageTransition>
  );
};

export default LandingPage;