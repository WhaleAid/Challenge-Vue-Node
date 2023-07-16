
// math.test.js

const {addNumbers,subtractNumbers}  = require('./../utils/math');



// Test de la fonction addNumbers
describe('addNumbers', () => {
  it('devrait retourner la somme de deux nombres', () => {
    // Testez la fonction addNumbers avec différents cas
    const result1 = addNumbers(2, 3);
    const result2 = addNumbers(-1, 5);
    const result3 = addNumbers(0, 0);

    // Vérifiez les résultats attendus en utilisant Jest
    expect(result1).toBe(5);
    expect(result2).toBe(4);
    expect(result3).toBe(0);
  });
});

// Test de la fonction subtractNumbers
describe('subtractNumbers', () => {
    it('devrait retourner la différence de deux nombres', () => {
      // Testez la fonction subtractNumbers avec différents cas
      const result1 = subtractNumbers(2, 3);
      const result2 = subtractNumbers(-1, 5);
      const result3 = subtractNumbers(0, 0);
  
      // Vérifiez les résultats attendus en utilisant Jest
      expect(result1).toBe(-1);
      expect(result2).toBe(-6);
      expect(result3).toBe(0);
    });
  });
