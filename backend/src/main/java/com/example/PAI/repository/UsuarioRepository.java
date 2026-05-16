package com.example.PAI.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.PAI.modelo.Usuario;

@Repository
//cambiamos el extende de jpaarepository a mongo repository y el id de long a string
public interface UsuarioRepository extends MongoRepository<Usuario, String> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByUsername(String username);

}
