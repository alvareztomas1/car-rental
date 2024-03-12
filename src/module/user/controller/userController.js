const AbstractController = require("./error/abstractControllerError");
module.exports = class UserController extends AbstractController{
	constructor(userService){
		super();
		this.ROUTE_BASE = "/user";
	}
};