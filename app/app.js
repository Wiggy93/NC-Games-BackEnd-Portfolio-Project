const express = require("express");
const app = express();
const { getCategory, getReviews, getReviewById, getComments, patchVotes, getUsers, addComments} = require("../controllers/app.controller")

app.use(express.json())

app.get("/api/categories", getCategory)
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:reviewID", getReviewById);
app.get("/api/reviews/:reviewId/comments", getComments)
app.get("/api/users", getUsers)

app.post("/api/reviews/:reviewID/comments", addComments)

app.patch("/api/reviews/:reviewId", patchVotes)

app.all('*', (request, response) => {
    response.status(404).send({message : "Invalid path provided - please try again"})
});

app.use((err, req, res, next)=>{
    if(err.status && err.message){
        res.status(err.status).send({message : err.message});   
        } else {
        next(err);
    }
})

app.use((err, req, res, next)=>{
    if (err.code === "22P02"){
        res.status(400).send({message : "Bad Request - expected a number and got text e.g. received three instead of 3"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next)=>{
    if (err.code === "23503"){
        res.status(404).send({message : "Not Found"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next)=>{
    if (err.code === "23502"){
        res.status(400).send({message : "Missing required fields in comment (username and/or comment)"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "Internal server error"})
})

module.exports = app;