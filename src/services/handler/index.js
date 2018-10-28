module.exports = {
  handleEntityNotFound: function (res) {
    return function (entity) {
      if (!entity) {
        res.status(404).end();
        return null;
      }
      return entity;
    };
  },
  respondWithResult: function (res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
      if (entity) {
        return res.status(statusCode).json(entity);
      }
      return null;
    };
  },
  handleError: function (res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
      res.status(statusCode).send(err.message);
      // res.status(statusCode).send(err);

    };
  }
};