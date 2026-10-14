import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import clienteAxios from "../Api/axiosConfig";
import { Form, Spinner } from "react-bootstrap";
import { FaCheck, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import ImagoTipo from "../Components/Logo";
import { useAuth } from "../Context/AuthContext";
import PageTransition from "../Components/PageTransition"; 

const PUNTOS = [
  "Retoma la categoría donde la dejaste",
  "Consulta tu dashboard e historial de intentos",
  "Desbloquea la siguiente con el 100 % en el quiz",
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

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
    <PageTransition>
      <div className="sl-page">
        {/* Panel de marca */}
        <aside className="sl-brand">
          <ImagoTipo size={40} variant="negativo" />

          <div className="sl-brand-body">
            <h1>Qué bueno verte de nuevo.</h1>
            <p>Cada palabra que aprendes sube el volumen de tu voz.</p>

            <ul>
              {PUNTOS.map((p) => (
                <li key={p}>
                  <FaCheck aria-hidden /> {p}
                </li>
              ))}
            </ul>
          </div>

          <small>Alza tu voz, palabra a palabra.</small>
        </aside>

        {/* Formulario */}
        <main className="sl-main">
          <div className="sl-form-wrap">
            <Link to="/" className="sl-back">
              <FaArrowLeft aria-hidden /> Volver al inicio
            </Link>

            <div className="sl-mobile-logo">
              <ImagoTipo size={34} />
            </div>

            <h2>Inicia sesión</h2>
            <p className="sl-sub">Ingresa para continuar con tus categorías.</p>

            {error && (
              <div className="sl-alert" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit} noValidate={false}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Usuario o correo</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Tu usuario o correo"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  className="sl-input"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <div className="sl-pass">
                  <Form.Control
                    type={verPassword ? "text" : "password"}
                    name="password"
                    placeholder="Tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="sl-input"
                  />
                  <button
                    type="button"
                    className="sl-eye"
                    onClick={() => setVerPassword(!verPassword)}
                    aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {verPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </Form.Group>

              <button type="submit" className="sl-submit" disabled={cargando}>
                {cargando ? (
                  <>
                    <Spinner animation="border" size="sm" /> Ingresando…
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </Form>

            <p className="sl-foot">
              ¿Nuevo en SpeakUp? <Link to="/registro">Crea tu cuenta gratis</Link>
            </p>
          </div>
        </main>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          .sl-page {
            --azul: #2A5DB0;
            --noche: #14295C;
            --verde: #2FC57E;
            --celeste: #E3EEFB;
            --pizarra: #4A5878;
            --borde: #D3E0F3;
            font-family: 'Poppins', sans-serif;
            color: var(--noche);
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr;
            background: #fff;
          }
          @media (min-width: 992px) { .sl-page { grid-template-columns: 5fr 6fr; } }

          /* Panel de marca */
          .sl-brand { display: none; background: var(--noche); color: #fff; padding: 3rem 3.5rem; flex-direction: column; justify-content: space-between; }
          @media (min-width: 992px) { .sl-brand { display: flex; } }
          .sl-brand-body h1 { font-weight: 700; font-size: clamp(2rem, 3vw, 2.6rem); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1rem; color: #fff; }
          .sl-brand-body p { color: #C9D6EE; font-size: 1.05rem; margin-bottom: 2rem; max-width: 26rem; }
          .sl-brand-body ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .9rem; }
          .sl-brand-body li { display: flex; align-items: center; gap: .75rem; font-size: .95rem; color: #fff; }
          .sl-brand-body li svg { color: var(--verde); flex-shrink: 0; }
          .sl-brand small { color: #8FB2F0; }

          /* Formulario */
          .sl-main { display: flex; align-items: center; justify-content: center; padding: 2.5rem 1.5rem; background: #fff; }
          .sl-form-wrap { width: 100%; max-width: 26rem; }
          .sl-back { display: inline-flex; align-items: center; gap: .5rem; font-size: .85rem; font-weight: 500; color: var(--pizarra); text-decoration: none; margin-bottom: 2rem; }
          .sl-back:hover { color: var(--azul); }
          .sl-mobile-logo { margin-bottom: 1.75rem; }
          @media (min-width: 992px) { .sl-mobile-logo { display: none; } }

          .sl-form-wrap h2 { font-weight: 700; font-size: 1.9rem; letter-spacing: -0.02em; margin-bottom: .35rem; }
          .sl-sub { color: var(--pizarra); margin-bottom: 1.75rem; }

          .sl-form-wrap .form-label { font-size: .85rem; font-weight: 500; color: var(--noche); margin-bottom: .35rem; }
          .sl-input.form-control { font-family: 'Poppins', sans-serif; padding: .7rem .9rem; border: 1.5px solid var(--borde); border-radius: 10px; color: var(--noche); }
          .sl-input.form-control::placeholder { color: #8A97B1; }
          .sl-input.form-control:focus { border-color: var(--azul); box-shadow: 0 0 0 3px rgba(42, 93, 176, .18); }

          .sl-pass { position: relative; }
          .sl-pass .sl-input.form-control { padding-right: 2.75rem; }
          .sl-eye { position: absolute; right: .35rem; top: 50%; transform: translateY(-50%); background: none; border: 0; color: var(--pizarra); padding: .5rem; border-radius: 8px; line-height: 1; }
          .sl-eye:hover { color: var(--azul); }
          .sl-eye:focus-visible, .sl-back:focus-visible, .sl-foot a:focus-visible, .sl-submit:focus-visible { outline: 3px solid var(--azul); outline-offset: 2px; }

          .sl-submit { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: .6rem; padding: .8rem 1rem; border: 0; border-radius: 10px; background: var(--azul); color: #fff; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 1rem; transition: background .2s; }
          .sl-submit:hover:not(:disabled) { background: var(--noche); }
          .sl-submit:disabled { opacity: .7; cursor: not-allowed; }

          .sl-alert { background: #FDECEC; border: 1px solid #F2B8B8; color: #8A1C1C; padding: .75rem 1rem; border-radius: 10px; font-size: .9rem; margin-bottom: 1.25rem; }

          .sl-foot { text-align: center; margin: 1.75rem 0 0; font-size: .9rem; color: var(--pizarra); }
          .sl-foot a { color: var(--azul); font-weight: 600; text-decoration: none; }
          .sl-foot a:hover { text-decoration: underline; }

          @media (prefers-reduced-motion: reduce) { .sl-submit { transition: none; } }
        `}</style>
      </div>
    </PageTransition>
  );
};

export default Login;