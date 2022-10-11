const { Router } = require("express");
const userRoute = Router();
const user = require("../controllers/user");
userRoute.post("/user", user.createUser);
userRoute.get("/user", user.usersList);
userRoute.get("/user/:id", user.singleUserList);
userRoute.post("/user/login", user.userLogin);
userRoute.get("/user/get/count", user.userCount);

module.exports = userRoute;
