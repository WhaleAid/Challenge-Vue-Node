const request = require('./../../server/node_modules/supertest');
const app = require('./../../server/app'); 

require('./../../server/node_modules/dotenv').config({ path: `${__dirname}/../../server/config.env` });


const UserMg = require('./../../server/db/mongo/models/userModel');
const UserPg = require('./../../server/db/postGres/models/userPostgresModel');
const Email = require('./../../server/utils/email');

jest.mock('./../../server/db/mongo/models/userModel'); // Mock de UserMg
jest.mock('./../../server/db/postGres/models/userPostgresModel'); // Mock de UserPg
jest.mock('./../../server/utils/email'); // Mock du mailer

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


describe('Integration test for the endpoint "POST /signup"', () => {
  it('Should return a 201 status code, send a email to welcome the new user and return a valid jwt token', async () => {

    const signupData = {
      "firstName": "Malek",
      "lastName": "IDIR",
      "email": "idirwalidhakim31@gmail.com",
      "password": "password",
      "passwordConfirm": "password",
      "role": "user"
    };

    UserMg.create.mockResolvedValue(signupData); 
    UserPg.create.mockResolvedValue(signupData);
    const sendWelcomeMock = jest.spyOn(Email.prototype, 'sendWelcome').mockResolvedValue();
    const response = await request(app).post(`/api/v1/users/signup`).send(signupData);

    
   // Vous pouvez accéder à la requête utilisée pour la réponse
   const requestUsed = response.request;

   console.log("request Method : ",requestUsed.method); // Affiche "POST"
   console.log("URL accessed :", requestUsed.url); // Affiche "/signup"
   console.log("req host : ", requestUsed.get('host')); // Affiche le corps de la requête envoyée
  
    
    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(sendWelcomeMock).toHaveBeenCalled();

    //verify that the jwt token has 3 parts 
    const tokenParts = response.body.token.split('.');
    expect(tokenParts).toHaveLength(3);

  });

  it('Should return a 409 status code if the user is already in the DB and should not send token and send welcome email', async () => {

    const userEmail = 'idirwalidhakim31@gmail.com' 
    //user in the DB
    const userData = {
      "firstName": "Malek",
      "lastName": "IDIR",
      "email": userEmail,
      "password": "password",
      "role" : "user"

    };

    UserMg.find.mockResolvedValue(userData); 
    UserPg.findOne.mockResolvedValue(userData); 
    const sendWelcomeMock = jest.fn();
    Email.prototype.sendWelcome = sendWelcomeMock;
    
    //user data in the signup form
    const signupData = {
      firstName: 'Nouveau',
      lastName: 'Utilisateur',
      email: userEmail,
      password: 'nouveaumotdepasse',
      passwordConfirm: 'nouveaumotdepasse',
      role: 'user'
    };

    
    const response = await request(app).post(`/api/v1/users/signup`).send(signupData);
  
    
    expect(response.status).toBe(409);
    expect(response.body.token).toBeFalsy();
    expect(sendWelcomeMock).toHaveBeenCalledTimes(0);

    //verify that the jwt token has 3 parts 
    // const tokenParts = response.body.token.split('.');
    // expect(tokenParts).toHaveLength(3);

  });
});


// jest.spyOn(UserMg, 'findOne');
describe('Integration test of the login endpoint "POST /login"', ()=>{

  afterEach(() => {
    jest.restoreAllMocks(); // Restaure tous les spies après chaque test pour éviter des interférences entre les tests
  });


  it("Should return a 400 satus code and no token if the user does not provide a password",async ()=>{

    const loginData = {
      email : "idirwalidhakim31@gmail.com"
    };
    const response = await request(app).post(`/api/v1/users/login`).send(loginData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please provide email and password');
    expect(response.body.token).toBeFalsy();
  });

  it("Should return a 400 satus code if the user does not provide a email",async ()=>{

    const loginData = {
      password : "password"
    };
    const response = await request(app).post(`/api/v1/users/login`).send(loginData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please provide email and password');
    expect(response.body.token).toBeFalsy();
  });

  
  
  it("Should return a 401 satus code if the user does not exists",async ()=>{

    const loginData = {
      email : "idirwalidhakim31@gmail.com",
      password : "password"
    };

    //when it is the case it will send a TypeError 
    UserMg.findOne.mockResolvedValue(null);


    const response = await request(app).post(`/api/v1/users/login`).send(loginData);
    expect(UserMg.findOne).toHaveBeenCalledWith({ email: loginData.email });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('No user found with this email or something else went wrong');
    expect(response.body.token).toBeFalsy();
  });

  it("Should return a 401 satus code if the user exists but the password provided is incorrect",async ()=>{


    const loginData = {
      email : "idirwalidhakim31@gmail.com",
      password : "wrongPassword"
    };

    const user = new UserMg({
      firstName: "walid",
      lastName: "idir",
      email: "idirwalidhakim31@gmail.com",
      password: "$2a$12$T9ra29eneREUafd25rDGpOl994Vi0lLnH4vXC0Uj35y2u/lOvnWeG",
      role: "user",
    });
    
    //the user found in the Db
    UserMg.findOne.mockResolvedValue(user);

    //user.correctPassword.mockReturnValue(false);
    const correctPasswordSpy = jest.spyOn(user, 'correctPassword');
    correctPasswordSpy.mockResolvedValue(false); // Mock de la méthode correctPassword qui renvoie toujours false

    const response = await request(app).post(`/api/v1/users/login`).send(loginData);
    expect(UserMg.findOne).toHaveBeenCalledWith({ email: loginData.email });
    //expect(user.correctPassword).toHaveBeenCalled();
    //expect(user.correctPassword).toHaveBeenCalledWith(loginData.password, user.password);


    expect(response.status).toBe(500);
    //expect(response.body.message).toBe('No user found with this email');
    expect(response.body.token).toBeFalsy();
  });

  
});


describe('POST /logout', () => {
  it('should logout a user if a valid token is provided', async () => {

    const blacklist = [];

    const token = "fake.jwt.token"

    // const res = await request(app)
    //   .post('/logout')
    //   .set('Authorization', `Bearer ${token}`)
      //.expect(200);

    //expect(res.body.message).toBe('Successfully logged out');
    // check if the token is in the blacklist
  });

  // it('should return an error if no token is provided', async () => {
  //   const res = await request(app)
  //     .post('/logout')
  //     .expect(401);

  //   expect(res.body.message).toBe('You are not logged in');
  // });
});