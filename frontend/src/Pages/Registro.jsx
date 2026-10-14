import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../Api/axiosConfig";
import { Form, Spinner } from "react-bootstrap";
import { FaCheck, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import ImagoTipo from "../Components/Logo";
import PageTransition from "../Components/PageTransition"; 

const PUNTOS = [
  "Gratis, sin suscripción",
  "Vocabulario organizado por categorías",
  "Quiz de respuesta escrita con retroalimentación inmediata",
];

const PasswordField = ({ id, name, label, placeholder, value, onChange, autoComplete, disabled }) => {
  const [ver, setVer] = useState(false);
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <div className="sl-pass">
        <Form.Control
          type={ver ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          required
          className="sl-input"
        />
        <button
          type="button"
          className="sl-eye"
          onClick={() => setVer(!ver)}
          aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {ver ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </Form.Group>
  );
};

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [respuesta, setRespuesta] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

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

    if (formData.password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      setCargando(false);
      return;
    }

    try {
      const response = await clienteAxios.post("/auth/registro", formData);
      setRespuesta(response.data);
      setFormData({ nombre: "", apellido: "", email: "", password: "" });
      setConfirmarPassword("");
    } catch (err) {
      const mensajeError =
        err.response?.data?.mensaje || "Error al registrar el usuario.";
      setError(mensajeError);
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
            <h1>Speak up. Tu inglés empieza hoy.</h1>
            <p>Crea tu cuenta y aprende tus primeras palabras en minutos.</p>

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

            {respuesta ? (
              <div className="sl-success" role="status">
                <span className="sl-success-icon">
                  <FaCheck aria-hidden />
                </span>
                <h2>¡Cuenta creada!</h2>
                <p className="sl-sub">
                  Ya puedes iniciar sesión con tus credenciales y empezar con tu
                  primera categoría.
                </p>
                <button
                  type="button"
                  className="sl-submit"
                  onClick={() => navigate("/login")}
                >
                  Iniciar sesión
                </button>
              </div>
            ) : (
              <>
                <h2>Crea tu cuenta</h2>
                <p className="sl-sub">Es gratis y te toma menos de un minuto.</p>

                {error && (
                  <div className="sl-alert" role="alert" aria-live="polite">
                    {error}
                  </div>
                )}

                <Form onSubmit={handleSubmit}>
                  <div className="sl-row">
                    <Form.Group className="mb-3" controlId="nombre">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        autoComplete="given-name"
                        required
                        disabled={cargando}
                        className="sl-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="apellido">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        placeholder="Tu apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        autoComplete="family-name"
                        required
                        disabled={cargando}
                        className="sl-input"
                      />
                    </Form.Group>
                  </div>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="correo@ejemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                      disabled={cargando}
                      className="sl-input"
                    />
                  </Form.Group>

                  <PasswordField
                    id="password"
                    name="password"
                    label="Contraseña"
                    placeholder="Crea una contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    disabled={cargando}
                  />

                  <PasswordField
                    id="confirmarPassword"
                    name="confirmarPassword"
                    label="Confirmar contraseña"
                    placeholder="Repite tu contraseña"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={cargando}
                  />

                  <button type="submit" className="sl-submit mt-3" disabled={cargando}>
                    {cargando ? (
                      <>
                        <Spinner animation="border" size="sm" /> Creando cuenta…
                      </>
                    ) : (
                      "Crear cuenta"
                    )}
                  </button>
                </Form>

                <p className="sl-foot">
                  ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
              </>
            )}
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

          .sl-brand { display: none; background: var(--noche); color: #fff; padding: 3rem 3.5rem; flex-direction: column; justify-content: space-between; }
          @media (min-width: 992px) { .sl-brand { display: flex; } }
          .sl-brand-body h1 { font-weight: 700; font-size: clamp(2rem, 3vw, 2.6rem); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 1rem; color: #fff; }
          .sl-brand-body p { color: #C9D6EE; font-size: 1.05rem; margin-bottom: 2rem; max-width: 26rem; }
          .sl-brand-body ul { list-style: none; padding: 0; margin: 0; display: grid; gap: .9rem; }
          .sl-brand-body li { display: flex; align-items: center; gap: .75rem; font-size: .95rem; color: #fff; }
          .sl-brand-body li svg { color: var(--verde); flex-shrink: 0; }
          .sl-brand small { color: #8FB2F0; }

          .sl-main { display: flex; align-items: center; justify-content: center; padding: 2.5rem 1.5rem; background: #fff; }
          .sl-form-wrap { width: 100%; max-width: 28rem; }
          .sl-back { display: inline-flex; align-items: center; gap: .5rem; font-size: .85rem; font-weight: 500; color: var(--pizarra); text-decoration: none; margin-bottom: 2rem; }
          .sl-back:hover { color: var(--azul); }
          .sl-mobile-logo { margin-bottom: 1.75rem; }
          @media (min-width: 992px) { .sl-mobile-logo { display: none; } }

          .sl-form-wrap h2 { font-weight: 700; font-size: 1.9rem; letter-spacing: -0.02em; margin-bottom: .35rem; }
          .sl-sub { color: var(--pizarra); margin-bottom: 1.75rem; }

          .sl-row { display: grid; grid-template-columns: 1fr; gap: 0 1rem; }
          @media (min-width: 576px) { .sl-row { grid-template-columns: 1fr 1fr; } }

          .sl-form-wrap .form-label { font-size: .85rem; font-weight: 500; color: var(--noche); margin-bottom: .35rem; }
          .sl-input.form-control { font-family: 'Poppins', sans-serif; padding: .7rem .9rem; border: 1.5px solid var(--borde); border-radius: 10px; color: var(--noche); }
          .sl-input.form-control::placeholder { color: #8A97B1; }
          .sl-input.form-control:focus { border-color: var(--azul); box-shadow: 0 0 0 3px rgba(42, 93, 176, .18); }
          .sl-input.form-control:disabled { background: var(--celeste); }

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

          .sl-success-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--verde); color: var(--noche); display: inline-flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem; }

          @media (prefers-reduced-motion: reduce) { .sl-submit { transition: none; } }
        `}</style>
      </div>
    </PageTransition>
  );
};

export default Registro;