module.exports = class ReserveNotDefinedError extends Error{
	constructor(message){
		super(message);
	}
};