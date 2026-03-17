import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';
import { validateGenerateData } from '../middlewares/validateRequest.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mocks
 *   description: >
 *     Generación e inserción de datos de prueba.
 *     Los endpoints de "mocking" generan datos en memoria sin persistir.
 *     Los endpoints de "generateData" persisten en base de datos.
 */

/**
 * @swagger
 * /api/mocks/mockingpets:
 *   get:
 *     summary: Genera mascotas de prueba en memoria
 *     description: >
 *       Genera y retorna 100 mascotas con datos aleatorios (nombre, especie, owner null).
 *       Los datos NO se persisten en la base de datos.
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Mascotas de prueba generadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   description: Array de 100 mascotas generadas en memoria
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/mockingpets', mocksController.getMockingPets);

/**
 * @swagger
 * /api/mocks/mockingusers:
 *   get:
 *     summary: Genera usuarios de prueba en memoria
 *     description: >
 *       Genera y retorna 50 usuarios con datos aleatorios (nombre, email, edad, rol).
 *       Las contraseñas son hasheadas con bcrypt usando el valor por defecto "coder123".
 *       Los datos NO se persisten en la base de datos.
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Usuarios de prueba generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   description: Array de 50 usuarios generados en memoria
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/mockingusers', mocksController.getMockingUsers);

/**
 * @swagger
 * /api/mocks/generateData:
 *   post:
 *     summary: Genera e inserta datos de prueba en la base de datos
 *     description: >
 *       Genera la cantidad indicada de usuarios y mascotas con datos aleatorios
 *       y los persiste en la base de datos. Si un usuario generado tiene un email
 *       duplicado, se omite sin interrumpir el proceso. Útil para poblar
 *       entornos de desarrollo o testing.
 *     tags: [Mocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateDataInput'
 *     responses:
 *       201:
 *         description: Datos generados e insertados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Datos generados e insertados correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/GenerateDataResult'
 *       400:
 *         description: Parámetros inválidos en el body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               camposFaltantes:
 *                 summary: Campos faltantes
 *                 value:
 *                   status: error
 *                   message: Todos los parámetros son obligatorios
 *               tipoInvalido:
 *                 summary: Tipo de dato incorrecto
 *                 value:
 *                   status: error
 *                   message: Los parámetros "users" y "pets" deben ser números
 *               valorNegativo:
 *                 summary: Valor negativo
 *                 value:
 *                   status: error
 *                   message: Los parámetros deben ser mayores o iguales a 0
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/generateData', validateGenerateData, mocksController.generateData);

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Obtiene todos los usuarios desde la base de datos
 *     description: >
 *       Retorna el listado completo de usuarios persistidos en la base de datos.
 *       A diferencia de /mockingusers, este endpoint consulta datos reales almacenados.
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   description: Array de usuarios almacenados en la base de datos
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', mocksController.getUsers);

/**
 * @swagger
 * /api/mocks/pets:
 *   get:
 *     summary: Obtiene todas las mascotas desde la base de datos
 *     description: >
 *       Retorna el listado completo de mascotas persistidas en la base de datos.
 *       A diferencia de /mockingpets, este endpoint consulta datos reales almacenados.
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   description: Array de mascotas almacenadas en la base de datos
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/pets', mocksController.getPets);

export default router;
