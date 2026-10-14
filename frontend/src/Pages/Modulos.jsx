import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Modal,
  ProgressBar,
  Spinner,
  Form,
} from "react-bootstrap";
import {
  FaHome,
  FaLayerGroup,
  FaUserCircle,
  FaBookOpen,
  FaMicrophone,
  FaArrowLeft,
  FaGraduationCap,
  FaPencilAlt,
  FaCheck,
  FaLock,
  FaCheckCircle,
  FaBullseye,
  FaBookReader,
  FaTrophy,
  FaExclamationCircle,
} from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";
import PageTransition from "../Components/PageTransition";

const QUIZ_PASS_SCORE = 80;
const FINAL_QUIZ_PASS_SCORE = 90;

const Modulos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [showVocabularioModal, setShowVocabularioModal] = useState(false);

  const userMenu = [
    { name: "Inicio", path: "/inicio", Icon: FaHome },
    { name: "Módulos", path: "/modulos", Icon: FaLayerGroup },
    { name: "Historial", path: "/historial-quizes", Icon: FaBookOpen },
    { name: "Perfil", path: "/perfil", Icon: FaUserCircle },
    { name: "Speaking", path: "/PracticeWithIA", Icon: FaMicrophone },
    { name: "Gap Fill", path: "/PracticeWords", Icon: FaPencilAlt },
  ];

  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(false);
  const [showResultadoModal, setShowResultadoModal] = useState(false);
  const [resultadoQuiz, setResultadoQuiz] = useState({
    puntaje: 0,
    correctas: 0,
    totalPreguntas: 0,
  });

  const [quizesCompletados, setQuizesCompletados] = useState({
    quiz1: false,
    quiz2: false,
    quiz3: false,
  });
  const [currentQuizIndexActive, setCurrentQuizIndexActive] = useState(0);
  const selectedQuizIds = selectedCategoria?.quizIds || [];
  const canStartQuiz2 = quizesCompletados.quiz1;
  const canStartQuiz3 = quizesCompletados.quiz2;

  const fetchCategorias = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await clienteAxios.get(
        `/usuarios/${user.id}/categorias-desbloqueadas`
      );
      setCategorias(response.data);
    } catch (err) {
      console.error("Error al cargar módulos", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const fetchQuizQuestions = async (quizId, index) => {
    if (!quizId) {
      alert("Este quiz no tiene un ID válido.");
      return;
    }

    setQuizLoading(true);
    setCurrentQuizIndexActive(index);
    try {
      const response = await clienteAxios.get(`/quiz/${quizId}/iniciar`);

      setCurrentQuestions(response.data);
      const initial = {};
      response.data.forEach((q) => (initial[q.id] = ""));
      setUserAnswers(initial);
      setIsQuizActive(true);
      setCurrentQuestionIndex(0);
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        err.response?.data ||
        err.message;
      alert(`Error al iniciar el quiz: ${mensaje}`);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const respuestasArray = Object.keys(userAnswers).map((id) => ({
        preguntaId: id,
        respuestaUsuario: userAnswers[id].trim(),
      }));
      const quizIdActual = selectedQuizIds[currentQuizIndexActive];
      const response = await clienteAxios.post(`/quiz/finalizar`, {
        quizId: quizIdActual,
        respuestas: respuestasArray,
      });
      setResultadoQuiz(response.data);
      setShowResultadoModal(true);
      setIsQuizActive(false);

      const puntaje = response.data?.puntaje || 0;

      if (currentQuizIndexActive === 0 && puntaje > QUIZ_PASS_SCORE) {
        setQuizesCompletados((prev) => ({ ...prev, quiz1: true }));
      } else if (currentQuizIndexActive === 1 && puntaje > QUIZ_PASS_SCORE) {
        setQuizesCompletados((prev) => ({ ...prev, quiz2: true }));
      } else if (
        currentQuizIndexActive === 2 &&
        puntaje > FINAL_QUIZ_PASS_SCORE
      ) {
        setQuizesCompletados((prev) => ({ ...prev, quiz3: true }));
      }

      if (response.data?.categoriaDesbloqueada) {
        await fetchCategorias();
      }
    } catch (error) {
      alert("Error al procesar el resultado.");
    }
  };

  return (
    <PageTransition>
      <div className="layout-wrapper sp-modulos-page">
        <Sidebar
          menuItems={userMenu}
          onLogout={() => console.log("Salida")}
        />

        <main className="main-content">
          <Container fluid className="p-4 p-lg-5">
            <div className="mb-4 mb-lg-5">
              <span className="sp-kicker">
                {isQuizActive ? "Evaluación Académica" : "Ruta de Aprendizaje"}
              </span>
              <h1 className="sp-h1">
                {isQuizActive ? "Evaluación de Módulo" : "Módulos de Aprendizaje"}
              </h1>
              <p className="sp-sub">
                {isQuizActive
                  ? "Escribe la respuesta exacta para demostrar tu dominio sobre el vocabulario estudiado."
                  : "Selecciona una categoría técnica para revisar el vocabulario y presentar las evaluaciones asociadas."}
              </p>
            </div>

            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "40vh" }}
              >
                <Spinner animation="border" style={{ color: "var(--azul)" }} />
              </div>
            ) : isQuizActive ? (
              <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                  <Card className="border-0 sp-quiz-card">
                    <ProgressBar
                      now={
                        ((currentQuestionIndex + 1) /
                          currentQuestions.length) *
                        100
                      }
                      className="sp-progressbar"
                    />
                    <Card.Body className="p-4 p-md-5 text-center">
                      <span className="sp-badge-quiz-step mb-3">
                        Pregunta {currentQuestionIndex + 1} de{" "}
                        {currentQuestions.length}
                      </span>
                      <h2 className="mb-4 mb-md-5 sp-quiz-question">
                        {currentQuestions[currentQuestionIndex]?.enunciado}
                      </h2>

                      <Form.Control
                        size="lg"
                        type="text"
                        className="text-center py-3 sp-input mb-4 mb-md-5"
                        placeholder="Ingrese la traducción correspondiente..."
                        value={
                          userAnswers[
                            currentQuestions[currentQuestionIndex]?.id
                          ] || ""
                        }
                        onChange={(e) =>
                          setUserAnswers({
                            ...userAnswers,
                            [currentQuestions[currentQuestionIndex].id]:
                              e.target.value,
                          })
                        }
                        autoFocus
                      />

                      <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                        <Button
                          variant="outline-secondary"
                          size="lg"
                          onClick={() =>
                            setCurrentQuestionIndex((i) => i - 1)
                          }
                          disabled={currentQuestionIndex === 0}
                          className="sp-btn-quiz-outline px-4"
                        >
                          Anterior
                        </Button>
                        {currentQuestionIndex <
                        currentQuestions.length - 1 ? (
                          <Button
                            size="lg"
                            className="sp-btn-quiz-primary px-5"
                            onClick={() =>
                              setCurrentQuestionIndex((i) => i + 1)
                            }
                          >
                            Siguiente
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            className="sp-btn-quiz-success px-5"
                            onClick={handleSubmitQuiz}
                          >
                            Finalizar Evaluación
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : selectedCategoria ? (
              <div>
                <Button
                  variant="link"
                  className="sp-back-link mb-4"
                  onClick={() => setSelectedCategoria(null)}
                >
                  <FaArrowLeft className="me-2" /> Volver a los módulos
                </Button>

                <Card className="border-0 sp-detail-card">
                  <Row className="g-0">
                    <Col
                      md={4}
                      className="sp-detail-brand d-flex align-items-center justify-content-center p-4 p-md-5 text-white text-center"
                    >
                      <div>
                        <div className="sp-icon-wrap mb-3">
                          <FaGraduationCap size={48} />
                        </div>
                        <h2 className="fw-bold mb-3">
                          {selectedCategoria.nombre}
                        </h2>
                        <span className="sp-badge-pill">
                          {selectedCategoria.vocabularios?.length || 0} Términos Registrados
                        </span>
                      </div>
                    </Col>
                    <Col md={8}>
                      <Card.Body className="p-4 p-md-5 text-center d-flex flex-column justify-content-center h-100">
                        <h3 className="mb-4 sp-detail-title">
                          Seleccione una modalidad
                        </h3>
                        <div className="d-grid gap-3 d-sm-flex justify-content-center align-items-center">
                          <Button
                            size="lg"
                            className="sp-btn-study px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                            onClick={() => setShowVocabularioModal(true)}
                          >
                            <FaBookReader /> Estudiar Vocabulario
                          </Button>
                          <div className="d-flex flex-column gap-2 w-100 w-sm-auto">
                            <Button
                              size="lg"
                              className={
                                quizesCompletados.quiz1
                                  ? "sp-btn-quiz-done px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                                  : "sp-btn-quiz-action px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                              }
                              onClick={() =>
                                fetchQuizQuestions(selectedQuizIds[0], 0)
                              }
                              disabled={quizLoading || !selectedQuizIds[0]}
                            >
                              {quizLoading && currentQuizIndexActive === 0 ? (
                                "Cargando..."
                              ) : quizesCompletados.quiz1 ? (
                                <>
                                  <FaCheckCircle /> Evaluación 1 Aprobada
                                </>
                              ) : (
                                <>
                                  <FaBullseye /> Iniciar Evaluación 1
                                </>
                              )}
                            </Button>
                            <Button
                              size="lg"
                              className={
                                quizesCompletados.quiz2
                                  ? "sp-btn-quiz-done px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                                  : "sp-btn-quiz-action px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                              }
                              onClick={() =>
                                fetchQuizQuestions(selectedQuizIds[1], 1)
                              }
                              disabled={
                                quizLoading ||
                                !canStartQuiz2 ||
                                !selectedQuizIds[1]
                              }
                            >
                              {quizLoading && currentQuizIndexActive === 1 ? (
                                "Cargando..."
                              ) : quizesCompletados.quiz2 ? (
                                <>
                                  <FaCheckCircle /> Evaluación 2 Aprobada
                                </>
                              ) : !canStartQuiz2 ? (
                                <>
                                  <FaLock /> Evaluación 2 (Mínimo 80%)
                                </>
                              ) : (
                                <>
                                  <FaBullseye /> Iniciar Evaluación 2
                                </>
                              )}
                            </Button>
                            <Button
                              size="lg"
                              className={
                                quizesCompletados.quiz3
                                  ? "sp-btn-quiz-done px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                                  : "sp-btn-quiz-action px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                              }
                              onClick={() =>
                                fetchQuizQuestions(selectedQuizIds[2], 2)
                              }
                              disabled={
                                quizLoading ||
                                !canStartQuiz3 ||
                                !selectedQuizIds[2]
                              }
                            >
                              {quizLoading && currentQuizIndexActive === 2 ? (
                                "Cargando..."
                              ) : quizesCompletados.quiz3 ? (
                                <>
                                  <FaCheckCircle /> Evaluación Final Aprobada
                                </>
                              ) : !canStartQuiz3 ? (
                                <>
                                  <FaLock /> Evaluación Final (Mínimo 80%)
                                </>
                              ) : (
                                <>
                                  <FaBullseye /> Iniciar Evaluación Final
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </div>
            ) : (
              <Row className="g-4">
                {categorias.map((cat) => (
                  <Col lg={4} md={6} key={cat.id}>
                    <Card
                      as="button"
                      onClick={() => setSelectedCategoria(cat)}
                      className="w-100 h-100 border-0 text-start p-4 sp-module-card-item"
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="sp-card-item-title text-truncate">
                          {cat.nombre}
                        </h3>
                        <span className="sp-badge-count">
                          {cat.vocabularios?.length || 0} términos
                        </span>
                      </div>
                      <p className="sp-card-item-desc text-truncate-2">
                        {cat.descripcion}
                      </p>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </main>

        {/* Modal de Vocabulario */}
        <Modal
          show={showVocabularioModal}
          onHide={() => setShowVocabularioModal(false)}
          size="lg"
          centered
          scrollable
          className="sp-modal"
        >
          <Modal.Header closeButton className="border-0 px-4 py-3">
            <Modal.Title className="fw-bold text-noche text-truncate">
              Glosario: {selectedCategoria?.nombre}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-3 px-md-4">
            <TableResponsive
              vocabulario={selectedCategoria?.vocabularios || []}
            />
          </Modal.Body>
          <Modal.Footer className="border-0 px-4 py-3">
            <Button
              className="sp-btn-modal-close"
              onClick={() => setShowVocabularioModal(false)}
            >
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Resultados */}
        <ResultadoModal
          show={showResultadoModal}
          onHide={() => setShowResultadoModal(false)}
          data={resultadoQuiz}
          navigate={navigate}
        />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          .sp-modulos-page {
            --azul: #2A5DB0;
            --noche: #14295C;
            --verde: #2FC57E;
            --celeste: #E3EEFB;
            --pizarra: #4A5878;
            --borde: #D3E0F3;
            font-family: 'Poppins', sans-serif;
            color: var(--noche);
            background: #F8FAFC;
            min-height: 100vh;
          }

          .sp-kicker {
            color: var(--azul);
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .sp-h1 {
            font-weight: 700;
            font-size: clamp(1.8rem, 3.5vw, 2.4rem);
            color: var(--noche);
            letter-spacing: -0.02em;
            margin-bottom: 0.25rem;
          }
          .sp-sub {
            color: var(--pizarra);
            font-size: 1rem;
            margin: 0;
          }

          /* Tarjetas Módulos */
          .sp-module-card-item {
            background: #fff;
            border: 1px solid var(--borde) !important;
            border-radius: 16px;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          }
          .sp-module-card-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(20, 41, 92, 0.08);
            border-color: var(--azul) !important;
          }
          .sp-card-item-title {
            font-weight: 700;
            font-size: 1.1rem;
            color: var(--noche);
            margin: 0;
            max-width: 70%;
          }
          .sp-badge-count {
            background: var(--celeste);
            color: var(--azul);
            font-weight: 600;
            font-size: 0.75rem;
            padding: 0.25rem 0.65rem;
            border-radius: 999px;
          }
          .sp-card-item-desc {
            color: var(--pizarra);
            font-size: 0.88rem;
            margin: 0;
          }
          .text-truncate-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          /* Botón Volver */
          .sp-back-link {
            color: var(--pizarra);
            font-weight: 500;
            font-size: 0.95rem;
            text-decoration: none;
            padding: 0;
            display: inline-flex;
            align-items: center;
          }
          .sp-back-link:hover {
            color: var(--azul);
          }

          /* Detalle Módulo */
          .sp-detail-card {
            background: #fff;
            border: 1px solid var(--borde);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(20, 41, 92, 0.04);
          }
          .sp-detail-brand {
            background: var(--noche);
          }
          .sp-icon-wrap {
            color: var(--verde);
          }
          .sp-badge-pill {
            background: rgba(255, 255, 255, 0.12);
            color: #fff;
            font-size: 0.85rem;
            font-weight: 500;
            padding: 0.4rem 0.9rem;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
          .sp-detail-title {
            font-weight: 700;
            color: var(--noche);
            font-size: 1.35rem;
          }

          /* Botones Modalidades */
          .sp-btn-study {
            background: var(--celeste);
            color: var(--azul);
            border: 0;
            font-weight: 600;
            border-radius: 12px;
            font-size: 0.95rem;
          }
          .sp-btn-study:hover {
            background: #D3E0F3;
            color: var(--noche);
          }
          .sp-btn-quiz-action {
            background: var(--azul);
            color: #fff;
            border: 0;
            font-weight: 600;
            border-radius: 12px;
            font-size: 0.95rem;
          }
          .sp-btn-quiz-action:hover:not(:disabled) {
            background: var(--noche);
          }
          .sp-btn-quiz-action:disabled {
            background: #E2E8F0;
            color: #94A3B8;
            cursor: not-allowed;
          }
          .sp-btn-quiz-done {
            background: #198754;
            color: #fff;
            border: 0;
            font-weight: 600;
            border-radius: 12px;
            font-size: 0.95rem;
          }

          /* Vista Quiz */
          .sp-quiz-card {
            background: #fff;
            border: 1px solid var(--borde);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(20, 41, 92, 0.05);
          }
          .sp-progressbar {
            height: 8px;
            background-color: var(--celeste);
          }
          .sp-progressbar .progress-bar {
            background-color: var(--azul);
          }
          .sp-badge-quiz-step {
            display: inline-block;
            background: var(--celeste);
            color: var(--azul);
            font-weight: 600;
            font-size: 0.85rem;
            padding: 0.35rem 0.85rem;
            border-radius: 999px;
          }
          .sp-quiz-question {
            font-weight: 700;
            color: var(--noche);
            font-size: clamp(1.4rem, 3vw, 1.8rem);
          }
          .sp-input {
            border: 1.5px solid var(--borde);
            border-radius: 12px;
            font-family: 'Poppins', sans-serif;
            color: var(--noche);
            font-weight: 500;
          }
          .sp-input:focus {
            border-color: var(--azul);
            box-shadow: 0 0 0 3px rgba(42, 93, 176, 0.18);
          }
          .sp-btn-quiz-outline {
            border-radius: 999px;
            font-weight: 600;
            border-color: var(--borde);
            color: var(--pizarra);
          }
          .sp-btn-quiz-primary {
            background: var(--azul);
            border: 0;
            border-radius: 999px;
            font-weight: 600;
          }
          .sp-btn-quiz-primary:hover {
            background: var(--noche);
          }
          .sp-btn-quiz-success {
            background: var(--verde);
            color: var(--noche);
            border: 0;
            border-radius: 999px;
            font-weight: 600;
          }
          .sp-btn-quiz-success:hover {
            background: #28b070;
            color: var(--noche);
          }

          /* Modales */
          .sp-modal .modal-content {
            border-radius: 20px;
            border: 1px solid var(--borde);
          }
          .sp-btn-modal-close {
            background: var(--pizarra);
            color: #fff;
            border: 0;
            border-radius: 10px;
            padding: 0.6rem 1.5rem;
            font-weight: 500;
          }
          .sp-btn-modal-close:hover {
            background: var(--noche);
          }
        `}</style>
      </div>
    </PageTransition>
  );
};

const TableResponsive = ({ vocabulario }) => (
  <div className="py-2">
    {vocabulario.length > 0 ? (
      vocabulario.map((v, i) => (
        <div
          key={i}
          className="d-flex justify-content-between align-items-center py-3 border-bottom"
        >
          <div style={{ flex: 1 }}>
            <span
              className="fw-bold fs-5"
              style={{ color: "var(--azul)" }}
            >
              {v.palabraIngles}
            </span>
            <div
              className="small italic"
              style={{ color: "var(--pizarra)" }}
            >
              {v.pronunciacion}
            </div>
          </div>
          <div className="ps-2" style={{ flex: 1, textAlign: "right" }}>
            <span
              className="fw-bold fs-5"
              style={{ color: "#198754" }}
            >
              {v.palabraEspanol}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center p-4" style={{ color: "var(--pizarra)" }}>
        No hay registros de vocabulario disponibles para este módulo.
      </p>
    )}
  </div>
);

const ResultadoModal = ({ show, onHide, data, navigate }) => {
  const aprobo = data.puntaje >= 80;

  return (
    <Modal show={show} onHide={onHide} centered className="sp-modal">
      <Modal.Body className="text-center p-4 p-md-5 rounded-4">
        <div className="mb-3">
          {aprobo ? (
            <div
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(47, 197, 126, 0.15)",
                color: "var(--verde)",
              }}
            >
              <FaTrophy size={36} />
            </div>
          ) : (
            <div
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(248, 113, 113, 0.15)",
                color: "#EF4444",
              }}
            >
              <FaExclamationCircle size={36} />
            </div>
          )}
        </div>
        <h2 className="fw-bold mb-2" style={{ color: "var(--noche)" }}>
          Resultado: {data.puntaje?.toFixed(1) || 0}%
        </h2>
        <p className="mb-4 fs-6" style={{ color: "var(--pizarra)" }}>
          Obtuviste {data.correctas} respuestas correctas de {data.totalPreguntas} preguntas en total.
        </p>
        <div className="d-grid gap-2 mt-4">
          <Button
            size="lg"
            style={{
              background: "var(--azul)",
              border: 0,
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "0.95rem",
            }}
            onClick={onHide}
          >
            Continuar Practicando
          </Button>
          <Button
            variant="outline-secondary"
            size="lg"
            style={{
              borderRadius: "12px",
              fontWeight: "500",
              fontSize: "0.95rem",
              borderColor: "var(--borde)",
              color: "var(--pizarra)",
            }}
            onClick={() => navigate("/historial-quizes")}
          >
            Ver Historial de Intentos
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Modulos;
