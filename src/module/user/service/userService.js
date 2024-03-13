const AbstractService = require("./abstractService");
const UserNotDefinedError = require("./error/userNotDefinedError");
const UserIdNotDefinedError = require("./error/userIdNotDefinedError");


module.exports = class UserService extends AbstractService {
	constructor(userRespotiroy) {
		super();
		this.userRespotiroy = userRespotiroy;
	}

	getAll(){
		return this.userRespotiroy.getAll();
	}

	getById(id){
		if(id === undefined){
			throw new UserIdNotDefinedError("User id not defined");
		}
		return this.userRespotiroy.getById(id);
	}

	save(user) {
		
		if (user === undefined) {
			throw new UserNotDefinedError("User is not defined");
		}

		return this.userRespotiroy.save(user);
	}

	delete(id) {

		if (id === undefined) {
			throw new UserIdNotDefinedError("User id is not defined");
		}

		return this.userRespotiroy.delete(id);
	}
};