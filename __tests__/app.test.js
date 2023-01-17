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
    
    // test('200 status: GET /api/reviews return array of objects containing relevant properties ', () => {
    //     return request(app)
    //     .get("/api/reviews")
    //     .expect(200)
    //     .then(({body}) => {
    //         const reviews = body.reviews;

    //         expect(Array.isArray(reviews)).toBe(true);
    //         expect(reviews).toHaveLength(13);
    //         reviews.forEach((review) => {
    //             expect(review).toHaveProperty("owner");
    //             expect(review).toHaveProperty("title");
    //             expect(review).toHaveProperty("review_id");
    //             expect(review).toHaveProperty("category");
    //             expect(review).toHaveProperty("review_img_url");
    //             expect(review).toHaveProperty("created_at");
    //             expect(review).toHaveProperty("votes");
    //             expect(review).toHaveProperty("designer");
    //             expect(review).toHaveProperty("comment_count");

    //         })

    //     })
    // });
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