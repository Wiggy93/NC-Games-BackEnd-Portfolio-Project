
const {fetchCategories, fetchReviews, writeComment } =  require("../models/app.model")

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

const addComments = ((request, response, next) =>{
    const {body} = request;
    const { reviewID } =  request.params;
    

    writeComment(reviewID, body).then((newComment)=>{
        response.status(201).send({addedComment : newComment})
    })
    .catch((err)=>{
        next(err)
    })
})

module.exports = { getCategory, getReviews, addComments }