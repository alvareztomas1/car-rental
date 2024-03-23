module.exports = class CarNotDefinedError extends Error {
	constructor(message){
		super(message);
	}
};