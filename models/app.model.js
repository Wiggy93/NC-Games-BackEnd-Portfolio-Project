const db = require("../db/connection")
//const {idNotExist} = require("../db/seeds/utils")



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

const getCommentsById = (reviewId) =>{
    return db.query(`SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at ASC`, [reviewId])
    .then((result)=>{
       if (result.rowCount === 0) {
        return Promise.reject({status : 404, message : "id does not exist"})
       } else {
           return result.rows;

       }
        // if (result.rows.length === 0){
        //  idNotExist(comments, review_id, reviewId)
        // } else {
            //return result.rows
        //}
        //come back to if time to refactor if id exists into reusable code
    })
}

module.exports = { fetchCategories, fetchReviews, getCommentsById }
