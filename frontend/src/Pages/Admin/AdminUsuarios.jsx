import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import clienteAxios from "../../Api/axiosConfig";
import { useAuth } from "../../Context/AuthContext";
import {
  Container,
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import {
  FaCog,
  FaUserCog,
  FaUser,
  FaTrashAlt,
  FaPencilAlt,
  FaExclamationTriangle,
  FaSave,
  FaUserPlus,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const AdminPanel = () => {
  const { logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Estados para el Modal de creación (NUEVO)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "USER",
  });
  const [creating, setCreating] = useState(false);

  // Estados para el Modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
  });
  const [updating, setUpdating] = useState(false);

  // Estados para el Modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const userMenu = [
    { name: "Gestionar categorias", path: "/admin", Icon: FaCog },
    { name: "Gestionar usuarios", path: "/usuarios", Icon: FaUserCog },
    { name: "Gestionar Quiz", path: "/Quiz", Icon: FaEdit },
  ];

  // Obtener usuarios del sistema
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await clienteAxios.get("/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios del sistema.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // --- LÓGICA DE CREACIÓN (NUEVO) ---
  const handleOpenCreateModal = () => {
    setCreateFormData({ nombre: "", email: "", password: "", rol: "USER" });
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData({ ...createFormData, [name]: value });
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const token = localStorage.getItem("token");

      // Construimos el objeto con la estructura exacta que valida tu backend
      const dataToSend = {
        nombre: createFormData.nombre,
        apellido: createFormData.apellido, // <- Agregado para cumplir la validación de Spring Boot
        email: createFormData.email,
        rol: createFormData.rol,
        password: createFormData.password,
      };

      const response = await clienteAxios.post("/auth/registro", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar la lista en pantalla de forma reactiva
      if (response.data && (response.data.usuario || response.data.id)) {
        const nuevoUsuario = response.data.usuario || response.data;
        setUsuarios([...usuarios, nuevoUsuario]);
      } else {
        await fetchUsuarios();
      }

      handleCloseCreateModal();
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      const mensajeError =
        err.response?.data?.mensaje ||
        err.response?.data ||
        "No se pudo registrar el usuario.";
      alert(mensajeError);
    } finally {
      setCreating(false);
    }
  };

  // --- LÓGICA DE EDICIÓN ---
  const handleOpenEditModal = (usuario) => {
    setUsuarioAEditar(usuario);
    setEditFormData({
      nombre: usuario.nombre || "",
      email: usuario.email || usuario.username || "",
      rol: usuario.rol || usuario.role || "USER",
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setUsuarioAEditar(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleActualizarUsuario = async (e) => {
    e.preventDefault();
    if (!usuarioAEditar) return;
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      const idUsuario = usuarioAEditar.id || usuarioAEditar._id;

      await clienteAxios.put(`/admin/usuarios/${idUsuario}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(
        usuarios.map((u) =>
          (u.id || u._id) === idUsuario ? { ...u, ...editFormData } : u,
        ),
      );
      handleCloseEditModal();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert(err.response?.data || "No se pudo actualizar el usuario.");
    } finally {
      setUpdating(false);
    }
  };

  // --- LÓGICA DE ELIMINACIÓN ---
  const handleOpenDeleteModal = (usuario) => {
    setUsuarioAEliminar(usuario);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUsuarioAEliminar(null);
  };

  const handleEliminarUsuario = async () => {
    if (!usuarioAEliminar) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const idUsuario = usuarioAEliminar.id || usuarioAEliminar._id;

      await clienteAxios.delete(`/admin/usuarios/${idUsuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(usuarios.filter((u) => (u.id || u._id) !== idUsuario));
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert(err.response?.data || "No se pudo eliminar al usuario.");
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
          transition: "all 0.3s",
        }}
      >
        <Container fluid className="p-4 p-lg-5">
          {/* Header Section */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3 animate__animated animate__fadeIn">
            <div>
              <h1 className="fw-bold mb-1" style={{ color: "#01579B" }}>
                <FaUserCog className="me-3" />
                Gestionar Usuarios
              </h1>
              <p className="text-muted mb-0">
                Administra las cuentas de los estudiantes registrados en la
                plataforma.
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Badge bg="primary" pill className="px-3 py-2 fs-6 shadow-sm">
                {usuarios.length} Registrados
              </Badge>
              {/* Botón para Abrir Modal de Creación */}
              <Button
                variant="success"
                className="rounded-pill px-4 shadow-sm d-inline-flex align-items-center fw-semibold"
                onClick={handleOpenCreateModal}
                style={{ background: "#2e7d32", border: "none" }}
              >
                <FaUserPlus className="me-2" /> Nuevo Usuario
              </Button>
            </div>
          </div>

          {/* Área del Contenido Principal */}
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="grow" variant="primary" size="lg" />
              <p className="mt-3 text-primary-emphasis fw-medium">
                Cargando lista de usuarios...
              </p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="rounded-4 border-0 shadow-sm">
              {error}
            </Alert>
          ) : (
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeIn">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table
                    hover
                    align="middle"
                    className="mb-0 custom-admin-table"
                  >
                    <thead
                      style={{ backgroundColor: "#01579B", color: "white" }}
                    >
                      <tr>
                        <th className="py-3 ps-4">ID</th>
                        <th className="py-3">Nombre</th>
                        <th className="py-3">Email o Nombre de Usuario</th>
                        <th className="py-3">Rol</th>
                        <th className="py-3 pe-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-5 text-muted"
                          >
                            No se encontraron usuarios en la base de datos.
                          </td>
                        </tr>
                      ) : (
                        usuarios.map((usuario) => (
                          <tr key={usuario.id || usuario._id}>
                            <td className="ps-4 text-secondary small fw-mono">
                              {usuario.id || usuario._id}
                            </td>
                            <td className="fw-bold text-dark">
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{
                                    background: "#e1f5fe",
                                    color: "#0288D1",
                                    width: "35px",
                                    height: "35px",
                                  }}
                                >
                                  <FaUser size={16} />
                                </div>
                                {usuario.nombre || "Sin nombre registrado"}
                              </div>
                            </td>
                            <td className="text-muted">
                              {usuario.email || usuario.username}
                            </td>
                            <td>
                              <Badge
                                bg={
                                  usuario.rol === "ADMIN" ||
                                  usuario.role === "ADMIN"
                                    ? "danger"
                                    : "info"
                                }
                                className="text-uppercase px-2.5 py-1.5"
                              >
                                {usuario.rol || usuario.role || "USER"}
                              </Badge>
                            </td>
                            <td className="pe-4 text-center">
                              <div className="d-flex justify-content-center gap-2">
                                {/* 🔥 NUEVO BOTÓN: REDIRECCIÓN AL CONTROLADOR DE MÉTRICAS */}
                                <button
                                  className="btn btn-sm btn-outline-info rounded-pill px-3 d-inline-flex align-items-center fw-semibold text-dark"
                                  onClick={() =>
                                    navigate(`/usuarios/${usuario.id || usuario._id}`,)
                                  }
                                >
                                  Ver Progreso
                                </button>

                                <button
                                  className="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center"
                                  onClick={() => handleOpenEditModal(usuario)}
                                >
                                  <FaPencilAlt className="me-1.5" /> Editar
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger rounded-pill px-3 d-inline-flex align-items-center"
                                  onClick={() => handleOpenDeleteModal(usuario)}
                                >
                                  <FaTrashAlt className="me-1.5" /> Eliminar
                                </button>
                              </div>
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

      {/* MODAL DE CREACIÓN (NUEVO) */}
      <Modal
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        centered
        backdrop="static"
        className="rounded-4"
      >
        <Form onSubmit={handleCrearUsuario}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title
              className="fw-bold text-success d-flex align-items-center"
              style={{ color: "#2e7d32" }}
            >
              <FaUserPlus className="me-2 fs-5" />
              Registrar Nuevo Usuario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={createFormData.nombre}
                onChange={handleCreateInputChange}
                placeholder="Ej. Juan"
                required
                className="rounded-3"
              />
            </Form.Group>

            {/* === NUEVO CAMPO: APELLIDO === */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                Apellido
              </Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={createFormData.apellido}
                onChange={handleCreateInputChange}
                placeholder="Ej. Pérez"
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={createFormData.email}
                onChange={handleCreateInputChange}
                placeholder="correo@ejemplo.com"
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                Contraseña de Acceso
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={createFormData.password}
                onChange={handleCreateInputChange}
                placeholder="Mínimo 6 caracteres"
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold text-dark">
                Asignar Rol
              </Form.Label>
              <Form.Select
                name="rol"
                value={createFormData.rol}
                onChange={handleCreateInputChange}
                className="rounded-3"
              >
                <option value="USER">USER (Estudiante)</option>
                <option value="ADMIN">ADMIN (Administrador)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button
              variant="light"
              onClick={handleCloseCreateModal}
              disabled={creating}
              className="rounded-pill px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={creating}
              className="rounded-pill px-4"
              style={{ backgroundColor: "#2e7d32", border: "none" }}
            >
              {creating ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Registrando...
                </>
              ) : (
                <>
                  <FaSave className="me-1.5" /> Registrar Cuenta
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL DE EDICIÓN */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        centered
        backdrop="static"
        className="rounded-4"
      >
        <Form onSubmit={handleActualizarUsuario}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title
              className="fw-bold text-primary d-flex align-items-center"
              style={{ color: "#01579B" }}
            >
              <FaPencilAlt className="me-2 fs-5" />
              Modificar Datos del Usuario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                Nombre Completo
              </Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={editFormData.nombre}
                onChange={handleEditInputChange}
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                Correo Electrónico
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold text-dark">
                Rol del Sistema
              </Form.Label>
              <Form.Select
                name="rol"
                value={editFormData.rol}
                onChange={handleEditInputChange}
                className="rounded-3"
              >
                <option value="USER">USER (Estudiante)</option>
                <option value="ADMIN">ADMIN (Administrador)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button
              variant="light"
              onClick={handleCloseEditModal}
              disabled={updating}
              className="rounded-pill px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={updating}
              className="rounded-pill px-4"
              style={{ backgroundColor: "#01579B", border: "none" }}
            >
              {updating ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="me-1.5" /> Guardar Cambios
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL DE ELIMINACIÓN */}
      <Modal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        centered
        backdrop="static"
        className="rounded-4"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-danger d-flex align-items-center">
            <FaExclamationTriangle className="me-2 fs-4" />
            ¿Advertencia de seguridad?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-3">
          <p className="mb-2 fs-5 text-dark fw-semibold">
            ¿Estás seguro de que deseas eliminar este usuario?
          </p>
          <p className="text-muted small mb-0">
            Esta acción es irreversible. Se eliminará de forma permanente la
            cuenta de{" "}
            <strong className="text-dark">
              {usuarioAEliminar?.nombre || usuarioAEliminar?.username}
            </strong>{" "}
            ({usuarioAEliminar?.email || "Sin correo electrónico"}).
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="light"
            onClick={handleCloseDeleteModal}
            disabled={deleting}
            className="rounded-pill px-4"
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleEliminarUsuario}
            disabled={deleting}
            className="rounded-pill px-4"
          >
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Eliminando...
              </>
            ) : (
              "Sí, eliminar de verdad"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
