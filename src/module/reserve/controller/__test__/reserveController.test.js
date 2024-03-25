const ReserveController = require("../reserveController");
const NoUsersFoundError = require("../error/noUsersFoundError");
const CarIdNotDefinedError = require("../error/carIdNotDefinedError");
const Reserve = require("../../entity/reserve");
const ReserveIdNotDefinedError = require("../error/reserveIdNotDefinedError");

const carServiceMock = {
	getById: jest.fn(() => { return { price: 20 }; })
};
const userServiceMock = {
	getAll: jest.fn(() => []),
	getById: jest.fn(() => { return {}; })
};
const reserveServiceMock = {
	getAll: jest.fn(() => []),
	getById: jest.fn(() => new Reserve({
		id: 1,
		car: { price: 20 },
		user: {},
		since: "1900-01-01",
		until: "1999-01-01",
		pricePerDay: 20,
		totalPrice: 100,
		payed: false,
		paymentMethod: "Cash"
	})),
	save: jest.fn(() => {
		return {
			id: 1,
			car: {
				brand: "toyota",
				model: "corolla",
				year: 2000
			},
		};
	}),
	delete: jest.fn(() => {
		return{
			id: 1,
			car:{
				brand: "toyota",
				model: "corolla",
				year: 2000
			}
		};
	}),
	edit: jest.fn(),
	calculateCost: jest.fn(() => 100),
	validate: jest.fn(() => { return {a: true}; })
};
const reqMock = {
	params: {
		id: 1
	},
	session: {
		messages: [],
		errors: []
	},
	body: {
		id: 1,
		"car-id": 1,
		"user-id": 1,
		since: "1900-01-01",
		until: "1999-01-01",
		"payment-method": "Cash"
	}
};
const reserveSampler = new Reserve({
	id: 1,
	car: { price: 20 },
	user: {},
	since: "1900-01-01",
	until: "1999-01-01",
	pricePerDay: 20,
	totalPrice: 100,
	payed: false,
	paymentMethod: "Cash"
});
const resMock = {
	render: jest.fn(),
	redirect: jest.fn()
};

const controller = new ReserveController(carServiceMock, reserveServiceMock, userServiceMock);

afterEach(() => {
	jest.clearAllMocks();
});

