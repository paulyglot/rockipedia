const User = require("./models").User;
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
    }

}