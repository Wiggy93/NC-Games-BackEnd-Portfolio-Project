
const {fetchCategories, 
    fetchReviews, 
    getCommentsById , 
    fetchReviewById, 
    updateVotes } =   require("../models/app.model")

const getCategory = (request, response, next) => {
    fetchCategories().then((categories) => {
        response.status(200).send({categories})
    })
    .catch((err) => {
        next(err)
    })
}

const getReviews = ((request, response, next) => {    
    fetchReviews().then((reviews) => {
        response.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
    })
})

const getReviewById = ((request, response, next) => {
    const { reviewID } = request.params;
    fetchReviewById(reviewID).then((reviewObj)=>{
        response.status(200).send({reviewObj})
    })
    .catch((err)=>{
        next(err)
    })
})

const getComments = ((request, response, next)=>{
    const { reviewId } = request.params;

    getCommentsById(reviewId).then((comments)=>{
        response.status(200).send({comments});
    })
    .catch((err)=>{
        next(err)
    })
})

const patchVotes =((request, response)=>{
    
    const body = request.body;
    const {reviewId}=request.params;
   
    updateVotes(reviewId, body).then((updatedReview)=>{
        response.status(200).send({updatedReview})
    })
})

module.exports = { 
    getCategory, 
    getReviews, 
    getReviewById, 
    getComments, 
    patchVotes }
