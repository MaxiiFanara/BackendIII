import { faker } from '@faker-js/faker';
import { hashPassword } from './hash.util.js';

const SPECIES = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster'];

const generateUser = async () => {
  const hashedPassword = await hashPassword('coder123');
  
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 80 }),
    password: hashedPassword,
    role: faker.helpers.arrayElement(['user', 'admin']),
    pets: []
  };
};

const generatePet = () => {
  return {
    name: faker.person.firstName(),
    specie: faker.helpers.arrayElement(SPECIES),
    owner: null
  };
};

export const generateUsers = async (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateUser());
  }
  return users;
};

export const generatePets = (count) => {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push(generatePet());
  }
  return pets;
};