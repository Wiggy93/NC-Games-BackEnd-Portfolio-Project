const customErrorHandler = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

const stringInsteadOfNumber = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      message:
        "Bad Request - expected a number and got text e.g. received three instead of 3",
    });
  } else {
    next(err);
  }
};

const notFound = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "Not Found" });
  } else {
    next(err);
  }
};

const missingFields = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({
      message: "Missing required fields in comment (username and/or comment)",
    });
  } else {
    next(err);
  }
};

const serverError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};

module.exports = {
  customErrorHandler,
  stringInsteadOfNumber,
  notFound,
  missingFields,
  serverError,
};
