const {
    fetchCategories, 
    fetchReviews, 
    getCommentsById , 
    fetchReviewById, 
    updateVotes,
    fetchUsers ,
    writeComment,
    removeComment,
    fetchAPI,
    } =   require("../models/app.model")
// const fsPromises = require("fs/promises");


const getApi = (request, response, next) =>{
    return fetchAPI()
    .then((data)=>{
        const jsonData = JSON.stringify(data);
        return jsonData;
    })
    .then((readFile)=>{
        console.log(readFile, "<<<,line 20");

        response.status(200).send({readFile})
    })
    .catch((err)=>console.log(err))
}

const getCategory = (request, response, next) => {
    fetchCategories().then((categories) => {
        response.status(200).send({categories})
    })
    .catch((err) => {
        next(err)
    })
}

const getReviews = ((request, response, next) => {    
    const {category, sort_by, order} = request.query;
    
    fetchCategories()
    .then((categories)=>{
     
        return fetchReviews(categories, category, sort_by, order)
    .then((reviews) => {
        response.status(200).send({reviews})
     })
    })
    .catch((err) => {
        console.log(err, "controller");
        next(err)
    })
})

const getReviewById = ((request, response, next) => {
    const {category, sort_by, order} = request.query;
    const {reviewId} = request.params;
    
    fetchCategories()
    .then((categories)=>{
        return fetchReviews(categories, category, sort_by, order)})
   .then((result)=>{
       return fetchReviewById(result, reviewId)
    })
    .then((reviewObj)=>{
        response.status(200).send({reviewObj})
    })
    .catch((err)=>{
        next(err)
    })
})

const getComments = ((request, response, next)=>{
    const { reviewId } = request.params;

    getCommentsById(reviewId).then((comments)=>{
        response.status(200).send({comments});
    })
    .catch((err)=>{
        next(err)
    })
})

const addComments = ((request, response, next) =>{
    const {body} = request;
    const { reviewID } =  request.params;
    
        writeComment(reviewID, body).then((newComment)=>{
        response.status(201).send({addedComment : newComment})
    })
    .catch((err)=>{
        next(err)
    })
})


const patchVotes =((request, response,next)=>{
    
    const body = request.body;
    const {reviewId}=request.params;
   
    updateVotes(reviewId, body).then((updatedReview)=>{
        response.status(200).send({updatedReview})
    })
    .catch((err)=>{
        next(err)
    })
})

const getUsers = ((request, response)=>{   
    fetchUsers().then((allUsers)=>{
        response.status(200).send({allUsers})
    })
    .catch((err)=>{
        next(err)
    })
})

const deleteComment =((request, response, next)=>{
    const {commentId} = request.params;
   
    removeComment(commentId).then((results)=>{
            response.status(204).send()
    })   
    .catch((err)=>{
        next(err)
    })     
})


module.exports = {
    getApi, 
    getCategory, 
    getReviews, 
    getReviewById, 
    getComments, 
    patchVotes,
    getUsers ,
    addComments,
    deleteComment }
