package com.example.PAI.services;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.PAI.config.JwtService;
import com.example.PAI.dto.request.LoginRequestDTO;
import com.example.PAI.dto.request.RegistroRequestDTO;
import com.example.PAI.dto.response.HistorialQuizDTO;
import com.example.PAI.dto.response.LoginResponseDTO;
import com.example.PAI.dto.response.RegistroResponseDTO; 
import com.example.PAI.dto.response.UsuarioResponseDTO;
import com.example.PAI.modelo.Categoria; 
import com.example.PAI.modelo.Usuario;
import com.example.PAI.modelo.UsuarioQuiz;
import com.example.PAI.repository.CategoriaRepository;
import com.example.PAI.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioCategoriaService usuarioCategoriaService;
    private final CategoriaRepository categoriaRepository;
    private final PasswordEncoder passwordEncoder; 
    private final JwtService jwtService;

    private static final Pattern SOLO_LETRAS = Pattern.compile("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$");
    private static final Pattern EMAIL_GMAIL = Pattern.compile("^[\\w.+\\-]+@gmail\\.com$");

    // 1. REGISTRAR USUARIO
    public RegistroResponseDTO registrarUsuario(RegistroRequestDTO request) {
        String nombre = request.getNombre();
        String apellido = request.getApellido();
        String email = request.getEmail();
        String password = request.getPassword();
        
        if (nombre == null || nombre.isBlank()) throw new RuntimeException("El nombre no puede estar vacío");
        if (apellido == null || apellido.isBlank()) throw new RuntimeException("El apellido no puede estar vacío");
        if (email == null || email.isBlank()) throw new RuntimeException("El email no puede estar vacío");

        if (!SOLO_LETRAS.matcher(nombre).matches()) throw new RuntimeException("El nombre solo puede contener letras");
        if (!SOLO_LETRAS.matcher(apellido).matches()) throw new RuntimeException("El apellido solo puede contener letras");
        if (!EMAIL_GMAIL.matcher(email).matches()) throw new RuntimeException("El correo debe ser de tipo @gmail.com");

        if (usuarioRepository.findByEmail(email).isPresent()) throw new RuntimeException("El correo ya está registrado");

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);

        String username = generarUsername(nombre, apellido);
        usuario.setUsername(username);
        usuario.setRol("USER"); 
        
        usuario.setPassword(passwordEncoder.encode(password));

        usuarioRepository.save(usuario);

        Categoria categoriaInicial = categoriaRepository.findByNivel(1).orElseGet(() -> {
            System.out.println("LOG: Categoria nivel 1 no encontrada. Creandola automaticamente...");
            Categoria nueva = new Categoria();
            nueva.setNivel(1);
            nueva.setNombre("Nivel Inicial");
            nueva.setDescripcion("Generada automaticamente para evitar error");
            return categoriaRepository.save(nueva);
        });

        usuarioCategoriaService.asignarCategoriaInicial(usuario, categoriaInicial);

        return new RegistroResponseDTO("Usuario registrado con éxito.", username, password);
    }

    // 2. INICIAR SESIÓN (JWT)
    public LoginResponseDTO iniciarSesion(LoginRequestDTO loginRequest) {
        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) { 
            return new LoginResponseDTO("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(usuario);

        UsuarioResponseDTO usuarioDTO = new UsuarioResponseDTO();
        usuarioDTO.setId(usuario.getId()); 
        usuarioDTO.setNombre(usuario.getNombre());
        usuarioDTO.setApellido(usuario.getApellido());
        usuarioDTO.setEmail(usuario.getEmail());
        usuarioDTO.setUsername(usuario.getUsername());
        usuarioDTO.setFechaRegistro(usuario.getFechaRegistro());

        return new LoginResponseDTO(token, usuario.getRol().toLowerCase(), usuarioDTO, "Login exitoso");
    }

    // 3. ACTUALIZAR PERFIL
    public String actualizarPerfil(String usuarioId, String nuevoEmail, String nuevaPassword, String passwordActual) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (nuevoEmail != null && !nuevoEmail.isBlank()) {
            if (!EMAIL_GMAIL.matcher(nuevoEmail).matches()) throw new RuntimeException("El correo debe ser de tipo @gmail.com");
            if (usuarioRepository.findByEmail(nuevoEmail).isPresent() && !usuario.getEmail().equals(nuevoEmail))
                throw new RuntimeException("El correo ya está registrado");
            usuario.setEmail(nuevoEmail);
        }

        if (nuevaPassword != null && !nuevaPassword.isBlank()) {
            if (passwordActual == null || passwordActual.isBlank()) throw new RuntimeException("Debe ingresar la contraseña actual");
            if (!passwordEncoder.matches(passwordActual, usuario.getPassword())) throw new RuntimeException("La contraseña actual es incorrecta");
            usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        }

        usuarioRepository.save(usuario);
        return "Perfil actualizado correctamente";
    }

            // 4. VER HISTORIAL POR CATEGORÍA (VERSIÓN DEFINITIVA - SIN ERRORES)
    public List<HistorialQuizDTO> verHistorialPorCategoria(String usuarioId, String categoriaId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        List<HistorialQuizDTO> resultados = new java.util.ArrayList<>();
        
        for (UsuarioQuiz intento : usuario.getIntentos()) {
            if (intento.getQuizId() == null) continue;
            
            // Verificar si el quiz pertenece a la categoría
            java.util.Optional<Categoria> categoriaOpt = categoriaRepository.findByQuizId(intento.getQuizId());
            if (categoriaOpt.isEmpty()) continue;
            
            Categoria categoria = categoriaOpt.get();
            if (!categoria.getId().equals(categoriaId)) continue;
            
            String nombreCategoria = categoria.getNombre();
            String tituloQuiz = intento.getQuizTitulo();
            
            // Contar intentos del usuario para este quiz
            long totalIntentos = 0;
            for (UsuarioQuiz i : usuario.getIntentos()) {
                if (i.getQuizId() != null && i.getQuizId().equals(intento.getQuizId())) {
                    totalIntentos++;
                }
            }
            
            resultados.add(new HistorialQuizDTO(
                    intento.getFechaRealizacion(),
                    intento.getPuntaje(),
                    (int) totalIntentos,
                    nombreCategoria,
                    tituloQuiz));
        }
        
        return resultados;
    }

    private String generarUsername(String nombre, String apellido) {
        String base = (nombre.charAt(0) + apellido).toLowerCase();
        String username = base;
        int contador = 1;
        while (usuarioRepository.findByUsername(username).isPresent()) {
            username = base + contador;
            contador++;
        }
        return username;
    }
}
