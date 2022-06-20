const swaggerJsDoc = require('swagger-jsdoc');
// SWAGGER CONFIGARATION
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "To - Let API",
            description: "To-Let OpenAPI2 Specification",
            termsOfService: "https://bdassistant.com/terms",
            version: "1.0.0"
        },
        contact: {
            name: "API Support",
            url: "#",
            email: "contact@abid.app"
        },
        servers: [
            {
              "url": "http://locahost:3000",
              "description": "Development server"
            },
            {
              "url": "https://bdassistant.herokuapp.com",
              "description": "Production server"
            }
          ],
        securityDefinitions: {
          APIKeyHeader: {
            type: 'apiKey',
            in: 'header',
            name: 'token'
          },
        }
    },

    apis: ['routes/*.js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;