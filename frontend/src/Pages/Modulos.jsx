import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Card,
  Row,
  Col,
  Modal,
  Badge,
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
  FaPencilAlt
} from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import clienteAxios from "../Api/axiosConfig";
import { useAuth } from "../Context/AuthContext";

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
  const [resultadoQuiz, setResultadoQuiz] = useState({ puntaje: 0, correctas: 0, totalPreguntas: 0 });

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const response = await clienteAxios.get(`/usuarios/${user.id}/categorias-desbloqueadas`);
        setCategorias(response.data);
      } catch (err) {
        console.error("Error al cargar módulos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, [user]);

  const fetchQuizQuestions = async (quizId) => {
    setQuizLoading(true);
    try {
      const response = await clienteAxios.get(`/quiz/${quizId}/iniciar`);
      setCurrentQuestions(response.data);
      const initial = {};
      response.data.forEach((q) => (initial[q.id] = ""));
      setUserAnswers(initial);
      setIsQuizActive(true);
      setCurrentQuestionIndex(0);
    } catch (err) {
      alert("Error al iniciar el quiz.");
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
      const response = await clienteAxios.post(`/quiz/finalizar`, {
        quizId: selectedCategoria.quizId,
        respuestas: respuestasArray,
      });
      setResultadoQuiz(response.data);
      setShowResultadoModal(true);
      setIsQuizActive(false);
    } catch (error) {
      alert("Error al procesar el resultado.");
    }
  };

  return (

    <div className="layout-wrapper">
      <Sidebar 
        menuItems={userMenu} 
        brand={{ name: "SpeakUp!", logo: "🦉" }} 
        onLogout={() => console.log("Salida")} 
      />
      
      
      <main className="main-content">
        <Container fluid className="p-4 p-lg-5">
          
         
          <div className="mb-4 mb-lg-5">
            <h1 className="fw-bold display-5" style={{ color: "#01579B" }}>
              {isQuizActive ? "Modo Quiz 📝" : "Módulos de Aprendizaje 📚"}
            </h1>
            <p className="text-muted fs-5">
              {isQuizActive ? "Demuestra lo que has aprendido hoy." : "Selecciona un tema y comienza a estudiar."}
            </p>
            <hr className="d-none d-md-block" style={{ width: "100px", borderTop: "4px solid #01579B", borderRadius: "10px" }} />
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <Spinner animation="grow" variant="primary" />
            </div>
          ) : isQuizActive ? (
            
            <Row className="justify-content-center animate__animated animate__fadeIn">
              <Col lg={10} xl={8}>
                <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                  <ProgressBar 
                    now={((currentQuestionIndex + 1) / currentQuestions.length) * 100} 
                    variant="primary" 
                    style={{ height: "10px" }} 
                    animated 
                  />
                  <Card.Body className="p-4 p-md-5 text-center">
                    <Badge bg="light" text="dark" className="mb-3 px-3 py-2 border">
                      Pregunta {currentQuestionIndex + 1} de {currentQuestions.length}
                    </Badge>
                    <h2 className="mb-4 mb-md-5 fw-bold">{currentQuestions[currentQuestionIndex]?.enunciado}</h2>
                    
                    <Form.Control
                      size="lg"
                      type="text"
                      className="text-center py-3 border-2 mb-4 mb-md-5 rounded-3"
                      placeholder="Escribe aquí..."
                      value={userAnswers[currentQuestions[currentQuestionIndex]?.id] || ""}
                      onChange={(e) => setUserAnswers({...userAnswers, [currentQuestions[currentQuestionIndex].id]: e.target.value})}
                      autoFocus
                    />

                    <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                      <Button 
                        variant="outline-secondary" 
                        size="lg"
                        onClick={() => setCurrentQuestionIndex((i) => i - 1)}
                        disabled={currentQuestionIndex === 0}
                        className="px-4 rounded-pill"
                      >
                        Anterior
                      </Button>
                      {currentQuestionIndex < currentQuestions.length - 1 ? (
                        <Button variant="primary" size="lg" className="px-5 rounded-pill shadow" onClick={() => setCurrentQuestionIndex((i) => i + 1)}>
                          Siguiente
                        </Button>
                      ) : (
                        <Button variant="success" size="lg" className="px-5 rounded-pill shadow" onClick={handleSubmitQuiz}>
                          Finalizar Quiz
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : selectedCategoria ? (
            <div className="animate__animated animate__fadeIn">
              <Button variant="link" className="text-decoration-none text-secondary mb-4 p-0 fs-5" onClick={() => setSelectedCategoria(null)}>
                <FaArrowLeft className="me-2" /> Volver a los módulos
              </Button>

              <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                <Row className="g-0">
                  <Col md={4} className="bg-primary d-flex align-items-center justify-content-center p-4 p-md-5 text-white text-center">
                    <div>
                      <FaGraduationCap size={60} className="mb-3" />
                      <h2 className="fw-bold mb-3">{selectedCategoria.nombre}</h2>
                      <Badge bg="light" text="primary" pill className="px-3 py-2 fs-6">
                        {selectedCategoria.vocabulario?.length || 0} Palabras
                      </Badge>
                    </div>
                  </Col>
                  <Col md={8}>
                    <Card.Body className="p-4 p-md-5 text-center">
                      <h3 className="mb-4 fw-bold">¿Cómo quieres empezar?</h3>
                      <div className="d-grid gap-3 d-sm-flex justify-content-center">
                        <Button size="lg" variant="outline-primary" className="px-4 py-3 rounded-pill shadow-sm" onClick={() => setShowVocabularioModal(true)}>
                          📖 Estudiar Vocabulario
                        </Button>
                        <Button size="lg" variant="primary" className="px-4 py-3 rounded-pill shadow-sm" onClick={() => fetchQuizQuestions(selectedCategoria.quizId)}>
                          🎯 Iniciar Quiz Final
                        </Button>
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
                    className="w-100 h-100 shadow-sm border-0 text-start p-4 rounded-4 category-card"
                    style={{ 
                      transition: "all 0.3s ease", 
                      background: "white",
                      borderLeft: "6px solid #01579B",
                      cursor: "pointer"
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold mb-0 text-truncate" style={{ color: "#01579B", maxWidth: "70%" }}>{cat.nombre}</h5>
                      <Badge bg="info" pill>{cat.vocabulario?.length || 0} términos</Badge>
                    </div>
                    <p className="text-muted small mb-0 text-truncate-2">{cat.descripcion}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </main>

     
      <Modal show={showVocabularioModal} onHide={() => setShowVocabularioModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton className="border-0 bg-light px-4 py-3">
          <Modal.Title className="fw-bold text-truncate">Vocabulario: {selectedCategoria?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-3 px-md-4">
          <TableResponsive vocabulario={selectedCategoria?.vocabulario || []} />
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <Button variant="secondary" onClick={() => setShowVocabularioModal(false)} className="rounded-pill px-4 w-100 w-sm-auto">Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <ResultadoModal show={showResultadoModal} onHide={() => setShowResultadoModal(false)} data={resultadoQuiz} navigate={navigate} />

      <style>{`
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.1)!important;
          background-color: #e3f2fd !important;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

const TableResponsive = ({ vocabulario }) => (
  <div className="py-2">
    {vocabulario.length > 0 ? (
      vocabulario.map((v, i) => (
        <div key={i} className="d-flex justify-content-between align-items-center py-3 border-bottom">
          <div style={{ flex: 1 }}>
            <span className="fw-bold text-primary fs-5">{v.palabraIngles}</span>
            <div className="text-muted small italic">{v.pronunciacion}</div>
          </div>
          <div className="ps-2" style={{ flex: 1, textAlign: 'right' }}>
            <span className="text-success fw-bold fs-5">{v.palabraEspanol}</span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-muted p-4">No hay vocabulario disponible.</p>
    )}
  </div>
);

const ResultadoModal = ({ show, onHide, data, navigate }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Body className="text-center p-4 p-md-5 rounded-4 shadow-lg">
      <div className="mb-4 display-1">{data.puntaje >= 70 ? "🎉" : "💪"}</div>
      <h2 className="fw-bold mb-2">¡Puntaje: {data.puntaje?.toFixed(1) || 0}%!</h2>
      <p className="text-muted mb-4 fs-5">
        Acertaste {data.correctas} de {data.totalPreguntas} preguntas.
      </p>
      <div className="d-grid gap-2 mt-4">
        <Button variant="primary" size="lg" className="rounded-pill py-2 shadow-sm" onClick={onHide}>Seguir practicando</Button>
        <Button variant="outline-info" size="lg" className="rounded-pill py-2" onClick={() => navigate("/historial-quizes")}>Ver mi historial</Button>
      </div>
    </Modal.Body>
  </Modal>
);

export default Modulos;