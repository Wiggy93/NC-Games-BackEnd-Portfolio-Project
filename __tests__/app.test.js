const request = require("supertest");
const app = require("../app/app");
const db  = require("../db/connection");
const dataTest = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")

beforeEach(() => {
    return seed(dataTest);
})

afterAll(() => {
    return db.end();
})

describe('GET /api/categories', () => {
     test('/api/categories should return 200 status and array of categories ', () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.Categories)).toBe(true);
            expect(response.body.Categories[0]).toHaveProperty("slug");
            expect(response.body.Categories[0]).toHaveProperty("description")
        })
    });
})

describe('Error handling', () => {
    test("GET followed by an invalid endpoing should return a 404 Not Found error ", () => {
      return request(app)
        .get("/api/bananas")
        .expect(404)
        .then(({body}) => {
         expect(body).toEqual({"message" : "Invalid path provided - please try again"});
        });
    });
});

