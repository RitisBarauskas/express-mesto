const express = require("express");

const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");

const users = require("./routes/users");
const cards = require("./routes/cards");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const { validationSignIn, validationSignUp } = require("./utils/validations");

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.post("/signin", validationSignIn, login);
app.post("/signup", validationSignUp, createUser);

app.use(auth);
app.use("/users", users);
app.use("/cards", cards);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
