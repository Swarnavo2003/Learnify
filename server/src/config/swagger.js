import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  defination: {
    openapi: "3.0.0",
    info: {
      title: "Learnify API",
      version: "1.0.0",
      description: "API documentation for Learnify",
    },
  },
  apis: ["./src/routes/*.js"],
};
