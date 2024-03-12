const AbstractRepositoryError = require("./error/abstractRepositoryError");

module.exports = class AbstractRepository {
	constructor(){
		if(new.target === AbstractRepository){
			throw new AbstractRepositoryError();
		}
	}
};