require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
const MemoryStore = require("memorystore")(session);

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
var createRouter = require("./routes/create");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
var sess = {
  secret: "jfbr8021br0r121",
  resave: false,
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  saveUninitialized: true,
  cookie: {}, // 180초
};
app.use(session(sess));

app.use(bodyParser.json()); // json 등록
app.use(bodyParser.urlencoded({ extended: false })); // URL-encoded 등록

app.use("/", indexRouter);
app.use("/create", createRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
