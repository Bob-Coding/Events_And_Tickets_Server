const User = require("./model");
const { Router } = require("express");
const router = new Router();

router.get("/users", (request, response, next) => {
  const limit = request.query.limit || 9;
  const offset = request.query.offset || 0;

  User.findAndCountAll({ limit, offset })
    .then((result) =>
      response.send({ users: result.rows, total: result.count })
    )
    .catch((error) => next(error));
});

router.get("/users/:userID", (request, response) => {
  const id = request.params.userID;
  User.findByPk(id).then((user) => response.send(user));
});

module.exports = router;
