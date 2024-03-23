module.exports = class UserIdNotDefinedError extends Error {
	constructor(message) {
		super(message);
	}
};