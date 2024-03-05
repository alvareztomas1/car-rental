const AbstractRepository = require("../../car/repository/abstractRepository");
const ReserveNotFoundError = require("./error/reserveNotFoundError");

module.exports = class ReserveRepository extends AbstractRepository {
	constructor(mainDataBaseAdapter) {
		super();
		this.mainDataBaseAdapter = mainDataBaseAdapter;
	}


	getById(id) {
		const reserve = this.mainDataBaseAdapter.prepare(
			`SELECT 
			id,
			fk_car_id,
			since,
			until
			FROM reserves 
			WHERE id = ?;`
		).get(id);

		
		if(reserve === undefined) {
			throw new ReserveNotFoundError("Reserve not found");
		}

		return fromDbToEntity(reserve);
	}
	
};

