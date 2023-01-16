const db = require("../db/connection")

const fetchCategories = (request, response) => {
    return db.query(`SELECT * FROM categories`).then((result) => {
        return result.rows;
    })
}

module.exports = { fetchCategories }