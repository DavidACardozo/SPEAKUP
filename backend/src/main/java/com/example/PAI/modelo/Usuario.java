package com.example.PAI.modelo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    private String id;

    private String nombre;
    private String apellido;

    // ADMIN o USER
    private String rol;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String username;

    private String password;

    private Date fechaRegistro = new Date();

    // 🔥 QUIZZES DESBLOQUEADOS
    private List<String> quizzesDesbloqueados = new ArrayList<>();

    // 🔥 HISTORIAL DE QUIZZES
    private List<UsuarioQuiz> intentos = new ArrayList<>();

    // 🔥 CATEGORÍAS DESBLOQUEADAS
    private List<UsuarioCategoria> categorias = new ArrayList<>();

    // =========================
    // 🔐 USERDETAILS
    // =========================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + normalizarRol())
        );
    }

    private String normalizarRol() {
        if (rol == null) {
            return "USER";
        }

        String rolNormalizado = rol.trim().toUpperCase();
        if (rolNormalizado.equals("USUARIO")) {
            return "USER";
        }
        if (rolNormalizado.equals("ADMINISTRADOR")) {
            return "ADMIN";
        }
        return rolNormalizado;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
