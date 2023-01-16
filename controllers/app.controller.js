//const { fetchCategories, fetchReviews }  = require("../models/app.model")
const {fetchCategories, fetchReviews } =  require("../models/app.model")

const getCategory = (request, response, next) => {
    fetchCategories().then((categoryArr) => {
        response.status(200).send({Categories : categoryArr})
    
    })
}

const getReviews = ((request, response, next) => {
    fetchReviews().then((reviews) => {
        response.status(200).send({reviews})
    })
})

module.exports = { getCategory, getReviews }