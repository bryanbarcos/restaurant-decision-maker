const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const controller2 = require("../controllers/restaurants.controller");
const express = require("express");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * need to specify main page for loading !!!!
   */
  // app.get('/', function (req, res) {
  //   res.render('index', {});
  // });

  app.post("/api/auth/signup", controller.signup);

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/addRestaurant", controller2.addRestaurant);

  app.post("/api/addRestaurantWithTags", controller2.addRestaurantWithTags);

  app.post("/api/addTags", controller2.addTags);

  app.post("/api/deleteTags", controller2.deleteTags);

  app.post("/api/deleteRestaurant", controller2.deleteRestaurant);

  app.get("/api/auth/checkUsernameTaken", verifySignUp.checkDuplicateUsernameOrEmail);

  app.get("/api/getRestaurants", controller2.getRestaurants);

};
