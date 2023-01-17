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
            const categories = response.body.categories
            
            expect(categories).toHaveLength(4);
            expect(Array.isArray(categories)).toBe(true);
            categories.forEach((category => {
                expect(category).toHaveProperty("slug");
                expect(category).toHaveProperty("description");
            }))
        })
    });
})

// describe('/api/reviews', () => {
//     test('200: /api/reviews/:review_id returns an object specific to that id with  all the relevant key:value pairs', () => {
//         return request(app)
//         .get("/api/reviews/2")
//         .expect(200)
//         .then((response) =>{
//             console.log(response)
//                 const reviewObj = response.body.reviewObj
    
//                 expect(typeof reviewObj).toBe("object");
//                 expect(Array.isArray(reviewObj)).toBe(false);
//                 expect(reviewObj).toHaveLength(1);
//                 reviewObj.forEach((review_id=>{
//                     expect(review_id).toHaveProperty("review_id");
//                     expect(review_id).toHaveProperty("title");
//                     expect(review_id).toHaveProperty("review_body");
//                     expect(review_id).toHaveProperty("designer");
//                     expect(review_id).toHaveProperty("review_img_url");
//                     expect(review_id).toHaveProperty("votes");
//                     expect(review_id).toHaveProperty("category");
//                     expect(review_id).toHaveProperty("owner");
//                     expect(review_id).toHaveProperty("created_at");
//                 }))

//             })

//         })
//     });


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

