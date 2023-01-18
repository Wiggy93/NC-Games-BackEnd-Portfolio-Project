const db = require("../db/connection")


const fetchCategories = (request, response) => {
    return db.query(`SELECT * FROM categories;`).then((result) => {
        return result.rows;
    })
}

const fetchReviews = () => {
  
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


const fetchReviewById = (reviewId) => {
     return db.query(`SELECT * FROM reviews WHERE review_id=$1`, [reviewId]).then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({status : 404, message : "review id does not exist"})
        } else {
            return result.rows;
        }
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
    })
}
module.exports = { fetchCategories, fetchReviews , fetchReviewById, getCommentsById}
