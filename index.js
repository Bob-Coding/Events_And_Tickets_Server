const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const middleware = cors();

app.use(middleware);
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.send("Events and tickets Home");
});

const authRouter = require("./Auth/router");
app.use(authRouter);

const userRouter = require("./User/router");
app.use(userRouter);

const eventRouter = require("./Event/router");
app.use(eventRouter);

const ticketRouter = require("./Ticket/router");
app.use(ticketRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`"Listening on port:" ${port}`));
