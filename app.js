var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

//Requiring routes
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(flash());

// seedDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require("moment");
//Passport Configuration
app.use(
  require("express-session")({
    secret: "YelpCamp project Made by SR",
    saveUninitialized: false,
    resave: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Yelpcamp Server Has Started!");
});
