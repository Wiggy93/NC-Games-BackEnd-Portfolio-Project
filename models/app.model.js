const db = require("../db/connection")

const fetchCategories = (request, response) => {
    return db.query(`SELECT * FROM categories;`).then((result) => {
        return result.rows;
    })
}

const fetchReviews = (review_id) => {

    const reviewCommentCount = 
    `SELECT reviews.*, COUNT (comments.comment_id) AS comment_count  
    FROM reviews 
    LEFT JOIN comments ON comments.review_id=reviews.review_id 
    WHERE review_id=$1
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`;

    return db.query(reviewCommentCount,[review_id]).then((result) => {
        return result.rows;
    })
}

module.exports = { fetchCategories, fetchReviews }