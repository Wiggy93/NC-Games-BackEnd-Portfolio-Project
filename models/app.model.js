const db = require("../db/connection")

const fetchCategories = (request, response) => {
    return db.query(`SELECT * FROM categories;`).then((result) => {
        return result.rows;
    })
}

const fetchReviews = (request, response) => {
    // const review_comments = `
    // CREATE TABLE review_comments (
    // review_comments_id SERIAL PRIMARY KEY, 
    // review_id INT REFERENCES reviews(review_id),
    // comment_id INT REFERENCES comments
    // ;)
    // `
    
//forEach review, go into comments table and count hom many review_id - review(review_id)
//

    `
    SELECT * FROM reviews WHERE reviews(review_id)=
    `

    let queryString = 
    `
    SELECT reviews.*, comments.review_id AS comment_count FROM reviews
    JOIN comments

    ;
    `
    //make junction table, many to many relationship of review id to comment
    //query out if comment review_id matches that from reviews.
    //then look at length of array to count comments (assign as new variable)
    //then use this to input into comment_count column output.

    return db.query(queryString).then((result) => {
        return result.rows;
    })
}

module.exports = { fetchCategories, fetchReviews }