describe("configureRoutes method", () => {
	test("configures the correct routes", () => {
		const app = {
			get: jest.fn(),
			post: jest.fn()
		};
		controller.configureRoutes(app);
	});
});
describe("index method", () => {
	test("renders reserve list", async () => {
		await controller.index(reqMock, resMock);

		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("reserve/view/index.html", {
			reserves: [],
			pageTitle: "Cars reserves"
		});
	});
});
describe("create method", () => {
	test("renders reserves form", async () => {
		await controller.create(reqMock, resMock);

		expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(carServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("reserve/view/form/form.html", {
			car: { price: 20 },
			users: [],
			pageTitle: "Reserve a car"
		});
	});
	test("throws an error when cannot get any user", async () => {
		userServiceMock.getAll = jest.fn(() => undefined);

		await expect(controller.create(reqMock, resMock)).rejects.toThrow(NoUsersFoundError);

		userServiceMock.getAll = jest.fn(() => []);
	});
	test("throws an error when receives an invalid car id", async () => {
		reqMock.params.id = undefined;

		await expect(controller.create(reqMock, resMock)).rejects.toThrow(CarIdNotDefinedError);

		reqMock.params.id = 1;
	});
	test("redirects to '/' when couldn't get the car", async () => {
		carServiceMock.getById = jest.fn(() => Promise.rejects());

		try{
			await controller.create(reqMock, resMock);
		}catch(e){
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/");
			expect(reqMock.session.errors).toEqual([e.message, e.stack]);
		}

		carServiceMock.getById = jest.fn(() => { return { price: 20 }; });
	});
});
describe("save method", () => {
	test("redirects to '/' after editing the reserve", async () => {
		await controller.save(reqMock, resMock);
		
		expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(userServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(carServiceMock.getById).toHaveBeenCalledWith(reqMock.body["car-id"]);
		expect(userServiceMock.getById).toHaveBeenCalledWith(reqMock.body["user-id"]);

		expect(reserveServiceMock.calculateCost).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.validate).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.save).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.save).toHaveBeenCalledWith(reserveSampler);


		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");

		expect(reqMock.session.messages).toEqual(["Reserve #1 of toyota corolla 2000 edited succesfully"]);

	});
	test("redirects to '/' after adding a reserve", async () => {
		reqMock.body.id = null;
		reserveSampler.id = null;

		await controller.save(reqMock, resMock);
		
		expect(carServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(userServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(carServiceMock.getById).toHaveBeenCalledWith(reqMock.body["car-id"]);
		expect(userServiceMock.getById).toHaveBeenCalledWith(reqMock.body["user-id"]);

		expect(reserveServiceMock.calculateCost).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.validate).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.save).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.save).toHaveBeenCalledWith(reserveSampler);


		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");

		expect(reqMock.session.messages).toEqual(["toyota corolla 2000 reserved succesfully"]);


		reqMock.body.id = 1;
		reserveSampler.id = 1;
	});
	test("renders the form when validation fails", async () => {
		reserveServiceMock.validate = jest.fn(() => {return { a: false };});

		await controller.save(reqMock, resMock);

		expect(userServiceMock.getAll).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("reserve/view/form/form.html", {
			car: {
				price: 20
			},
			users: [],
			reserve: new Reserve({
				id: 1,
				car: { price: 20 },
				user: {},
				since: "1900-01-01",
				until: "1999-01-01",
				pricePerDay: 20,
				totalPrice: 100,
				payed: false,
				paymentMethod: "Cash"
			}),
			validation: {
				a: false
			},
			pageTitle: "Reserve a car"
		});

		reserveServiceMock.validate = jest.fn(() => {return { a: true };});
	});
	test("redirects to '/' when couldn't save the reserve", async () => {
		reserveServiceMock.save = jest.fn(() => Promise.rejects());

		try{
			await controller.save(reqMock, resMock);
		}catch(e){
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/");
			expect(reqMock.session.errors).toEqual([e.message, e.stack]);
		}

		reserveServiceMock.save = jest.fn(() => {
			return {
				id: 1,
				car: {
					brand: "toyota",
					model: "corolla",
					year: 2000
				},
			};
		});
	});

});
describe("delete method", () => {
	test("redirects to '/' when after deleting the reserve", async () => {
		await controller.delete(reqMock, resMock);

		expect(reserveServiceMock.delete).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.delete).toHaveBeenCalledWith(reqMock.params.id);
		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");
		expect(reqMock.session.messages).toEqual(["Reserve # 1 of toyota corolla 2000 canceled succesfully"]);
	});
	test("throws an error when received id is invalid", async () => {
		reqMock.params.id = undefined;

		await expect(controller.delete(reqMock, resMock)).rejects.toThrow(ReserveIdNotDefinedError);

		reqMock.params.id = 1;
	});
	test("redirects to '/' if deleting a reserve failes", async () => {
		reserveServiceMock.delete = jest.fn(() => Promise.rejects());

		try{
			await controller.delete(reqMock, resMock);
		}catch(e){
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/");
			expect(reqMock.session.errors).toEqual([e.message, e.stack]);
		}

		reserveServiceMock.delete = jest.fn(() => {
			return{
				id: 1,
				car:{
					brand: "toyota",
					model: "corolla",
					year: 2000
				}
			};
		});
	});
});
describe("edit method", () => {
	test("renders the reserve form", async () => {
		await controller.edit(reqMock, resMock);

		expect(reserveServiceMock.getById).toHaveBeenCalledTimes(1);
		expect(reserveServiceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
		expect(userServiceMock.getAll).toHaveBeenCalledTimes(1);

		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("reserve/view/form/form.html", {
			car: {
				price: 20
			},
			users: [],
			reserve: new Reserve({
				id: 1,
				car: { price: 20 },
				user: {},
				since: "1900-01-01",
				until: "1999-01-01",
				pricePerDay: 20,
				totalPrice: 100,
				payed: false,
				paymentMethod: "Cash"
			}),
			pageTitle: "Reserve a car"
		});

	});
	test("throws an error when receives an invalid id", async () => {
		reqMock.params.id = undefined;

		await expect(controller.edit(reqMock, resMock)).rejects.toThrow(ReserveIdNotDefinedError);

		reqMock.params.id = 1;
	});
	test("redirects to '/' when cannot get the reserve", async () => {
		reserveServiceMock.getById = jest.fn(() => Promise.rejects);

		try{
			await controller.edit(reqMock, resMock);
		}catch(e){
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/");
			expect(reqMock.session.errors).toEqual([e.message, e.stack]);
		}

		reserveServiceMock.getById = jest.fn(() => new Reserve({
			id: 1,
			car: { price: 20 },
			user: {},
			since: "1900-01-01",
			until: "1999-01-01",
			pricePerDay: 20,
			totalPrice: 100,
			payed: false,
			paymentMethod: "Cash"
		}));
	});
});