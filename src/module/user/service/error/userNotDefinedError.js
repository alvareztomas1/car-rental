module.exports = class UserNotDefinedError extends Error{
	constructor(message){
		super(message);
	}
};