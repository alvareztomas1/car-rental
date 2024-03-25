const UserModel = require("../userModel");
const { Sequelize } = require("sequelize");

const sequelizeInstance = new Sequelize("sqlite::memory", {
	logging: false
});

test("after setting up UserModel and syncronize it, user table exists", async () => {
	UserModel.setup(sequelizeInstance);
	await UserModel.sync({ force: true });
	expect(await UserModel.findAll()).toEqual([]);
});
