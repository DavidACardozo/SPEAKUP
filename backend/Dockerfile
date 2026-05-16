# ETAPA 1: Compilación (Build)
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# Copiamos el pom y el código fuente
COPY pom.xml .
COPY src ./src
# Ejecutamos el empaquetado dentro de Docker
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Run) 
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
# Copiamos el .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]