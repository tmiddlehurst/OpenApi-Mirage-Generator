import { createServer, JSONAPISerializer } from 'miragejs';
import { factories } from './factories';
import { models } from './models';
import findPetsHandler from './handlers/findPetsHandler';
import addPetHandler from './handlers/addPetHandler';
import findPetByIdHandler from './handlers/findPetByIdHandler';
import deletePetHandler from './handlers/deletePetHandler';

const server = createServer({
  environment: 'test',
  models,
  factories,

  serializers: {
    application: JSONAPISerializer
  },

  seeds() {},

  routes() {
    this.get('/pets', findPetsHandler);
    this.post('/pets', addPetHandler);
    this.get('/pets/:id', findPetByIdHandler);
    this.delete('/pets/:id', deletePetHandler);
  }
});
