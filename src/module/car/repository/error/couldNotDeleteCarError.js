module.exports = class CouldNotDeleteCarError extends Error {
	constructor(message){
		super(message);
	}
};