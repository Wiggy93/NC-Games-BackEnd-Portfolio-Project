const db = require("../db/connection");
const fsPromises = require("fs/promises");

const fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};

const fetchReviews = (
  categories,
  category,
  sort_by = "created_at",
  order = "desc"
) => {
  const acceptedCategories = categories.map((category) => {
    return category.slug;
  });

  const acceptedSortBys = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  const queryValues = [];

  let queryStr = `SELECT reviews.*, COUNT (comments.comment_id) AS comment_count  
    FROM reviews 
    LEFT JOIN comments ON comments.review_id=reviews.review_id`;

  if (category !== undefined) {
    if (!acceptedCategories.includes(category.toLowerCase())) {
      return Promise.reject({
        status: 400,
        message: "Bad Request - invalid category filter",
      });
    } else {
      queryValues.push(category);
      queryStr += ` WHERE reviews.category = $1`;
    }
  }

  if (
    !acceptedSortBys.includes(sort_by.toLowerCase()) ||
    !["asc", "desc"].includes(order.toLowerCase())
  ) {
    return Promise.reject({
      status: 400,
      message: "Bad Request - invalid sort function",
    });
  }

  queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

const fetchReviewById = (result, reviewId) => {
  const onlyNumber = /^\d+$/.test(reviewId);

  if (onlyNumber === false) {
    return Promise.reject({
      status: 400,
      message:
        "Bad Request - expected a number and got text e.g. received three instead of 3",
    });
  }

  const findReviewById = result.filter(
    (objects) => objects.review_id == reviewId
  );

  if (findReviewById.length === 0) {
    return Promise.reject({ status: 404, message: "review id does not exist" });
  } else {
    return findReviewById;
  }
};

const getCommentsById = (reviewId) => {
  const queryStr = `SELECT * FROM comments WHERE review_id=$1 ORDER BY created_at ASC`;

  return db.query(queryStr, [reviewId]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, message: "id does not exist" });
    } else {
      return result.rows;
    }
  });
};

const updateVotes = (reviewId, body) => {
  const queryStr = `UPDATE reviews 
    SET votes = votes + $1
    WHERE review_id IN   
    (SELECT review_id FROM reviews WHERE review_id=$2)
    RETURNING*;`;

  return db.query(queryStr, [body.inc_votes, reviewId]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        message: "review id does not exist",
      });
    } else {
      return result.rows[0];
    }
  });
};

const updateCommentVotes = (commentId, body) => {
  const queryStr = `UPDATE comments 
    SET votes = votes + $1
    WHERE comment_id IN   
    (SELECT comment_id FROM comments WHERE comment_id=$2)
    RETURNING*;`;

  return db.query(queryStr, [body.inc_votes, commentId]).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({
        status: 404,
        message: "comment id does not exist",
      });
    } else {
      return result.rows[0];
    }
  });
};

const fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then((result) => {
    return result.rows;
  });
};

const writeComment = (reviewID, body) => {
  const queryStr = `INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    
    RETURNING*;`;

  return db
    .query(queryStr, [body.username, body.body, reviewID])

    .then((result) => {
      return result.rows;
    });
};

const removeComment = (commentId) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id=$1`, [commentId])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "id does not exist" });
      }
    })
    .then(() => {
      return db.query(
        `
        DELETE FROM comments 
        WHERE comment_id = $1
        RETURNING*    
        `,
        [commentId]
      );
    });
};

const fetchUserInfo = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Username Not Found" });
      }
      return result.rows;
    });
};

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  getCommentsById,
  fetchUsers,
  updateVotes,
  writeComment,
  removeComment,
  updateCommentVotes,
  fetchUserInfo,
};
