const request = require('supertest');
require('dotenv').config({silent: true});

const AppBackend = require('../../index');
const server = createServer();

describe('REST Functionality', () => {
  describe('/api', () => {
    it('GET should fetch API info', (done) => {
      server.get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.version).toBe('1');
          done();
        });
    })
  });

  fdescribe('/api/donor', () => {
    let createdDonorId;

    it('POST should create a Donor', (done) => {
      server.post('/api/donor')
        .send(createDonor())
        .expect(200)
        .then((response) => {
          // console.log(response);
          expect(response.body.id).toBeDefined();
          done();
        });
    });

    afterEach((done) => {
      server.delete(`/api/donor/${createdDonorId}`).then(done);
    });
  });

  describe('/api/donor/:id', () => {
    let donor;

    beforeEach((done) => {
      server
        .post('/api/donor')
        .send(createDonor())
        .then(({ body }) => {
          donor = body;
          done();
        });
    });

    it('GET should retrieve the previously created user', (done) => {
      server.get(`/api/donor/${donor.id}`).then(({ body }) => {
        expect(body).toEqual(donor);
        done()
      });
    });

    afterEach((done) => {
      server.delete(`/api/donor/${donor.id}`).then(done);
    });
  })
});

function createDonor(emptierDonor = {}) {
  const fullDonor = {
    firstName: 'John',
    lastName: 'Doe',
    contactNo: '+40721231411',
    email: 'john.doe@acme.com',
    bloodGroup: 'O+',

    latitude: 45.75372,
    longitude: 21.22571,

    ip: '',
    countryCode: 'ROU',
    street: 'Piata Victoriei',
    city: 'Timisoara'
  };

  return Object.assign({}, fullDonor, emptierDonor);
}

function createServer() {
  if (process.env.TEST_SERVER_URL) {
    return request.agent(process.env.TEST_SERVER_URL);
  }

  const appBackend = new AppBackend();
  return request(appBackend._app);
}
