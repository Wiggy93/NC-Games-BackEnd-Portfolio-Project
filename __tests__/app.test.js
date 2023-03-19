const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const dataTest = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const { isValidJson, isValidJsonObject } = require("../db/seeds/utils");

beforeEach(() => {
  return seed(dataTest);
});

afterAll(() => {
  return db.end();
});

describe("GET commands", () => {
  test("200 status: GET /api/categories should return an array of categories ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const categories = response.body.categories;

        expect(Array.isArray(categories)).toBe(true);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });

  test("200 status: GET /api/reviews return array of objects containing relevant properties, sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
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
        });

        expect(reviews).toBeSortedBy("created_at", { descending: true });

        expect(reviews[4].comment_count).toBe("3"); //test needs updating if testData is changed. NB app express exports a JSON, hence expecting 3 as "3"
      });
  });

  test("200: /api/reviews/:review_id returns an object specific to that id with  all the relevant key:value pairs", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
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
        );
        expect(reviewObj.comment_count).toBe("3");
      });
  });

  test("200 status: should return the comments for a given review_id, sorterd in ascending order", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;

        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("review_id");
        });
        expect(comments).toBeSortedBy("created_at");
      });
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

  test("200 status: GET /api/users/:username should return an object with specific user info", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body }) => {
        const user = body.user[0];
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("avatar_url");
        expect(user).toHaveProperty("name");
        expect(body.user).toHaveLength(1);
      });
  });
});

describe("Get valid JSON of all endpoints", () => {
  test("Returns 'Status: 200' with a JSON endpoints object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpoints = body.endpoints;
        expect(typeof endpoints).toBe("object");
        expect(Array.isArray(endpoints)).toBe(false);
      });
  });

  test("Endpoints object contains keys for each endpoint in API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpoints = body.endpoints;
        expect(endpoints).toHaveProperty("GET /api");
        expect(endpoints).toHaveProperty("GET /api/categories");
        expect(endpoints).toHaveProperty("GET /api/reviews");
        expect(endpoints).toHaveProperty("GET /api/reviews/:reviewId");
        expect(endpoints).toHaveProperty("GET /api/reviews/:reviewid/comments");
        expect(endpoints).toHaveProperty("GET /api/users");
        expect(endpoints).toHaveProperty("PATCH /api/reviews/:reviewid");
        expect(endpoints).toHaveProperty(
          "POST /api/reviews/:reviewid/comments"
        );
        expect(endpoints).toHaveProperty("DELETE /api/comments/:commentid");
      });
  });
});

describe("POST commands", () => {
  test("POST to /api/reivews/:review_id/comments takes a username and body in the request, responding with the posted comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
        body: "One of the classics!",
      })
      .expect(201)
      .then(({ body }) => {
        const newComment = body.addedComment;

        expect(newComment).toHaveLength(1);
        expect(newComment[0].body).toBe("One of the classics!");
        expect(newComment[0].author).toBe("mallionaire");
        expect(newComment[0].review_id).toBe(1);
        expect(newComment[0].votes).toBe(0);
        expect(typeof newComment[0].created_at).toEqual("string");
      });
  });
});

describe("PATCH commands", () => {
  test("200 status: should update the votes value for a given review_id by changing it by the indicated number of votes in a passed object", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 2,
        });
      });
  });

  test("200 status: should update the votes value for a given review_id by decreasing it by the indicated number of votes in a passed object", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedReview).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: -99,
        });
      });
  });

  test("200: confirm that posted comment has actually entered the database by using the getCommentById endpoint", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(() => {
        return request(app)
          .get("/api/reviews/2")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviewObj[0].votes).toBe(10);
          });
      });
  });

  test("200: should update the votes value for a given comment id by increasing it by the indicated number of votes in a passed object ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          author: "bainesface",
          review_id: 2,
          votes: 17,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });

  test("200: should update the votes value for a given comment id by descreasing it by the indicated number of votes in a passed object ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          author: "bainesface",
          review_id: 2,
          votes: 11,
          created_at: "2017-11-22T12:43:33.389Z",
        });
      });
  });

  test("should confirm that the updated comment has actually entered the database by using the getCommentById endpoint", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(() => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[1].votes).toBe(21);
          });
      });
  });
});

describe("Get /api/reviews Queries", () => {
  test("200: should return the reviews with the category passed", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then(({ body }) => {
        const reviews = body.reviews;

        expect(reviews).toHaveLength(1);
        reviews.forEach((review) => {
          expect(review).toHaveProperty("category");
        });
      });
  });

  test("200: should return an empty array of reviews when passed a category that has no reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then(({ body }) => {
        const reviews = body.reviews;
        expect(reviews).toHaveLength(0);
      });
  });

  test("200: should return all reviews sorted by the passed sort_by heading and in the passed direction/order", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        const reviews = body.reviews;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("review_id");
      });
  });

  test("200: should return all reviews sorted by review_image_url descending", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_img_url&order=asc")
      .expect(200)
      .then(({ body }) => {
        const reviews = body.reviews;
        expect(reviews).toHaveLength(13);
        expect(reviews).toBeSortedBy("review_img_url");
      });
  });
});

