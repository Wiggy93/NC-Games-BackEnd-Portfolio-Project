const {fetchCategories} = require("../models/app.model")

const getCategory = (request, response, next) => {
    fetchCategories().then((categoryArr) => {
        response.status(200).send({Categories : categoryArr})
    
    })
}

module.exports = { getCategory }