/**
 * A module with the crud operation for a users favourite restaurants and tags
*/

const db = require("../models");
const User = db.user;


// add a restaurant without tags
exports.addRestaurant = (req, res, next) => {
     var restaurantName = req.body.name;
     User.findOneAndUpdate({
        username: req.body.username},
        { $push: { restaurants: { name: restaurantName, tags: [] }}},
        { safe: true, upsert: true, useFindAndModify: false },
        function(err, user) {
            if(err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
              }

            var restaurants = [];

            for (let i = 0; i < user.restaurants.length; i++) {
                restaurants.push(user.restaurants[i].name);
            }  

            restaurants.push(restaurantName);

            res.status(200).send({
            id: user._id,
            username: user.username,
            restaurants: restaurants,
            });
        });
};

// add tags to an existing restaurant
exports.addTags = (req, res, next) => {
    var restaurantName = req.body.name;
    User.updateOne(
       { "username": req.body.username, "restaurants.name": restaurantName },
       { $addToSet: { "restaurants.$.tags": { $each: req.body.tags }}},
       { safe: true, upsert: true, useFindAndModify: false },
       function(err, user) {
           if(err) {
               res.status(500).send({ message: err });
               return;
           }

           if (!user) {
               return res.status(404).send({ message: "User Not found." });
             }

           res.status(200).send({
                message: "Tag(s) added successfully"
           });
       }
    );
};

 // add a restaurant with some tags
exports.addRestaurantWithTags = (req, res, next) => {
    var restaurantName = req.body.name;
    User.findOneAndUpdate({
       username: req.body.username},
       { $push: { restaurants: { name: restaurantName, tags: req.body.tags }}},
       { safe: true, upsert: true, useFindAndModify: false },
       function(err, user) {
           if(err) {
               res.status(500).send({ message: err });
               return;
           }

           if (!user) {
               return res.status(404).send({ message: "User Not found." });
             }

           var restaurants = [];

           for (let i = 0; i < user.restaurants.length; i++) {
               restaurants.push(user.restaurants[i].name);
           }  

           restaurants.push(restaurantName);

           res.status(200).send({
           id: user._id,
           username: user.username,
           restaurants: restaurants,
           });
       });
};

// delete a restaurant
exports.deleteRestaurant = (req, res, next) => {
    var restaurantName = req.body.name;
    User.updateOne(
       { "username": req.body.username, "restaurants.name": restaurantName },
       { $pull: { "restaurants": { "name": restaurantName }}},
       { safe: true, upsert: true, useFindAndModify: false },
       function(err, user) {
           if(err) {
               res.status(500).send({ message: err });
               return;
           }

           if (!user) {
               return res.status(404).send({ message: "User Not found." });
             }

           res.status(200).send({
                message: "Restaurant deleted successfully"
           });
       });
};

// get users restaurants and tags
exports.getRestaurants = (req, res) => {
    User.findOne({ username: req.query.username }, {restaurants:1, _id:0})
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            res.json(user.restaurants)
        }
    })
}

