FROM maven:3.6-openjdk-17 as build
WORKDIR /app
COPY . .
RUN mvn package

FROM openjdk:17
WORKDIR /app
COPY --from=build /app/target/*.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
