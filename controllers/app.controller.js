const {fetchCategories, fetchReviews, getCommentsById } =  require("../models/app.model")

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

const getComments = ((request, response, next)=>{
    const { reviewId } = request.params;

    getCommentsById(reviewId).then((comments)=>{
        response.status(200).send({comments});
    })
    .catch((err)=>{
        next(err)
    })
})

module.exports = { getCategory, getReviews, getComments }