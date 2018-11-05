require("dotenv").config();
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const expressValidator = require("express-validator");

module.exports = {
  init(app, express){
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "assets")));
    app.use(logger('dev'));
    app.use(expressValidator());
  }
};