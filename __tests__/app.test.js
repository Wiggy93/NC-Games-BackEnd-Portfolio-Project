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

describe('GET commands', () => {
     test('200 status: GET /api/categories should return an array of categories ', () => {
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
    
//     test('200 status: GET /api/reviews return array of objects containing relevant properties ', () => {
//         return request(app)
//         .get("/api/reviews")
//         .expect(200)
//         .then(({body}) => {
//             expect(Array.isArray(body.Reviews)).toBe(true);
//             expect(body.Reviews).toHaveProperty("owner");
//             expect(body.Reviews).toHaveProperty("title");
//             expect(body.Reviews).toHaveProperty("review_id");
//             expect(body.Reviews).toHaveProperty("category");
//             expect(body.Reviews).toHaveProperty("review_img_url");
//             expect(body.Reviews).toHaveProperty("created_at");
//             expect(body.Reviews).toHaveProperty("votes");
//             expect(body.Reviews).toHaveProperty("designer");
//             expect(body.Reviews).toHaveProperty("comment_count");
//         })
//     });
// })


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