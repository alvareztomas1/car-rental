const UserController = require("./controller/userController");
const UserService = require("./service/userService");
const UserRepository = require("./repository/userRepository");
const UserModel = require("./model/userModel");

function init(app, container){
	const controller = container.get("UserController");
	controller.configureRoutes(app);
	
}

module.exports = {
	init,
	UserController,
	UserService,
	UserRepository,
	UserModel
};