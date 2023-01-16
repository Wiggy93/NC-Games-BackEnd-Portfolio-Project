const {fetchCategories} = require("../models/app.model")

const getAPI = (request, response) => {
    response.status(200).send({message : "all ok"})
}

const getCategory = (request, response, next) => {
    fetchCategories().then((categoryArr) => {
        response.status(200).send({Categories : categoryArr})
    
    })
}

module.exports = {getAPI,  getCategory }