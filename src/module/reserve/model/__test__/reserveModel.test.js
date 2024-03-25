const { Sequelize } = require("sequelize");
const ReserveModel = require("../reserveModel");
const CarModel = require("../../../car/model/carModel");
const UserModel = require("../../../user/model/userModel");

const sequelizeInstance = new Sequelize("sqlite::memory");


test("after syncronizing reserve model, a reserve can be created", async () => {
	const reserveModel = ReserveModel.setup(sequelizeInstance);
	const carModel = CarModel.setup(sequelizeInstance);
	const userModel = UserModel.setup(sequelizeInstance);

	ReserveModel.setUpAssociations(carModel, userModel);

	await reserveModel.sync({ force: true });
	expect(await reserveModel.findAll()).toEqual([]);
});
