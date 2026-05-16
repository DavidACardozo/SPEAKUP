package com.example.PAI.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .authorizeHttpRequests(authorize -> authorize
                // 1. RUTAS PÚBLICAS
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/usuarios/login", "/api/usuarios/registrar").permitAll()
                
                // 2. RUTAS DE ADMINISTRADOR
                .requestMatchers("/api/admin/**").hasAnyAuthority("admin", "ADMIN", "ROLE_admin", "ROLE_ADMIN")
                .requestMatchers("/api/categorias/**").hasAnyAuthority("admin", "ADMIN", "ROLE_admin", "ROLE_ADMIN")                    

                // 3. RUTAS DE QUIZ - CUALQUIER USUARIO AUTENTICADO (NUEVO)
                .requestMatchers("/api/quiz/**").authenticated()

                // 4. RUTAS COMPARTIDAS (Usuario y Admin)
                .requestMatchers("/api/quizzes/responder/**").hasAnyRole("USUARIO", "ADMIN")

                // 5. RUTAS DE USUARIO AUTENTICADO
                .requestMatchers("/api/usuarios/**").authenticated()

                // 6. CUALQUIER OTRA RUTA
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}