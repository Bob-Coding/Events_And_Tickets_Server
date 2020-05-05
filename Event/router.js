const Event = require("./model");
const User = require("../User/model");
const auth = require("../auth/middleware");
const { toData } = require("../Auth/jwt");
const Ticket = require("../Ticket/model");
const { Router } = require("express");

const router = new Router();

router.get("/events", (req, res) => {
  const limit = req.query.limit || 12;
  const offset = req.query.offset || 0;
  Event.findAndCountAll({ limit, offset }).then((result) => {
    res.json({
      events: result.rows,
      total: result.count,
    });
  });
});

router.get("/events/:eventID", (req, res) => {
  const id = req.params.eventID;
  Event.findAll({
    where: { id },
    include: [
      {
        model: Ticket,
      },
      {
        model: User,
      },
    ],
  }).then((event) => res.send(event));
});

router.post("/events", auth, (req, res, next) => {
  const auth = req.headers.authorization.split(" ");
  const jwt = auth[1];
  const data = toData(jwt);

  console.log("data.userId:", data.userId);
  Event.create({
    userId: data.userId,
    ...req.body,
  })
    .then((data) => res.send(data))
    .catch((error) => next(error));
});

router.put("/events/:eventID", auth, (req, res) => {
  const event = {
    name: req.body.name,
    description: req.body.description,
    picture: req.body.picture,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };
  Event.update(event, {
    where: {
      id: req.params.eventID,
    },
  }).then(() => res.json(event));
});

router.delete("/events/:eventID", auth, (req, res, next) => {
  Event.findByPk(req.params.eventID)
    .then((event) => {
      return event.destroy();
    })
    .then(() => {
      res.send("/events");
    });
});

module.exports = router;
