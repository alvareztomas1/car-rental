const { Sequelize } = require("sequelize");
const UserRepository = require("../userRepository");
const UserModel = require("../../model/userModel");
const ReserveModel = require("../../../reserve/model/reserveModel");
const User = require("../../entity/user");
const UserNotFoundError = require("../error/userNotFoundError");
const CouldNotDeleteUser = require("../error/couldNotDeleteUser");
const UserIdNotDefinedError = require("../error/userIdNotDefinedError");

const sequelizeInstance = new Sequelize("sqlite::memory", {
	logging: false
});
let repository;

const userSample = new User({
	names: "user",
	surnames: "user surnames",
	personalIdType: "Passport",
	personalIdNumber: "12345678",
	nationality: "Argentinean",
	email: "user@email.com",
	phone: "+12 3456-7890",
	birthdate: "2000-01-01",
	address: "User address"
});

beforeAll(async () => {
	const userModel = UserModel.setup(sequelizeInstance);
	const reserveModel = ReserveModel.setup(sequelizeInstance);

	repository = new UserRepository(userModel, reserveModel);
});

beforeEach(async () => {
	try{
		await sequelizeInstance.sync({ force: true });
	}catch(e){
		throw e;
	}
});


describe("getAll method", () => {
	test("getAll returns an array with a car list", async () => {

		const NEW_AUTOGENERATED_ID = 1;
		const newUser = await repository.save(userSample);
		expect(newUser.id).toEqual(NEW_AUTOGENERATED_ID);

		await expect(repository.getAll()).resolves.toEqual([newUser]);
	});
	test("getAll returns falls when doens't get any car", async () => {
		await expect(repository.getAll()).resolves.toEqual(false);
	});
});

describe("getById method", () => {
	test("getById returns an user when founds an user with the received id", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newUser = await repository.save(userSample);

		expect(newUser.id).toEqual(NEW_AUTOGENERATED_ID);

		await expect(repository.getById(newUser.id)).resolves.toEqual(newUser);
	});
	test("getById throws an error when the received id is invalid", async () => {
		await expect(repository.getById(undefined)).rejects.toThrow (UserIdNotDefinedError);
	});
	test("getById throws an error when doesn't found the user", async () => {
		await expect(repository.getById(3)).rejects.toThrow (UserNotFoundError);
	});
});

describe("save method", () => {
	test("creates an user when it doesn't have an id", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newUser = await repository.save(userSample);

		expect(newUser.id).toEqual(NEW_AUTOGENERATED_ID);
	});
	test("edits an user when it has an id", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newUser = await repository.save(userSample);
		expect(newUser.id).toEqual(NEW_AUTOGENERATED_ID);

		newUser.names = "edited user names";
		const modifiedUser = await repository.save(newUser);
		expect(modifiedUser.names).toEqual("edited user names");
		expect(modifiedUser.id).toEqual(newUser.id);
	});
});

describe("delete method", () => {
	test("returns a backup of the deleted user", async () => {
		const NEW_AUTOGENERATED_ID = 1;
		const newCar = await repository.save(userSample);
		expect(newCar.id).toEqual(NEW_AUTOGENERATED_ID);

		const deletedUser = await repository.delete(newCar.id);
		expect(deletedUser).toEqual(newCar);
	});
	test("throws an error when receives an invalid id", async () => {
		await expect(repository.delete(undefined)).rejects.toThrow(UserIdNotDefinedError);
	});
	test("throws an error if the user has a reservation", async () => {
		const fakeReserve = {
			user: {
				id: 1
			}
		};
		repository.reserveModel.findOne = jest.fn(() => fakeReserve);

		const NEW_AUTOGENERATED_ID = 1;
		const newUser = await repository.save(userSample);
		expect(newUser.id).toEqual(NEW_AUTOGENERATED_ID);

		await expect(repository.delete(newUser.id)).rejects.toThrow(CouldNotDeleteUser);
	});
});