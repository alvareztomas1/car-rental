const { Sequelize } = require("sequelize");
const CarModel = require("../carModel");

const sequelizeInstance = new Sequelize("sqlite::memory");

test("After setting up CarModel and syncronize model. Car tables exists", async () => {
	CarModel.setup(sequelizeInstance);
	await CarModel.sync({ force: true });
	expect(await CarModel.findAll()).toEqual([]);
});
