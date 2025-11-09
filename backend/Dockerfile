# Etapa de Build
FROM maven:3.9.11-eclipse-temurin-21 AS build

COPY src /app/src
COPY pom.xml /app

WORKDIR /app
RUN mvn clean install -DskipTests

# Etapa de Execução
FROM eclipse-temurin:21-jre-alpine

COPY --from=build /app/target/backend-1.1.0.jar /app/app.jar

WORKDIR /app

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
