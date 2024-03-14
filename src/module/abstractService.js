const AbstractServiceError = require("./error/abstractServiceError");

module.exports = class AbstractService{
	constructor(){
		if(new.target === AbstractService){
			throw new AbstractServiceError();
		}
	}
};