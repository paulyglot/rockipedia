const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Welcome to Big Trees, as wiki for big tree lovers");
});

module.exports = router;