var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const descriptions = [
    "A small bird perched gracefully on a slender branch...",
    "A tall palm tree stands proudly on a sandy beach...",
    "A breathtaking night sky filled with twinkling stars...",
    "A vibrant hot air balloon drifts gracefully above a desert...",
    "A soft pink sunset paints the sky...",
    "A delicate cherry blossom branch stretches gracefully...",
    "A velvety pink rose blooms in full glory...",
    "A misty mountain range looms in the distance...",
    "A vibrant orange jellyfish drifts gracefully...",
    "A vibrant hummingbird hovers delicately in the air...",
    "A cozy cabin sits nestled beside a serene freshwater lake...",
    "Two delicate flowers with vibrant orange petals...",
  ];

  res.render("index", { title: "Friendly Software Gallery", descriptions });
});

module.exports = router;
