FROM bellsoft/liberica-openjdk-alpine:17 AS build
ARG JAR_FILE_PATH=build/libs/BackEnd-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} econimal.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "econimal.jar"]
