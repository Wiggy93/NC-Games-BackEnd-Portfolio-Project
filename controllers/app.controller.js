
const {fetchCategories, fetchReviews , fetchReviewById } =   require("../models/app.model")

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

module.exports = { getCategory, getReviews, getReviewById }
