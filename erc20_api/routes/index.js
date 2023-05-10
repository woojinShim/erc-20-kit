var express = require("express");
var router = express.Router();

const title = "API SERVER";

/**
 * 처음화면
 */
router.get("/", async function (req, res, next) {
  res.render("index", {
    title: title,
  });
});

module.exports = router;
