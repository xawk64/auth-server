const { authJwt } = require("../middlewares");
const controller = require("../controllers/posts.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/posts/:profileId", [authJwt.profileAPIverifyToken],  controller.getPosts);

  app.post("/api/posts/", [authJwt.profileAPIverifyToken], controller.setPost);

  app.post("/api/posts/like/", [authJwt.profileAPIverifyToken], controller.putLike);

};