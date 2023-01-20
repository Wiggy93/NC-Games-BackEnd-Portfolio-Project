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
            const categories = response.body.categories
            
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
    
  
    test('200: /api/reviews/:review_id returns an object specific to that id with  all the relevant key:value pairs', () => {
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({body}) =>{
            const reviewObj = body.reviewObj[0];
           
            expect(typeof reviewObj).toBe("object");
            expect(Array.isArray(reviewObj)).toBe(false);
            expect(reviewObj).toEqual(
                expect.objectContaining({
                    review_id: 2,
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                })
            )
            expect(reviewObj.comment_count).toBe("3")
        })
    })
    
    
    
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

    test("200 status: GET /api/users should return array of objects with user info", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const userArr = body.allUsers;
          
          expect(userArr).toHaveLength(4);
          userArr.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
        });
    });
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


describe('PATCH commands', () => {
    test('200 status: should update the votes value for a given review_id by changing it by the indicated number of votes in a passed object', () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes : 1})
        .expect(200)
        .then(({body})=>{
            expect(body.updatedReview).toEqual(
                {
                    review_id :1,
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                      'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: 2
                  }
            )
        })
    });

    test('200 status: should update the votes value for a given review_id by decreasing it by the indicated number of votes in a passed object', () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes : -100})
        .expect(200)
        .then(({body})=>{
            expect(body.updatedReview).toEqual(
                {
                    review_id :1,
                    title: 'Agricola',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_img_url:
                      'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700',
                    review_body: 'Farmyard fun!',
                    category: 'euro game',
                    created_at: "2021-01-18T10:00:20.514Z",
                    votes: -99
                  }
            )

        })
    });


    test('200: confirm that posted comment has actually entered the database by using the getCommentById endpoint', () => {
        return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes : 5})
        .expect(200)
        .then(()=>{
            return request(app)
            .get("/api/reviews/2")
            .expect(200)
            .then(({body})=>{
                expect(body.reviewObj[0].votes).toBe(10)
            })
        })
    });
});

describe('DELETE commands', () => {
    test('204: should delete given comment by comment_id', () => {
        return request(app).delete("/api/comments/1")
        .expect(204)
        .then(()=>{
           return db.query(`SELECT * FROM comments WHERE comment_id=1`)
            .then((results)=>{
                expect(results.rows).toHaveLength(0);
            })
        })
    });
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

    test('400: GET followed by invalid review datatype should return a message', () => {
        return request(app)
        .get("/api/reviews/bananas")
        .expect(400)
        .then(({body})=>{
            expect(body.message).toEqual("Bad Request - expected a number and got text e.g. received three instead of 3")
        })
    });

    test('404: GET follow by invalid review id ie resource that doesn\'t exist should return a message', () => {
        return request(app)
        .get("/api/reviews/99999")
        .expect(404)
        .then(({body})=>{
            expect(body.message).toEqual("review id does not exist")
        });
    });

    test('400: GET followed by a comment on an invalid review datatype should return a message', () => {
        return request(app)
        .get("/api/reviews/bananas/comments")
        .expect(400)
        .then(({body})=>{
            expect(body.message).toEqual("Bad Request - expected a number and got text e.g. received three instead of 3")
        })
    })
        
    

    test('404: GET follow by a comment on an invalid review id ie resource that doesn\'t exist should return a message', () => {
        return request(app)
        .get("/api/reviews/99999/comments")
        .expect(404)
        .then(({body})=>{
            expect(body.message).toEqual("id does not exist")
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
            expect(body.message).toEqual("Bad Request - expected a number and got text e.g. received three instead of 3")
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
            expect(body.message).toEqual("Not Found")
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

    test('404 status: POST using a username not in the database should return an error message', () => {
        return request(app)
        .post("/api/reviews/1/comments")
        .send({
            username: "Alex",
            body: "This body shouldn't be here!",
        })
        .expect(404)
        .then(({body})=>{
            expect(body.message).toEqual("Not Found")
        })
    });

    test('404 status, PATCH update votes to invalid review id', () => {
        return request(app)
        .patch("/api/reviews/99999999")
        .send({ inc_votes : -100})
        .expect(404)
        .then(({body})=>{
            expect(body.message).toEqual("review id does not exist")
        })
    });

    test('400 status: PATCH update votes with empty object should return message', () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({ })
        .expect(400)
        .then(({body})=>{
            expect(body.message).toEqual( "Missing required fields in comment (username and/or comment)")
        })
    });

    test('400 status: PATCH update votes with inc_votes as non-number datatype', () => {
        return request(app)
        .patch("/api/reviews/1")
        .send({inc_votes : "abc" })
        .expect(400)
        .then(({body})=>{
            expect(body.message).toEqual( "Bad Request - expected a number and got text e.g. received three instead of 3")
        })
    });
   

    test('400: DELETE if comment_id isn\' valid datatype', () => {
        return request(app)
        .delete("/api/comments/bananas")
        .expect(400)
        .then(({body})=>{
            expect(body.message).toEqual("Bad Request - expected a number and got text e.g. received three instead of 3")
            })
        })
    });

    test('404: DELETE if comment_id doesn\'t exist', () => {
        return request(app)
        .delete("/api/comments/999899")
        .expect(404)
        .then(({body})=>{
            expect(body.message).toEqual("id does not exist")
    })
});
    
