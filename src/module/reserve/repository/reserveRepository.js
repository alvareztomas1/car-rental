const AbstractRepository = require("../../car/repository/abstractRepository");

module.exports = class ReserveRepository extends AbstractRepository {
	constructor(mainDataBaseAdapter){
		super();
		this.mainDataBaseAdapter = mainDataBaseAdapter;
	}
};

