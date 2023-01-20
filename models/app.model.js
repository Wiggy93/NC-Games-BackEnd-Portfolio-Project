const db = require("../db/connection")


const fetchCategories = (request, response) => {
    return db.query(`SELECT * FROM categories;`).then((result) => {
        return result.rows;
    })
}

const fetchReviews = (category, sort_by="created_at", order="desc") => {
    const acceptedCategories = ["euro game", "social deduction", "dexterity", "children's games"];

    const acceptedSortBys = ["review_id","title", "designer", "owner", "review_img_url", "review_body", "category", "created_at", "votes"]

    const queryValues = []

    let queryStr = 
    `SELECT reviews.*, COUNT (comments.comment_id) AS comment_count  
    FROM reviews 
    LEFT JOIN comments ON comments.review_id=reviews.review_id`
    
    if(category !== undefined){
        if(!acceptedCategories.includes(category.toLowerCase())){
            return Promise.reject({status : 400, message : "Bad Request - invalid category filter"})
        } else {
            queryValues.push(category);
            queryStr += ` WHERE reviews.category = $1`
        }
    }

    if ( !acceptedSortBys.includes(sort_by.toLowerCase()) || 
    !["asc", "desc"].includes(order.toLowerCase())) {
        return Promise.reject({status : 400, message : "Bad Request - invalid sort function"})
    }

    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`
    return db.query(queryStr, queryValues).then((result) => {
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
    const queryStr = `SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at ASC`

    return db.query(queryStr, [reviewId])
    .then((result)=>{
       if (result.rowCount  === 0) {
        return Promise.reject({status : 404, message : "id does not exist"})
       } else {
           return result.rows;
       }
    })
}


const updateVotes = ((reviewId, body)=>{
   const queryStr = 

    `UPDATE reviews 
    SET votes = votes + $1
    WHERE review_id IN   
    (SELECT review_id FROM reviews WHERE review_id=$2)
    RETURNING*;`

    return db.query(queryStr, [body.inc_votes, reviewId]).then((result)=>{
        if (result.rowCount === 0) {
            return Promise.reject({status : 404, message : "review id does not exist"})
        } else {
            return result.rows[0]
           }
    })
})

const fetchUsers = (()=>{
    return db.query(`SELECT * FROM users`).then((result)=>{
        return result.rows
    })
})

const writeComment = (reviewID, body) =>{
    
    const queryStr = 
    `INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    
    RETURNING*;`

    return db.query(queryStr,[body.username, body.body, reviewID])
    
    .then((result)=>{
            return result.rows;
    })
}


module.exports = { fetchCategories, fetchReviews , fetchReviewById, getCommentsById, fetchUsers, updateVotes, writeComment}
