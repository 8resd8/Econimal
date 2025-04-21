#FROM bellsoft/liberica-openjdk-alpine:17 AS build
#ARG JAR_FILE_PATH=build/libs/BackEnd-0.0.1-SNAPSHOT.jar
#COPY ${JAR_FILE_PATH} econimal.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "econimal.jar"]

FROM bellsoft/leberica-openjdk-alpine:17 AS builder
ARG JAR_FILE=build/libs/BackEnd-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} econimal.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "econimal.jar"]