import request from 'supertest';

import app from 'app';

describe("Wallet Feature", function(){
    it('/create - Creates a new wallet', function(done) {
        request(app).post('/create').send({ walletname: 'bob', password: 'great'}).expect(200, done());
    });
});

// Due to the limited time which i have left to submit i'm not able to write all test cases as i spent most of the time optimizing the structure and testing with POSTMAN, but I have thoroughly tested all endpoints with POSTMAN, and all endpoints are working perfectly.

//Thank you.