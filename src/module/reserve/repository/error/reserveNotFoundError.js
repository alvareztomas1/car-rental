module.exports = class ReserveNotFoundError extends Error {
	constructor(message) {
		super(message);
	}
};