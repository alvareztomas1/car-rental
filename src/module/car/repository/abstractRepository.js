const AbstractRepositoryError = require("./error/abstractRepositoryError");

module.exports = class AbstractRepository {
	constructor(){
		if(new.target === AbstractRepositoryError){
			throw new AbstractRepositoryError();
		}
    
	}
};