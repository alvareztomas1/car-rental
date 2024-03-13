const AbstractService = require("./abstractService");
const UserNotDefinedError = require("./error/userNotDefinedError");

module.exports = class UserService extends AbstractService {
	constructor(userRespotiroy) {
		super();
		this.userRespotiroy = userRespotiroy;
	}

	getAll(){
		return this.userRespotiroy.getAll();
	}

	save(user) {
		
		if (user === undefined) {
			throw new UserNotDefinedError("User is not defined");
		}

		return this.userRespotiroy.save(user);
	}
};