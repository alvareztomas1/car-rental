const AbstractRepository = require("../../car/repository/abstractRepository");
const { fromDbToEntity } = require("../mapper/reserveMapper");
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


		if (reserve === undefined) {
			throw new ReserveNotFoundError("Reserve not found");
		}

		return fromDbToEntity(reserve);
	}
	save(reserve) {
		let id;
		const isUpdate = reserve.id;

		if (isUpdate) {
			// TODO: EDIT RESERVE
		} else {
			const transaction = this.mainDataBaseAdapter.prepare("BEGIN TRANSACTION;");
			transaction.run();

			const reserveStatement = this.mainDataBaseAdapter.prepare("INSERT OR ROLLBACK INTO reserves (fk_car_id, since, until) VALUES (?, ?, ?);");
			const reserveStatementValues = [reserve.carId, reserve.since, reserve.until];
			reserveStatement.run(reserveStatementValues);

			const reserveCar = this.mainDataBaseAdapter.prepare("UPDATE OR ROLLBACK cars SET reserved = 1 WHERE id = ?;");
			const reserveCarValues = [reserve.carId];
			reserveCar.run(reserveCarValues);

			const commitTransaction = this.mainDataBaseAdapter.prepare("COMMIT;");
			const reserveResult = commitTransaction.run();

			id = reserveResult.lastInsertRowid;
		}

		return this.getById(id);
	}
};

