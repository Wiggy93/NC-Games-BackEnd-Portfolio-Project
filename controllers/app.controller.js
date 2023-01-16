const {fetchCategories} = require("../models/app.model")

const getCategory = (request, response, next) => {
    fetchCategories().then((categoryArr) => {
        response.status(200).send({Categories : categoryArr})
    
    })
}

const getReviews = ((request, response, next) => {
    fetchReviews().then((reviewArr) => {
        response.status(200).send({Reviews : reviewArr})
    })
})

module.exports = { getCategory, getReviews }