module.exports = class NoUsersFoundError extends Error {
	constructor(message) {
		super(message);
	}
};