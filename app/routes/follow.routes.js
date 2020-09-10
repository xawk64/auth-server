const { authJwt } = require("../middlewares");
const controller = require("../controllers/follow.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post ("/api/follow", [authJwt.followAPIverifyToken], controller.follow)

  app.delete ("/api/follow", [authJwt.followAPIverifyToken], controller.unfollow)
};