describe("DELETE commands", () => {
  test("204: should delete given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db
          .query(`SELECT * FROM comments WHERE comment_id=1`)
          .then((results) => {
            expect(results.rows).toHaveLength(0);
          });
      });
  });
});

describe("Error handling", () => {
  test("GET followed by an invalid endpoing should return a 404 Not Found error ", () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          message: "Invalid path provided - please try again",
        });
      });
  });

  test("400: GET followed by invalid review datatype should return a message", () => {
    return request(app)
      .get("/api/reviews/bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual(
          "Bad Request - expected a number and got text e.g. received three instead of 3"
        );
      });
  });

  test("404: GET follow by invalid review id ie resource that doesn't exist should return a message", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("review id does not exist");
      });
  });
  describe("getCommets", () => {
    test("400: GET followed by a comment on an invalid review datatype should return a message", () => {
      return request(app)
        .get("/api/reviews/bananas/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Bad Request - expected a number and got text e.g. received three instead of 3"
          );
        });
    });

    test("404: GET follow by a comment on an invalid review id ie resource that doesn't exist should return a message", () => {
      return request(app)
        .get("/api/reviews/99999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("id does not exist");
        });
    });
  });

  describe("postComments errors", () => {
    test("400 status: POST a comment to invalid review datatype should return a message ", () => {
      return request(app)
        .post("/api/reviews/bananas/comments")
        .send({
          username: "mallionaire",
          body: "This body shouldn't be here!",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Bad Request - expected a number and got text e.g. received three instead of 3"
          );
        });
    });

    test("404 status: POST a comment to a review id that doesn' exist should return a message", () => {
      return request(app)
        .post("/api/reviews/999/comments")
        .send({
          username: "mallionaire",
          body: "This body shouldn't be here!",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Not Found");
        });
    });

    test("400 status: POST a malformed request body should return a message ", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Missing required fields in comment (username and/or comment)"
          );
        });
    });

    test("404 status: POST using a username not in the database should return an error message", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({
          username: "Alex",
          body: "This body shouldn't be here!",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Not Found");
        });
    });
  });

  describe("Update/Patch votes errors", () => {
    test("404 status, PATCH update votes to invalid review id", () => {
      return request(app)
        .patch("/api/reviews/99999999")
        .send({ inc_votes: -100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("review id does not exist");
        });
    });

    test("400 status: PATCH update votes with empty object should return message", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Missing required fields in comment (username and/or comment)"
          );
        });
    });

    test("400 status: PATCH update votes with inc_votes as non-number datatype", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "abc" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Bad Request - expected a number and got text e.g. received three instead of 3"
          );
        });
    });

    test("404 status, PATCH update comment votes to invalid comment id", () => {
      return request(app)
        .patch("/api/comments/99999999")
        .send({ inc_votes: -100 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("comment id does not exist");
        });
    });

    test("400 status: PATCH update comment votes with empty object should return message", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Missing required fields in comment (username and/or comment)"
          );
        });
    });

    test("400 status: PATCH update comment votes with inc_votes as non-number datatype", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "abc" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Bad Request - expected a number and got text e.g. received three instead of 3"
          );
        });
    });

    test("400: DELETE if comment_id isn' valid datatype", () => {
      return request(app)
        .delete("/api/comments/bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Bad Request - expected a number and got text e.g. received three instead of 3"
          );
        });
    });
  });

  test("404: DELETE if comment_id doesn't exist", () => {
    return request(app)
      .delete("/api/comments/999899")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("id does not exist");
      });
  });

  describe("Get users/username errors", () => {
    test("404: GET followed by invalid username should return a not found message", () => {
      return request(app)
        .get("/api/users/Alex")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Username Not Found");
        });
    });
  });
});

describe("Get Review Queries", () => {
  test("400: If query a category filter that doesn't exist", () => {
    return request(app)
      .get("/api/reviews?category=bananas")
      .expect(400)
      .then(({ body }) => {
        console.log(body, "<<<test body");
        expect(body.message).toBe("Bad Request - invalid category filter");
      });
  });

  test("400: If sort a category that doesn't exist", () => {
    return request(app)
      .get("/api/reviews?sort_by=bananas+asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - invalid sort function");
      });
  });

  test("400: If sort a valid category by non-asc or desc", () => {
    return request(app)
      .get("/api/reviews?sort_by=title+bananas")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request - invalid sort function");
      });
  });
});
