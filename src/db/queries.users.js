const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    createUser(newUser, callback) {

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
                name: newUser.name,
                email: newUser.email,
                password: hashedPassword
            })
            .then((user) => {
                const msg = {
                    to: user.email,
                    from: 'pabrower@icloud.com',
                    subject: 'This is confirmation of your Blocipedia account creation',
                    html: '<div><h3>Welcome to Blocipedia!</h3><p>Your account is now confirmed</p></div>',
                };
                sgMail.send(msg);
                callback(null, user);
            })
            .catch((err) => {
                callback(err);
            })
    },

    getUser(id, callback) {
        let result = {};
        User.findById(id)
            .then((user) => {
                if (!user) {
                    callback(404);
                } else {
                    result["user"] = user;
                    Collaborator.scope({
                            method: ["userCollaborationsFor", id]
                        }).all()
                        .then((collaborations) => {
                            result["collaborations"] = collaborations;
                            callback(null, result);
                        })
                        .catch((err) => {
                            callback(err);
                        })
                }
            })
    },

    /*toggleRole(user){
        User.findOne({
            where: {email: user.email}
        })
        .then((user) => {
            if(user.role == "standard"){
                user.update({
                    role: "premium"
                });
            } else if(user.role == "premium"){
                user.update({
                    role: "standard"
                });
            }
        })
    }*/

    upgrade(id, callback) {
        return User.findById(id)
            .then(user => {
                if (!user) {
                    return callback('User does not exist!');
                } else {
                    return user.updateAttributes({
                        role: 'premium'
                    });
                }
            })
            .catch(err => {
                callback(err);
        });
    },

    downgrade(id, callback) {
        return User.findById(id)
            .then(user => {
                if (!user) {
                    return callback('User does not exist!');
                } else {
                    return user.updateAttributes({
                        role: 'standard'
                    });
                }
            })
            .catch(err => {
                callback(err);
            });
        }
}