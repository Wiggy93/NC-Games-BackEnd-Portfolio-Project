const express = require("express");
const app = express();
const { getCategory} = require("../controllers/app.controller")

app.use(express.json())

app.get("/api/categories", getCategory)


app.all('*', (request, response) => {
    response.status(404).send({"message" : "Invalid path provided - please try again"})
});


app.use((err, req, res, next) => {
    res.status(500).send({msg: "Internal server error"})
})

module.exports = app;