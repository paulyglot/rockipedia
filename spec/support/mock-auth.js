module.exports = {

    // #1
    fakeIt(app) {
        let role, id, name, email;

        function middleware(req, res, next) {

            role = req.body.role || role;
            id = req.body.userId || id;
            name = req.body.name || name;
            email = req.body.email || email;

            if (id && id != 0) {
                req.user = {
                    "id": id,
                    "name": name,
                    "email": email,
                    "role": role
                };
            } else if (id == 0) {
                delete req.user;
            }

            if (next) {
                next()
            }
        }

        function route(req, res) {
            res.redirect("/")
        }

        app.use(middleware)
        app.get("/auth/fake", route)
    }
}