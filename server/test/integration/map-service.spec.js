const { createDonor, createServer } = require('./common');
const server = createServer();

describe('Map Service', () => {
  describe('GeoJSON format', () => {
    let donor;
    let geoJsonData;

    beforeAll((done) => {
      server.get(`/api/map/0/0/0.geojson`).then(({ body }) => {
        geoJsonData = body;
        console.log(Object.keys(geoJsonData));
        done()
      });
    });

    beforeEach((done) => {
      server
        .post('/api/donor')
        .send(createDonor())
        .then(({ body }) => {
          donor = body;
          done();
        });
    });

    it('should have a new feature in the GeoJSON', (done) => {
      server.get(`/api/map/0/0/0.geojson`).then(({ body }) => {
        const newCount = body.features.length;
        const oldCount = geoJsonData.features.length;
        expect(newCount - oldCount).toBe(1);
        done()
      });
    });

    afterEach((done) => {
      server.delete(`/api/donor/${donor.id}`).then(done);
    });
  })
});
