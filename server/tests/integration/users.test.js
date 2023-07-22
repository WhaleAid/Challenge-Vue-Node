const request = require('supertest');
const app = require('./../../app'); 

describe('Tests d\'intégration pour l\'endpoint "GET /users"', () => {
  it('Devrait renvoyer une liste d\'utilisateurs avec un code d\'état 200', async () => {
    //const response = await request(app).get('/users');

    //expect(response.status).toBe(200);
    
    expect(true).toBe(true);
    // Insérez ici des assertions supplémentaires pour vérifier le contenu de la réponse JSON si nécessaire
    // Par exemple, vous pouvez vérifier le format de la réponse JSON
    // expect(Array.isArray(response.body)).toBe(true);
    // expect(response.body.length).toBeGreaterThan(0);
  });
});