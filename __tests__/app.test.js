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
            const categories = response.body.categories;
            expect(Array.isArray(categories)).toBe(true);
            expect(categories).toHaveLength(4)
            categories.forEach((category=>{
                expect(category).toHaveProperty("slug");
                expect(category).toHaveProperty("description")

            }))
        })
    });
    
    test('200 status: GET /api/reviews return array of objects containing relevant properties, sorted by date in descending order by default', () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body}) => {
            const reviews = body.reviews;
          

            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews).toHaveLength(13);
            reviews.forEach((review) => {
                expect(review).toHaveProperty("owner");
                expect(review).toHaveProperty("title");
                expect(review).toHaveProperty("review_id");
                expect(review).toHaveProperty("category");
                expect(review).toHaveProperty("review_img_url");
                expect(review).toHaveProperty("created_at");
                expect(review).toHaveProperty("votes");
                expect(review).toHaveProperty("designer");
                expect(review).toHaveProperty("comment_count");
            })
            
            expect(reviews).toBeSortedBy("created_at", {descending : true,});
            
            expect(reviews[4].comment_count).toBe("3"); //test needs updating if testData is changed. NB app express exports a JSON, hence expecting 3 as "3"
        })
    });

    test('200 status: should return the comments for a given review_id, sorterd in ascending order', () => {
        return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({body})=>{
            const comments = body.comments;
            
            expect(Array.isArray(comments)).toBe(true);
            expect(comments).toHaveLength(3);
            comments.forEach((comment)=>{
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");
                expect(comment).toHaveProperty("created_at");
                expect(comment).toHaveProperty("author");
                expect(comment).toHaveProperty("body");
                expect(comment).toHaveProperty("review_id");
            });
            expect(comments).toBeSortedBy("created_at");

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
