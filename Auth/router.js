const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const auth = require("./middleware");
const router = new Router();
const User = require("../User/model");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  User.findOne({ where: { email: req.body.email } }).then((data) => {
    if (data) {
      res.status(400).send({
        message: "This email is already in use",
      });
    } else {
      User.create(user)
        .then((user) =>
          res.send({ userId: user.id, jwt: toJWT({ userId: user.id }) })
        )
        .catch((error) => next(error));
    }
  });
});

router.post("/login", (request, response, next) => {
  const email = request.body.email;
  const password = request.body.password;

  if (!email || !password) {
    response.status(400).send({
      message: "Email or password incorrect.",
    });
  } else {
    User.findOne({
      where: {
        email: request.body.email,
      },
    })
      .then((entity) => {
        if (!entity) {
          response.status(400).send({
            message: "Email was incorrect",
          });
        } else if (bcrypt.compareSync(request.body.password, entity.password)) {
          response.send({
            userId: entity.id,
            jwt: toJWT({ userId: entity.id }),
          });
        } else {
          response.status(400).send({
            message: "Password was incorrect",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        response.status(500).send({
          message: "Something went wrong",
        });
      });
  }
});

router.get("/secret-endpoint", auth, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`,
  });
});

module.exports = router;
