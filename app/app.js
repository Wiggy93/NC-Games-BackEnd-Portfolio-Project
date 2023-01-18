const express = require("express");
const app = express();
const { getCategory, getReviews, getComments} = require("../controllers/app.controller")

app.use(express.json())

app.get("/api/categories", getCategory)
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:reviewId/comments", getComments)

app.all('*', (request, response) => {
    response.status(404).send({"message" : "Invalid path provided - please try again"})
});

app.use((err, req, res, next)=>{
    if(err.status && err.message){
        res.status(err.status).send({message : err.message});   //catching error where correct format but (review) id doesn't exist 
    } else {
        next(err);
    }
})

app.use((err, req, res, next)=>{
    if (err.code === "22P02"){
        res.status(400).send({message : "Bad Request"})
    } else {
        next(err)
    }
})



app.use((err, req, res, next) => {
   console.log(err)
    res.status(500).send({msg: "Internal server error"})
})

module.exports = app;