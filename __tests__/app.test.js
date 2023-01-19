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

})

describe('POST commands', () => {
    test("POST to /api/reivews/:review_id/comments takes a username and body in the request, responding with the posted comment", () =>{
        return request(app)
        .post("/api/reviews/1/comments")
        .send({
            username: "mallionaire",
            body: "One of the classics!",
        })
        .expect(201)
        .then(({body})=>{
          const newComment = body.addedComment;
      
          expect(newComment).toHaveLength(1)
          expect(newComment[0].body).toBe("One of the classics!")
          expect(newComment[0].author).toBe("mallionaire")
          expect(newComment[0].review_id).toBe(1);
          expect(newComment[0].votes).toBe(0)
          expect(typeof newComment[0].created_at).toEqual("string")
        })
    })
});

describe('Error handling', () => {
    test("GET followed by an invalid endpoing should return a 404 Not Found error ", () => {
      return request(app)
        .get("/api/bananas")
        .expect(404)
        .then(({body}) => {
         expect(body).toEqual({"message" : "Invalid path provided - please try again"});
        });
    });

    test('400 status: POST a comment to invalid review datatype should return a message ', () => {
        return request(app)
        .post("/api/reviews/bananas/comments")
        .send({
            username: "mallionaire",
            body: "This body shouldn't be here!",
        })
        .expect(400)
        .then(({body})=>{
            expect(body.message).toEqual("Bad Request")
        })
    });

    test('404 status: POST a comment to a review id that doesn\' exist should return a message', () => {
        return request(app)
        .post("/api/reviews/999/comments")
        .send({
            username: "mallionaire",
            body: "This body shouldn't be here!",
        })
        .expect(404)
        .then(({body})=>{
            expect(body.message).toEqual("Review ID Not Found")
        })
    });

    test('400 status: POST a malformed request body should return a message ', () => {
        return request(app)
        .post("/api/reviews/1/comments")
        .send({  })
        .expect(400)
        .then(({body})=>{
            expect(body.message).toEqual("Missing required fields in comment (username and/or comment)")
        })
    });

    // test.only('404 status: POST using a username not in the database should return an error message', () => {
    //     return request(app)
    //     .post("/api/reviews/1/comments")
    //     .send({
    //         username: "Alex",
    //         body: "This body shouldn't be here!",
    //     })
    //     .expect(404)
    //     .then(({body})=>{
    //         expect(body.message).toEqual("User doesn't exist")
    //     })
    // });

});
