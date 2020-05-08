const User = require("../User/model");
const Ticket = require("./model");
const Event = require("../Event/model");
const auth = require("../Auth/middleware");
const { toData } = require("../Auth/jwt");
const { Router } = require("express");

const router = new Router();

router.get("/tickets", (req, res) => {
  const limit = req.query.limit || 12;
  const offset = req.query.offset || 0;
  Ticket.findAndCountAll({ limit, offset }).then((result) => {
    res.json({
      tickets: result.rows,
      total: result.count,
    });
  });
});

router.get("/events/:eventID/tickets", (req, res) => {
  const eventId = req.params.eventID;
  Ticket.findAll({
    where: { eventId },
  }).then((ticket) => res.send(ticket));
});

router.get("/users/:userID/tickets", (req, res) => {
  const userId = req.params.userID;
  Ticket.findAll({
    where: { userId: userId },
  }).then((result) => res.send(result));
});

router.get("/tickets/:ticketID", (req, res) => {
  const id = req.params.ticketID;
  Ticket.findAll({
    where: { id },
    include: [
      {
        model: User,
      },
    ],
  }).then((ticket) => res.send(ticket[0]));
});

router.post("/tickets", auth, (req, res, next) => {
  const auth = req.headers.authorization.split(" ");
  const jwt = auth[1];
  const data = toData(jwt);

  Ticket.create(
    {
      picture: req.body.picture,
      price: req.body.price,
      description: req.body.description,
      userId: data.userId,
      eventId: req.body.eventId,
    },
    {
      include: [
        {
          model: Event,
        },
      ],
    }
  )
    .then((data) => {
      res.send(data);
    })
    .catch((error) => next(error));
});

module.exports = router;
