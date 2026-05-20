package com.example.PAI.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.PAI.modelo.Categoria;
import com.example.PAI.modelo.Quiz;
import com.example.PAI.modelo.Usuario;
import com.example.PAI.repository.CategoriaRepository;
import com.example.PAI.repository.QuizRepository;
import com.example.PAI.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final CategoriaRepository categoriaRepository;
    private final QuizRepository quizRepository;
    private final UsuarioRepository usuarioRepository;

    // =========================
    // 📌 CATEGORÍAS
    // =========================

    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    public Categoria actualizarCategoria(String id, String nombre, String descripcion) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        categoria.setNombre(nombre);
        categoria.setDescripcion(descripcion);

        return categoriaRepository.save(categoria);
    }

    public String eliminarCategoria(String id) {

    Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

    // =====================================================
    // 🔥 ELIMINAR TODOS LOS QUIZZES DE LA CATEGORÍA
    // =====================================================
    if (categoria.getQuizIds() != null) {

        for (String quizId : categoria.getQuizIds()) {
            quizRepository.deleteById(quizId);
        }
    }

    // eliminar categoría
    categoriaRepository.deleteById(id);

    return "Categoría y quizzes eliminados";
}

    // =========================
    // 📌 QUIZZES
    // =========================

    public List<Quiz> listarQuizzes() {
        return quizRepository.findAll();
    }

    public String eliminarQuiz(String id) {
        quizRepository.deleteById(id);
        return "Quiz eliminado";
    }

   // =========================
// 📌 USUARIOS
// =========================

public List<Usuario> listarUsuarios() {
    return usuarioRepository.findAll();
}

public String eliminarUsuario(String id) {
    usuarioRepository.deleteById(id);
    return "Usuario eliminado";
}

// 🔥 NUEVO → ACTUALIZAR USUARIO
public String actualizarUsuario(
        String id,
        String nombre,
        String email,
        String rol) {

    Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // actualizar nombre
    if (nombre != null && !nombre.isEmpty()) {
        usuario.setNombre(nombre);
    }

    // actualizar email
    if (email != null && !email.isEmpty()) {
        usuario.setEmail(email);
    }

    // actualizar rol
    if (rol != null && !rol.isEmpty()) {
        usuario.setRol(rol);
    }

    usuarioRepository.save(usuario);

    return "Usuario actualizado correctamente";
}
}