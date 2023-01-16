const { request } = require("../app/app");
const db = require("../db/connection")

const fetchCategories = (request, response) => {
    return db.query(`SELECT * FROM categories`).then((result) => {
        return result.rows;
    })
}

const fetchReviews = (request, response) => {
    return db.query(`SELECT * FROM reviews`)
}

module.exports = { fetchCategories }