module.exports = class CarNotFoundError extends Error {
	constructor(message) {
		super(message);
	}
};