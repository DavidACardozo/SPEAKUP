import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import clienteAxios from "../../Api/axiosConfig";
import { useAuth } from "../../Context/AuthContext";
import { Container, Card, Table, Spinner, Alert, Badge, Modal, Button } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import { FaCog, FaUserCog, FaEdit, FaTrashAlt, FaExclamationTriangle, FaListOl } from "react-icons/fa";

const GestionDeQuizes = () => {
  const { logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el Modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizAEliminar, setQuizAEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Configuración del Sidebar
  const userMenu = [
    { name: "Gestionar categorias", path: "/admin", Icon: FaCog },
    { name: "Gestionar usuarios", path: "/usuarios", Icon: FaUserCog },
    { name: "Gestionar Quiz", path: "/Quiz", Icon: FaEdit },
  ];

  // 🔄 OBTENER LOS QUIZZES DESDE EL BACKEND (@GetMapping)
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Realiza la petición al endpoint mapeado en tu AdminQuizController
      const response = await clienteAxios.get("/admin/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setQuizzes(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener los quizzes:", err);
      setError("No se pudieron cargar los cuestionarios del sistema.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleOpenDeleteModal = (quiz) => {
    setQuizAEliminar(quiz);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setQuizAEliminar(null);
  };

  // 🗑️ ELIMINAR UN QUIZ EN EL BACKEND (@DeleteMapping("/{id}"))
  const handleEliminarQuiz = async () => {
    if (!quizAEliminar) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const idQuiz = quizAEliminar.id || quizAEliminar._id;

      await clienteAxios.delete(`/admin/quizzes/${idQuiz}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remueve de forma reactiva el quiz eliminado del estado local
      setQuizzes(quizzes.filter((q) => (q.id || q._id) !== idQuiz));
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error al eliminar el quiz:", err);
      const msg = err.response?.data || "No se pudo eliminar el cuestionario de la base de datos.";
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        menuItems={userMenu}
        brand={{ name: "SpeakUp! W&B", logo: "🦉" }}
        onLogout={logout}
      />
      
      <div
        className="container-fluid"
        style={{ 
          background: "#f0f7ff", 
          minHeight: "100vh",
          paddingLeft: "280px",
          transition: "all 0.3s"
        }}
      >
        <Container fluid className="p-4 p-lg-5">
          {/* Cabecera del panel */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
            <div>
              <h1 className="fw-bold mb-1" style={{ color: "#01579B" }}>
                <FaEdit className="me-3" />
                Gestionar Quizzes
              </h1>
              <p className="text-muted mb-0">
                Monitorea, revisa y remueve las evaluaciones dinámicas asignadas a los módulos.
              </p>
            </div>
            <div>
              <Badge bg="primary" pill className="px-3 py-2 fs-6 shadow-sm">
                {quizzes.length} Quizzes Activos
              </Badge>
            </div>
          </div>

          {/* Renderizado Condicional de la Lista */}
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="grow" variant="primary" size="lg" />
              <p className="mt-3 text-primary-emphasis fw-medium">Cargando cuestionarios activos...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
              {error}
            </Alert>
          ) : (
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover align="middle" className="mb-0">
                    <thead style={{ backgroundColor: "#01579B", color: "white" }}>
                      <tr>
                        <th className="py-3 ps-4">ID del Quiz</th>
                        <th className="py-3">Título / Nombre</th>
                        <th className="py-3">Descripción</th>
                        <th className="py-3 text-center">Nro. Preguntas</th>
                        <th className="py-3 pe-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
                            No se encontraron cuestionarios registrados en MongoDB.
                          </td>
                        </tr>
                      ) : (
                        quizzes.map((quiz) => (
                          <tr key={quiz.id || quiz._id}>
                            <td className="ps-4 text-secondary small fw-mono">
                              {quiz.id || quiz._id}
                            </td>
                            <td className="fw-bold text-dark">
                              {quiz.titulo || quiz.nombre || "Evaluación general"}
                            </td>
                            <td className="text-muted text-truncate" style={{ maxWidth: "300px" }}>
                              {quiz.descripcion || "Sin descripción proporcionada"}
                            </td>
                            <td className="text-center">
                              <Badge bg="secondary" className="px-2.5 py-1.5 rounded-pill">
                                <FaListOl className="me-1" />
                                {quiz.preguntas?.length || quiz.cantidadPreguntas || 0}
                              </Badge>
                            </td>
                            <td className="pe-4 text-center">
                              <button 
                                className="btn btn-sm btn-outline-danger rounded-pill px-3 d-inline-flex align-items-center"
                                onClick={() => handleOpenDeleteModal(quiz)}
                              >
                                <FaTrashAlt className="me-1.5" /> Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered backdrop="static" className="rounded-4">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-danger d-flex align-items-center">
            <FaExclamationTriangle className="me-2 fs-4" />
            ¿Deseas eliminar este Quiz?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <p className="mb-2 fs-5 text-dark fw-semibold">
            Esta acción es irreversible.
          </p>
          <p className="text-muted small mb-0">
            Se borrará permanentemente el quiz{" "}
            <strong className="text-dark">
              "{quizAEliminar?.titulo || quizAEliminar?.nombre || "Cuestionario seleccionado"}"
            </strong> de la base de datos de MongoDB. Esto afectará a las categorías asociadas.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={handleCloseDeleteModal} disabled={deleting} className="rounded-pill px-4">
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarQuiz} disabled={deleting} className="rounded-pill px-4">
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Borrando...
              </>
            ) : (
              "Sí, borrar quiz"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionDeQuizes;