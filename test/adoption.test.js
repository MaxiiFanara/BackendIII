import { describe, it, before, after, beforeEach } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';

const requester = supertest(app);

const TEST_DB_URI =
  process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/adoptme_test';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Crea un usuario de prueba único vía API y retorna el payload.
 */
const createTestUser = async (overrides = {}) => {
  const res = await requester.post('/api/users').send({
    first_name: 'Test',
    last_name:  'User',
    email:      `test_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`,
    age:        25,
    password:   'test1234',
    ...overrides
  });
  expect(res.status, 'createTestUser falló').to.equal(201);
  return res.body.payload;
};

/**
 * Crea una mascota de prueba directamente en el modelo (no hay pets router).
 */
const createTestPet = async (overrides = {}) => {
  const { petModel } = await import('../src/models/Pet.js');
  return petModel.create({ name: 'Firulais', specie: 'dog', owner: null, ...overrides });
};

/**
 * Registra una adopción vía API y retorna el response completo.
 */
const createTestAdoption = async (uid, pid) =>
  requester.post(`/api/adoptions/${uid}/${pid}`);

// ─── Suite principal ──────────────────────────────────────────────────────────

describe('Adoption Router — Tests Funcionales', function () {
  this.timeout(15000);

  // ── Setup / Teardown ────────────────────────────────────────────────────────

  before(async () => {
    // Mongoose reutiliza la conexión global: solo conectar si no hay una activa
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(TEST_DB_URI);
    } else {
      // Redirigir la conexión existente a la BD de test
      await mongoose.connection.close();
      await mongoose.connect(TEST_DB_URI);
    }
  });

  beforeEach(async () => {
    // Limpiar todas las colecciones entre tests para garantizar aislamiento
    const { userModel }     = await import('../src/models/User.js');
    const { petModel }      = await import('../src/models/Pet.js');
    const { adoptionModel } = await import('../src/models/Adoption.js');
    await Promise.all([
      userModel.deleteMany({}),
      petModel.deleteMany({}),
      adoptionModel.deleteMany({})
    ]);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // GET /api/adoptions
  // ══════════════════════════════════════════════════════════════════════════

  describe('GET /api/adoptions', () => {

    it('debería devolver status 200 y un array vacío cuando no hay adopciones', async () => {
      const res = await requester.get('/api/adoptions');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('payload');
      expect(res.body.payload).to.be.an('array').that.is.empty;
    });

    it('debería devolver todas las adopciones con estructura correcta (1 adopción)', async () => {
      const user = await createTestUser();
      const pet  = await createTestPet();
      await createTestAdoption(user._id, pet._id.toString());

      const res = await requester.get('/api/adoptions');

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.payload).to.be.an('array').with.lengthOf(1);

      const adoption = res.body.payload[0];
      // Verificar estructura del registro
      expect(adoption).to.have.property('_id');
      expect(adoption).to.have.property('createdAt');
      expect(adoption).to.have.property('updatedAt');
      // Verificar owner populado
      expect(adoption.owner).to.be.an('object');
      expect(adoption.owner).to.have.property('_id', user._id);
      expect(adoption.owner).to.have.property('first_name', 'Test');
      expect(adoption.owner).to.have.property('last_name', 'User');
      expect(adoption.owner).to.have.property('email');
      // Verificar pet populado
      expect(adoption.pet).to.be.an('object');
      expect(adoption.pet).to.have.property('_id', pet._id.toString());
      expect(adoption.pet).to.have.property('name', 'Firulais');
      expect(adoption.pet).to.have.property('specie', 'dog');
    });

    it('debería devolver el count correcto con múltiples adopciones', async () => {
      // Crear 3 pares usuario-mascota y adoptar cada uno
      const pairs = await Promise.all([
        (async () => {
          const u = await createTestUser();
          const p = await createTestPet({ name: 'Rex' });
          return { u, p };
        })(),
        (async () => {
          const u = await createTestUser();
          const p = await createTestPet({ name: 'Luna' });
          return { u, p };
        })(),
        (async () => {
          const u = await createTestUser();
          const p = await createTestPet({ name: 'Toby' });
          return { u, p };
        })()
      ]);

      for (const { u, p } of pairs) {
        await createTestAdoption(u._id, p._id.toString());
      }

      const res = await requester.get('/api/adoptions');

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.be.an('array').with.lengthOf(3);
      // Verificar que cada elemento tiene la estructura mínima
      res.body.payload.forEach(adoption => {
        expect(adoption).to.have.property('_id');
        expect(adoption).to.have.property('owner').that.is.an('object');
        expect(adoption).to.have.property('pet').that.is.an('object');
      });
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // GET /api/adoptions/:aid
  // ══════════════════════════════════════════════════════════════════════════

  describe('GET /api/adoptions/:aid', () => {

    it('debería devolver la adopción correcta con estructura completa', async () => {
      const user        = await createTestUser();
      const pet         = await createTestPet();
      const adoptionRes = await createTestAdoption(user._id, pet._id.toString());
      const adoptionId  = adoptionRes.body.payload._id;

      const res = await requester.get(`/api/adoptions/${adoptionId}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal('success');

      const adoption = res.body.payload;
      // Verificar ID coincide con el solicitado
      expect(adoption._id).to.equal(adoptionId);
      expect(adoption).to.have.property('createdAt');
      expect(adoption).to.have.property('updatedAt');
      // Verificar owner populado con campos exactos
      expect(adoption.owner).to.be.an('object');
      expect(adoption.owner._id).to.equal(user._id);
      expect(adoption.owner.first_name).to.equal('Test');
      expect(adoption.owner.last_name).to.equal('User');
      expect(adoption.owner).to.have.property('email');
      expect(adoption.owner).to.not.have.property('password'); // no exponer password
      // Verificar pet populado con campos exactos
      expect(adoption.pet).to.be.an('object');
      expect(adoption.pet._id).to.equal(pet._id.toString());
      expect(adoption.pet.name).to.equal('Firulais');
      expect(adoption.pet.specie).to.equal('dog');
    });

    it('debería devolver 400 si el ID no es un ObjectId válido', async () => {
      const res = await requester.get('/api/adoptions/id-invalido');

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.be.a('string').and.include('aid');
    });

    it('debería devolver 404 con mensaje correcto si la adopción no existe', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res    = await requester.get(`/api/adoptions/${fakeId}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.equal('Adopción no encontrada');
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // POST /api/adoptions/:uid/:pid
  // ══════════════════════════════════════════════════════════════════════════

  describe('POST /api/adoptions/:uid/:pid', () => {

    it('debería crear una adopción y devolver 201 con mensaje y payload correctos', async () => {
      const user = await createTestUser();
      const pet  = await createTestPet();

      const res = await requester.post(`/api/adoptions/${user._id}/${pet._id}`);

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('Mascota adoptada correctamente');
      // Verificar estructura del payload
      expect(res.body.payload).to.have.property('_id');
      expect(res.body.payload).to.have.property('owner');
      expect(res.body.payload).to.have.property('pet');
      expect(res.body.payload).to.have.property('createdAt');
    });

    it('debería actualizar el owner de la mascota en BD tras la adopción', async () => {
      const { petModel } = await import('../src/models/Pet.js');
      const user = await createTestUser();
      const pet  = await createTestPet();

      await requester.post(`/api/adoptions/${user._id}/${pet._id}`);

      const updatedPet = await petModel.findById(pet._id);
      expect(updatedPet.owner.toString()).to.equal(user._id.toString());
    });

    it('debería agregar la mascota al array pets del usuario en BD', async () => {
      const { userModel } = await import('../src/models/User.js');
      const user = await createTestUser();
      const pet  = await createTestPet();

      await requester.post(`/api/adoptions/${user._id}/${pet._id}`);

      const updatedUser = await userModel.findById(user._id);
      const petIds = updatedUser.pets.map(p => p.toString());
      expect(petIds).to.include(pet._id.toString());
    });

    it('debería devolver 400 con mensaje de parámetro inválido si uid no es ObjectId', async () => {
      const pet = await createTestPet();

      const res = await requester.post(`/api/adoptions/uid-invalido/${pet._id}`);

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.be.a('string').and.include('uid');
    });

    it('debería devolver 400 con mensaje de parámetro inválido si pid no es ObjectId', async () => {
      const user = await createTestUser();

      const res = await requester.post(`/api/adoptions/${user._id}/pid-invalido`);

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.be.a('string').and.include('pid');
    });

    it('debería devolver 404 con mensaje exacto si el usuario no existe', async () => {
      const fakeUid = new mongoose.Types.ObjectId().toString();
      const pet     = await createTestPet();

      const res = await requester.post(`/api/adoptions/${fakeUid}/${pet._id}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.equal('Usuario no encontrado');
    });

    it('debería devolver 404 con mensaje exacto si la mascota no existe', async () => {
      const user    = await createTestUser();
      const fakePid = new mongoose.Types.ObjectId().toString();

      const res = await requester.post(`/api/adoptions/${user._id}/${fakePid}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.equal('Mascota no encontrada');
    });

    it('debería devolver 400 con mensaje exacto si la mascota ya fue adoptada', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const pet   = await createTestPet();

      // Primera adopción — debe ser exitosa
      const firstRes = await requester.post(`/api/adoptions/${user1._id}/${pet._id}`);
      expect(firstRes.status).to.equal(201);

      // Segunda adopción con la misma mascota — debe fallar
      const res = await requester.post(`/api/adoptions/${user2._id}/${pet._id}`);

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.equal('La mascota ya tiene dueño');
    });

    it('no debería crear duplicado en BD si la adopción falla por mascota ya adoptada', async () => {
      const { adoptionModel } = await import('../src/models/Adoption.js');
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const pet   = await createTestPet();

      await requester.post(`/api/adoptions/${user1._id}/${pet._id}`);
      await requester.post(`/api/adoptions/${user2._id}/${pet._id}`); // debe fallar

      const count = await adoptionModel.countDocuments({});
      expect(count).to.equal(1);
    });

  });

});
