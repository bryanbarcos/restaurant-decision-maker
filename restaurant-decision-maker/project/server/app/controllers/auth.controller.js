const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user1 = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }

    else {
      user1.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    
        else {
          res.send({ message: "User was registered successfully!" });
        }
      });
    }
})};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("restaurants", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var restaurants = [];

      for (let i = 0; i < user.restaurants.length; i++) {
        restaurants.push("RESTAURANTS_" + user.restaurants[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        restaurants: restaurants,
        accessToken: token
      });
    });
};
