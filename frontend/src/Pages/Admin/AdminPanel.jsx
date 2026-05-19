import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import clienteAxios from "../../Api/axiosConfig";
import { useAuth } from "../../Context/AuthContext";
import { Container, Table, Button, Badge, Spinner, Alert, Modal } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import { FaCog, FaUserCog, FaEdit, FaTrashAlt, FaFolderPlus, FaSave, FaTimes, FaListUl } from "react-icons/fa";

const AdminPanel = () => {
  const { logout } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modos de formulario: "LISTAR", "CREAR", "EDITAR"
  const [modo, setModo] = useState("LISTAR");
  const [idCategoriaEditando, setIdCategoriaEditando] = useState(null);

  // Estados del Formulario principal (Crear / Editar)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    nivel: 1,
    vocabularios: [],
  });

  // Estado temporal para las palabras sueltas antes de agregarlas a la lista
  const [vocabTemp, setVocabTemp] = useState({
    palabraIngles: "",
    palabraEspanol: "",
    pronunciacion: "",
  });

  // Estado para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [catAEliminar, setCatAEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Configuración del Sidebar dinámico
  const userMenu = [
    { name: "Gestionar categorias", path: "/admin", Icon: FaCog },
    { name: "Gestionar usuarios", path: "/usuarios", Icon: FaUserCog },
    { name: "Gestionar Quiz", path: "/Quiz", Icon: FaEdit },
  ];

  // 🔄 1. OBTENER CATEGORÍAS (GET)
  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await clienteAxios.get("/admin/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategorias(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al listar categorías:", err);
      setError("No se pudieron cargar las categorías desde el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // ➕ GESTIÓN TEMPORAL DE VOCABULARIO EN MEMORIA
  const agregarVocabulario = () => {
    if (!vocabTemp.palabraIngles || !vocabTemp.palabraEspanol || !vocabTemp.pronunciacion) {
      alert("Por favor, completa todos los campos del vocabulario.");
      return;
    }

    const nuevoVocabulario = { ...vocabTemp };
    setFormData({
      ...formData,
      vocabularios: [...formData.vocabularios, nuevoVocabulario],
    });
    setVocabTemp({ palabraIngles: "", palabraEspanol: "", pronunciacion: "" });
  };

  const eliminarVocabulario = (index) => {
    const nuevaLista = [...formData.vocabularios];
    nuevaLista.splice(index, 1);
    setFormData({ ...formData, vocabularios: nuevaLista });
  };

  // 💾 2. GUARDAR: MANEJA EL SUBMIT TANTO PARA CREAR COMO PARA ACTUALIZAR
  const handleSubmitFormulario = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.descripcion) {
      alert("El nombre y la descripción son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (modo === "CREAR") {
        // Enviar DTO Completo a @PostMapping
        const response = await clienteAxios.post("/admin/categorias", formData, { headers });
        if (response.status === 200 || response.status === 201) {
          alert("¡Categoría y vocabularios creados con éxito!");
        }
      } else if (modo === "EDITAR") {
        // Enviar a @PutMapping("/{id}") pasando el DTO con nombre y descripción
        await clienteAxios.put(`/admin/categorias/${idCategoriaEditando}`, formData, { headers });
        alert("¡Categoría actualizada con éxito!");
      }

      // Reiniciar interfaz y recargar tabla limpia
      setFormData({ nombre: "", descripcion: "", nivel: 1, vocabularios: [] });
      setModo("LISTAR");
      setIdCategoriaEditando(null);
      fetchCategorias();
    } catch (error) {
      console.error("Error en la operación:", error);
      const errorMsg = error.response?.data?.mensaje || error.response?.data || "Error de comunicación.";
      alert(`No se pudo procesar: ${errorMsg}`);
    }
  };

  // ✍️ 3. PREPARAR EDICIÓN (Cargar datos en el formulario)
  const iniciarEdicion = (categoria) => {
    setIdCategoriaEditando(categoria.id || categoria._id);
    setFormData({
      nombre: categoria.nombre || "",
      descripcion: categoria.descripcion || "",
      nivel: categoria.nivel || 1,
      vocabularios: categoria.vocabularios || [], // Muestra sus palabras actuales si existen
    });
    setModo("EDITAR");
  };

  // 🗑️ 4. CONTROL DE ELIMINACIÓN (DELETE)
  const abrirModalEliminar = (categoria) => {
    setCatAEliminar(categoria);
    setShowDeleteModal(true);
  };

  const ejecutarEliminacion = async () => {
    if (!catAEliminar) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const id = catAEliminar.id || catAEliminar._id;

      await clienteAxios.delete(`/admin/categorias/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategorias(categorias.filter((c) => (c.id || c._id) !== id));
      setShowDeleteModal(false);
      setCatAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      alert(err.response?.data || "No se pudo eliminar la categoría.");
    } finally {
      setDeleting(false);
    }
  };

  // 🖥️ RENDERIZADOS CONDICIONALES INTERNOS
  const renderListado = () => (
    <div className="card shadow-sm p-4 border-0 rounded-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="m-0 fw-bold" style={{ color: "#01579B" }}>
          <FaListUl className="me-2" /> Categorías Registradas
        </h4>
        <Button variant="primary" className="shadow-sm px-4 rounded-pill" onClick={() => setModo("CREAR")}>
          <FaFolderPlus className="me-2" /> + Nueva Categoría
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando módulos de aprendizaje...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="border-0 rounded-3 shadow-sm">{error}</Alert>
      ) : (
        <div className="table-responsive">
          <Table hover align="middle" className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 ps-3">Nombre</th>
                <th className="py-3">Descripción</th>
                <th className="py-3 text-center">Nivel</th>
                <th className="py-3 text-center">Vocabularios</th>
                <th className="py-3 text-center pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No hay categorías creadas en MongoDB. ¡Crea la primera!
                  </td>
                </tr>
              ) : (
                categorias.map((cat) => (
                  <tr key={cat.id || cat._id}>
                    <td className="fw-bold text-dark ps-3">{cat.nombre}</td>
                    <td className="text-muted text-truncate" style={{ maxWidth: "280px" }}>{cat.descripcion}</td>
                    <td className="text-center">
                      <Badge bg="info" className="text-dark">Nivel {cat.nivel || 1}</Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg="secondary" pill className="px-2.5 py-1.5">
                        {cat.vocabularios?.length || 0} palabras
                      </Badge>
                    </td>
                    <td className="text-center pe-3">
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="outline-warning" size="sm" className="rounded-circle p-2 border-0" onClick={() => iniciarEdicion(cat)}>
                          <FaEdit size={16} />
                        </Button>
                        <Button variant="outline-danger" size="sm" className="rounded-circle p-2 border-0" onClick={() => abrirModalEliminar(cat)}>
                          <FaTrashAlt size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );

  const renderFormulario = () => (
    <div className="card shadow-sm p-4 border-0 rounded-4">
      <div className="border-bottom pb-3 mb-4">
        <h4 className="fw-bold m-0 text-primary-emphasis">
          {modo === "CREAR" ? "✨ Crear Categoría Completa" : "📝 Modificar Categoría"}
        </h4>
        <small className="text-muted">
          {modo === "CREAR" 
            ? "Agrega un nuevo módulo junto con sus palabras iniciales de vocabulario." 
            : "Estás modificando la metadata principal del módulo."}
        </small>
      </div>

      <form onSubmit={handleSubmitFormulario}>
        <div className="bg-light p-3 rounded-3 mb-4 border-0">
          <h6 className="fw-bold mb-3 text-secondary">Información Base del Módulo</h6>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre de la Categoría</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Presentaciones Familiares"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Descripción</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Escribe qué competencias adquirirá el estudiante..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
            />
          </div>
        </div>

        {/* El subformulario de agregar vocabulario solo es visible en modo CREAR para simplificar la interfaz */}
        {modo === "CREAR" && (
          <div className="border p-3 rounded-3 mb-4">
            <h6 className="fw-bold mb-3 text-secondary">Agregar Vocabulario Asociado</h6>
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Palabra en Inglés (Ej: Mother)"
                  value={vocabTemp.palabraIngles}
                  onChange={(e) => setVocabTemp({ ...vocabTemp, palabraIngles: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Traducción (Ej: Madre)"
                  value={vocabTemp.palabraEspanol}
                  onChange={(e) => setVocabTemp({ ...vocabTemp, palabraEspanol: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pronunciación (/máder/)"
                  value={vocabTemp.pronunciacion}
                  onChange={(e) => setVocabTemp({ ...vocabTemp, pronunciacion: e.target.value })}
                />
              </div>
              <div className="col-md-1">
                <Button variant="primary" className="w-100 fw-bold" onClick={agregarVocabulario}>+</Button>
              </div>
            </div>

            {formData.vocabularios.length > 0 && (
              <div className="mt-4">
                <p className="fw-bold text-dark mb-2">Palabras a guardar ({formData.vocabularios.length}):</p>
                <ul className="list-group shadow-sm max-vh-25 overflow-auto">
                  {formData.vocabularios.map((v, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center bg-white border-light">
                      <span>
                        <strong className="text-primary">{v.palabraIngles}</strong>
                        <span className="text-muted mx-2">➔</span>
                        {v.palabraEspanol} <small className="text-secondary italic ms-1">({v.pronunciacion})</small>
                      </span>
                      <Button variant="link" className="text-danger p-0 border-0 text-decoration-none small" onClick={() => eliminarVocabulario(index)}>
                        Quitar
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="d-flex gap-2 justify-content-end border-top pt-3">
          <Button variant="outline-secondary" className="px-4 rounded-pill" type="button" onClick={() => {
            setModo("LISTAR");
            setFormData({ nombre: "", descripcion: "", nivel: 1, vocabularios: [] });
          }}>
            <FaTimes className="me-1" /> Cancelar
          </Button>
          <Button variant="success" className="px-4 rounded-pill" type="submit">
            <FaSave className="me-1" /> Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={userMenu} brand={{ name: "SpeakUp! W&B", logo: "🦉" }} onLogout={logout} />

      <div
        className="container-fluid"
        style={{
          background: "#f0f7ff",
          minHeight: "100vh",
          paddingLeft: "280px",
          transition: "all 0.3s",
        }}
      >
        <Container fluid className="p-4 p-lg-5">
          {modo === "LISTAR" ? renderListado() : renderFormulario()}
        </Container>
      </div>

      {/* MODAL DE CONFIRMACIÓN PARA BORRAR CATEGORÍA + QUIZ EN CASCADA */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-danger">⚠️ ¿Eliminar este módulo?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <p className="mb-1 text-dark fw-semibold">Esta acción limpiará datos dependientes.</p>
          <p className="text-muted small">
            Eliminarás la categoría <strong className="text-dark">"{catAEliminar?.nombre}"</strong>. Tu backend removerá automáticamente este registro de MongoDB junto con el Quiz acoplado a ella de manera definitiva.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" className="rounded-pill px-3.5" disabled={deleting} onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" className="rounded-pill px-3.5" disabled={deleting} onClick={ejecutarEliminacion}>
            {deleting ? "Removiendo..." : "Sí, eliminar todo"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;