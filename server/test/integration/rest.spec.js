const { createDonor, createServer } = require('./common');
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

  describe('/api/donor', () => {
    let createdDonorId;

    it('POST should create a Donor', (done) => {
      server.post('/api/donor')
        .send(createDonor())
        .expect(200)
        .then((response) => {
          createdDonorId = response.body.id;
          expect(createdDonorId).toBeDefined();
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
