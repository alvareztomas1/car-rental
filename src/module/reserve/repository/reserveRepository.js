const AbstractRepository = require("../../car/repository/abstractRepository");
const { fromDbToReserveEntity } = require("../mapper/reserveMapper");
const { fromDbToCarEntity } = require("../../car/mapper/carMapper");
const ReserveNotFoundError = require("./error/reserveNotFoundError");

module.exports = class ReserveRepository extends AbstractRepository {
	constructor(mainDataBaseAdapter) {
		super();
		this.mainDataBaseAdapter = mainDataBaseAdapter;
	}


	getAll(){
		const reserves = this.mainDataBaseAdapter.prepare(
			`SELECT 
			reserves.id AS reserve_id,
			reserves.fk_car_id,
			reserves.since,
			reserves.until,
			cars.id AS car_id,
			cars.brand,
			cars.model,
			cars.car_year,
			cars.transmission,
			cars.seats,
			cars.doors,
			cars.air_conditioning,
			cars.trunk,
			cars.fuel,
			cars.price,
			cars.unlimited_mileage,
			cars.car_image,
			cars.car_description,
			cars.reserved
			FROM reserves
			JOIN cars
			ON reserves.fk_car_id = cars.id
			`).all();
		
		if(!reserves.length){
			return false;
		}else{
			const result = reserves.map((reserve) => {
				const carData = fromDbToCarEntity({
					id: reserve.car_id,
					brand: reserve.brand,
					model: reserve.model,
					car_year: reserve.car_year,
					transmission: reserve.transmission,
					seats: reserve.seats,
					doors: reserve.doors,
					air_conditioning: reserve.air_conditioning,
					trunk: reserve.trunk,
					fuel: reserve.fuel,
					price: reserve.price,
					unlimited_mileage: reserve.unlimited_mileage,
					car_image: reserve.car_image,
					car_description: reserve.car_description,
					reserved: reserve.reserved
	
				});
	
				const reserveData = {
					id: reserve.reserve_id,
					car: carData,
					since: reserve.since,
					until: reserve.until
				};
				return fromDbToReserveEntity(reserveData);
			});
	
			
			return result;
		}

		
	
	}
	getById(id) {
		const statement = this.mainDataBaseAdapter.prepare(
			`SELECT 
			reserves.id AS reserve_id,
			reserves.fk_car_id,
			reserves.since,
			reserves.until,
			cars.id AS car_id,
			cars.brand,
			cars.model,
			cars.car_year,
			cars.transmission,
			cars.seats,
			cars.doors,
			cars.air_conditioning,
			cars.trunk,
			cars.fuel,
			cars.price,
			cars.unlimited_mileage,
			cars.car_image,
			cars.car_description,
			cars.reserved
			FROM reserves
			JOIN cars
			ON reserves.fk_car_id = cars.id 
			WHERE reserves.id = ?;`
		);

		const reserve = statement.get(id);

		if (reserve === undefined) {
			throw new ReserveNotFoundError("Reserve not found");
		}

		const carData = fromDbToCarEntity({
			id: reserve.car_id,
			brand: reserve.brand,
			model: reserve.model,
			car_year: reserve.car_year,
			transmission: reserve.transmission,
			seats: reserve.seats,
			doors: reserve.doors,
			air_conditioning: reserve.air_conditioning,
			trunk: reserve.trunk,
			fuel: reserve.fuel,
			price: reserve.price,
			unlimited_mileage: reserve.unlimited_mileage,
			car_image: reserve.car_image,
			car_description: reserve.car_description,
			reserved: reserve.reserved
		});

		const reserveData = {
			id: reserve.reserve_id,
			car: carData,
			since: reserve.since,
			until: reserve.until
		};

		return fromDbToReserveEntity(reserveData);
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
			const reserveStatementValues = [reserve.car.id, reserve.since, reserve.until];
			reserveStatement.run(reserveStatementValues);

			const reserveCar = this.mainDataBaseAdapter.prepare("UPDATE OR ROLLBACK cars SET reserved = 1 WHERE id = ?;");
			const reserveCarValues = [reserve.car.id];
			reserveCar.run(reserveCarValues);

			const commitTransaction = this.mainDataBaseAdapter.prepare("COMMIT;");
			const reserveResult = commitTransaction.run();

			id = reserveResult.lastInsertRowid;
		}

		return this.getById(id);
	}

	delete(id) {
		const reserve = this.getById(id);

		if(reserve === undefined){
			throw new ReserveNotFoundError("Reserve not found");
		}

	
		const transaction = this.mainDataBaseAdapter.prepare("BEGIN TRANSACTION;");
		transaction.run();

		const deleteReserveStatement = this.mainDataBaseAdapter.prepare("DELETE FROM reserves WHERE id = ?;");
		const deleteReserveStatementValues = [id];
		deleteReserveStatement.run(deleteReserveStatementValues);

		const unreserveCarStatement= this.mainDataBaseAdapter.prepare("UPDATE cars SET reserved = 0 WHERE id = ?;");
		const unreserveCarStatementValues = [reserve.car.id];
		unreserveCarStatement.run(unreserveCarStatementValues);

		const commitTransaction = this.mainDataBaseAdapter.prepare("COMMIT;");
		commitTransaction.run();

		return reserve;
	}
};

