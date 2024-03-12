const AbstractRepository = require("../../car/repository/abstractRepository");
const { fromModelToReserveEntity } = require("../mapper/reserveMapper");
const { fromModelToCarEntity } = require("../../car/mapper/carMapper");
const ReserveNotFoundError = require("./error/reserveNotFoundError");

module.exports = class ReserveRepository extends AbstractRepository {
	constructor(reserveModel, carModel) {
		super();
		this.reserveModel = reserveModel;
		this.carModel = carModel;
	}


	async getAll(){
		const reserves = await this.reserveModel.findAll({
			include: [{
				model: this.carModel,
				attributes: {exclude: ["created_at", "updated_at"]}
			}],
			attributes: {exclude: ["fk_car_id", "created_at", "updated_at"]}
		});
		if(reserves.length === 0){
			return false;
		}

		return reserves.map((reserve) => {
			const result = fromModelToReserveEntity(reserve.toJSON());
			result.car = fromModelToCarEntity(result.car);
			return result;
		});
		
	}
	async getById(id) {
		const reserve = await this.reserveModel.findByPk(id, {
			include: [{
				model: this.carModel,
				attributes: {exclude: ["created_at", "updated_at"]}
			}],
			attributes: {exclude: ["fk_car_id", "created_at", "updated_at"]}
		});

		if ( reserve === undefined ) {
			throw new ReserveNotFoundError("Reserve not found");
		}

		const result = fromModelToReserveEntity(reserve.toJSON());
		result.car = fromModelToCarEntity(result.car);

		return result;
	}
	async save(reserve) {

		const reserveToSave = {
			id: reserve.id ? reserve.id : null,
			fk_car_id: reserve.car.id,
			since: reserve.since,
			until: reserve.until,
			price_per_day: reserve.pricePerDay,
			total_price: reserve.totalPrice,
			payed: reserve.payed,
			payment_method: reserve.paymentMethod
		};
		
		const buildOptions = {
			isNewRecord: !reserve.id,
		};

		
		let reserveModel = this.reserveModel.build(reserveToSave, buildOptions);
		reserveModel = await reserveModel.save();
		
		const result = await this.getById(reserveModel.id);

		return result;
		
	}
	async delete(id) {
		const reserve = await this.getById(id);

		if(reserve === undefined){
			throw new ReserveNotFoundError("Reserve not found");
		}

		await this.reserveModel.destroy({
			where: { id }
		});

				
		return reserve;
	}

};

