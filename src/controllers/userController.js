const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const User = require("../db/models/").User;
const stripe = require("stripe")("sk_test_d5TlBkmEL0dgFBMeK0yx14TT");

module.exports = {
   signUp(req, res, next) {
       res.render("users/signup");
   },

   create(req, res, next) {
       let newUser = {
           name: req.body.name,
           email: req.body.email,
           password: req.body.password,
           passwordConfirmation: req.body.passwordConfirmation
       };
       userQueries.createUser(newUser, (err, user) => {
           if (err) {
               req.flash("error", err);
               res.redirect("/users/signup");
           } else {

               passport.authenticate("local")(req, res, () => {
                   req.flash("notice", "You've successfully signed in!");
                   res.redirect("/");
               })
           }
       })
       
   },

    signInForm(req, res, next) {
        res.render("users/sign_in");
    },

    signIn(req, res, next) {
        passport.authenticate("local", {successFlash: "Welcome!"})(req, res, function () {
            if (!req.user) {
                req.flash("notice", "Sign in failed. Please try again.")
                res.redirect("/users/sign_in");
            } else {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/wikis");
            }
        })
    },

    signOut(req, res, next) {
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },

    show(req, res, next) {
        userQueries.getUser(req.params.id, (err, user) => {
            if(err || user === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
                res.render("users/show", {user});
            }
        });
    },

    showUpgradePage(req, res, next){
        userQueries.getUser(req.params.id, (err, user) => {
            if(err || user === undefined){
                req.flash("notice", "No user found with that ID.");
                res.render("/");
            } else {
                res.render("users/upgrade", {user});
            }
        });
    },

    upgrade(req, res, next){
        const token = req.body.stripeToken;
        const email = req.body.stripeEmail;
        User.findOne({
            where: {email: email}
        })
        .then((user) => {
            if(user){
                const charge = stripe.charges.create({
                    amount: 999,
                    currency: 'usd',
                    description: 'Upgrade to premium',
                    source: token,
                })
                .then((result) => {
                    if(result){
                        userQueries.toggleRole(user);
                        req.flash("notice", "Upgrade successful!");
                        res.redirect("/wikis");
                    } else {
                        req.flash("notice", "Upgrade unsuccessful.");
                        res.redirect("users/show", {user});
                    }
                })
            } else {
                req.flash("notice", "Upgrade unsuccessful.");
                res.redirect("users/upgrade");
            }
        })
    },
    
    showDowngradePage(req, res, next){
        userQueries.getUser(req.params.id, (err, user) => {
            if(err || user === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
                res.render("users/downgrade", {user});
            }
        });
    },

    downgrade(req, res, next){
        User.findOne({
            where: {id: req.params.id}
        })
        .then((user) => {
            if(user){
                userQueries.toggleRole(user);
                req.flash("notice", "Your downgrade was successful.");
                res.redirect("/wikis");
            } else {
                req.flash("notice", "Downgrade unsuccessful.");
                res.redirect("users/show", {user});
            }
        })
    }
}