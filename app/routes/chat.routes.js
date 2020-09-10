const { authJwt } = require("../middlewares");
const controller = require("../controllers/chat.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/chats/", [authJwt.profileAPIverifyToken],  controller.getChats);
  app.post("/api/chats/", [authJwt.profileAPIverifyToken], controller.setMessage);
  app.post("/api/chats/create", [authJwt.profileAPIverifyToken], controller.createChat);

};