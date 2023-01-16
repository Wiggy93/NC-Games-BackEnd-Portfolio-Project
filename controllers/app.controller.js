const {fetchCategories} = require("../models/app.model")

const getCategory = (request, response, next) => {
    fetchCategories().then((categories) => {
        response.status(200).send({categories})
    
    })
}

module.exports = { getCategory }