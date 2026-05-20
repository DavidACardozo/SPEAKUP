package com.example.PAI.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // 🔥 DESACTIVAR CSRF (JWT)
            .csrf(AbstractHttpConfigurer::disable)

            // 🔥 CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 🔥 SIN SESIÓN (JWT)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authenticationProvider(authenticationProvider)

            .authorizeHttpRequests(auth -> auth

                // Preflight CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // =========================
                // 🔓 RUTAS PÚBLICAS
                // =========================
                .requestMatchers(
                        "/api/auth/**",
                        "/api/usuarios/login",
                        "/api/usuarios/registrar"
                ).permitAll()

                // =========================
                // 🔥 SOLO ADMIN
                // =========================
                .requestMatchers(
                        "/api/admin/**",
                        "/api/categorias/**"
                ).hasRole("ADMIN")

                // =========================
                // 🔥 QUIZ (USER + ADMIN)
                // =========================
                .requestMatchers("/api/quiz/**")
                .hasAnyRole("USER", "ADMIN")

                .requestMatchers("/api/quizzes/responder/**")
                .hasAnyRole("USER", "ADMIN")

                // =========================
                // 🔐 USUARIOS AUTENTICADOS
                // =========================
                .requestMatchers("/api/usuarios/**")
                .authenticated()

                // =========================
                // 🔒 RESTO
                // =========================
                .anyRequest()
                .authenticated()
            )

            // 🔥 FILTRO JWT
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:3001",
                "https://*.up.railway.app"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Cache-Control",
                "X-Requested-With",
                "Accept",
                "Origin"
        ));

        config.setExposedHeaders(List.of("Authorization"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
