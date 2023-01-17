const db = require("../db/connection")

const fetchCategories = (request, response) => {
    return db.query(`SELECT * FROM categories`).then((result) => {
        return result.rows;
    })
}

const fetchReviews = (request, response) => {
  
    const reviewCommentCount = 
    `SELECT reviews.*, COUNT (comments.comment_id) AS comment_count  
    FROM reviews 
    LEFT JOIN comments ON comments.review_id=reviews.review_id 
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`;
    
    return db.query(reviewCommentCount).then((result) => {
        return result.rows;
    })
}

//working on sql script to input stuff correctly
const writeComment = (reviewID, body) =>{
    const queryStr = 
    `
    INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    RETURNING*;
    `
     
    return db.query(queryStr,[body.username, body.body, reviewID]).then((result)=>{
        return result.rows;
    })
}

module.exports = { fetchCategories, fetchReviews , writeComment}
