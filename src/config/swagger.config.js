import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './env.config.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AdoptMe API',
      version: '1.0.0',
      description: 'API REST para gestión de adopciones de mascotas'
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Servidor local'
      }
    ],
    components: {
      schemas: {
        // ── Mocks (no tienen archivo YAML propio) ─────────────────────────
        GenerateDataInput: {
          type: 'object',
          required: ['users', 'pets'],
          description: 'Cantidad de registros a generar e insertar en la base de datos.',
          properties: {
            users: {
              type: 'number',
              minimum: 0,
              description: 'Cantidad de usuarios a generar e insertar',
              example: 10
            },
            pets: {
              type: 'number',
              minimum: 0,
              description: 'Cantidad de mascotas a generar e insertar',
              example: 20
            }
          }
        },
        GenerateDataResult: {
          type: 'object',
          description: 'Resumen de los registros efectivamente insertados.',
          properties: {
            usersInserted: {
              type: 'number',
              description: 'Usuarios insertados. Puede ser menor al solicitado si había emails duplicados.',
              example: 9
            },
            petsInserted: {
              type: 'number',
              description: 'Mascotas insertadas correctamente.',
              example: 20
            }
          }
        }
      }
    }
  },
  // Lee los archivos YAML de cada entidad y los JSDoc del router de mocks
  apis: [
    './src/docs/**/*.yaml',
    './src/routes/mocks.router.js'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
