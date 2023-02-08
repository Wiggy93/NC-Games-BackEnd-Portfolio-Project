const express = require("express");
const app = express();
const cors = require('cors');
const {
    getCategory, getReviews, getReviewById, getComments, patchVotes, getUsers, addComments, deleteComment, getEndPoint, patchCommentVotes} = require("../controllers/app.controller")
const {customErrorHandler, stringInsteadOfNumber, notFound, missingFields, serverError} = require("./app.errors")

app.use(cors());
app.use(express.json());


app.get("/api", getEndPoint)
app.get("/api/categories", getCategory)
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:reviewId", getReviewById);
app.get("/api/reviews/:reviewId/comments", getComments)
app.get("/api/users", getUsers)

app.post("/api/reviews/:reviewID/comments", addComments)

app.patch("/api/reviews/:reviewId", patchVotes)
app.patch("/api/comments/:commentId", patchCommentVotes)

app.delete("/api/comments/:commentId",deleteComment)

app.all('*', (request, response) => {
    response.status(404).send({message : "Invalid path provided - please try again"})
});

app.use(customErrorHandler)
app.use(stringInsteadOfNumber)
app.use(notFound)
app.use(missingFields)
app.use(serverError)

module.exports = app;