const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Node Reusables',
    version: '3.0.0',
    description: 'Reusables snippests and codes for Node JS App',
  },
  host: `${process.env.HOST}:${process.env.PORT}`,
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./utils/swagger/docs/**/*.yaml'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
