package com.example.PAI.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.PAI.modelo.Pregunta;

@Repository
public interface PreguntaRepository extends MongoRepository<Pregunta, String> {

}
