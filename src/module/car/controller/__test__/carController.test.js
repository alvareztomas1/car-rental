const CarController = require("../carController");
const CarIdNotDefinedError = require("../error/carIdNotDefinedError");
const Car = require("../../entity/car");

const serviceMock = {
	getAll: jest.fn(() => []),
	getById: jest.fn(() => {
		return {
			brand: "toyota",
			model: "corolla",
			year: 2000
		};
	}),
	save: jest.fn(() => {
		return {
			brand: "toyota",
			model: "corolla",
			year: 2000
		};
	}),
	delete: jest.fn(() => {
		return {
			brand: "toyota",
			model: "corolla",
			year: 2000
		};
	}),
	validateForm: jest.fn(() => {
		return {
			a: true
		};
	})
};
const multerMock = {
	single: jest.fn()
};
const reqMock = {
	session: {
		messages: [],
		errors: []
	},
	params: {
		id: 1
	},
	file: {
		path: "public",
		size: 1
	},
	body: {
		id: 1,
		brand: "toyota",
		model: "corolla",
		["car-year"]: 2000,
		transmission: "Manual",
		seats: "4",
		doors: "5",
		["air-conditioning"]: 1,
		trunk: 300,
		fuel: "Hybrid",
		price: 20,
		["unlimited-mileage"]: 1,
		["car-description"]: "car description"
	}
};
const carSample = new Car({
	id: 1,
	brand: "toyota",
	model: "corolla",
	year: 2000,
	transmission: "Manual",
	seats: "4",
	doors: "5",
	airConditioning: 1,
	trunk: 300,
	fuel: "Hybrid",
	price: 20,
	unlimitedMileage: 1,
	image: {
		path: "",
		size: 1
	},
	description: "car description"
});

const resMock = {
	render: jest.fn(),
	redirect: jest.fn()
};

const controller = new CarController(multerMock, serviceMock);

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
	test("renders the cars list", async () => {
		await controller.index(reqMock, resMock);

		expect(serviceMock.getAll).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("car/view/index/index.html", {
			data: {
				cars: []
			},
			messages: [],
			errors: [],
			pageTitle: "Car rental Web"
		});

	});
});
describe("view method", () => {
	test("renders the car view", async () => {
		await controller.view(reqMock, resMock);
		
		expect(serviceMock.getById).toHaveBeenCalledTimes(1);
		expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("car/view/view/view.html",{
			data: {
				car: {
					brand: "toyota",
					model: "corolla",
					year: 2000
				}
			},
			pageTitle: "toyota corolla 2000"
		});
	});
	test("throws an error when receives an invalid id", async () => {
		reqMock.params.id = undefined;

		await expect(controller.view(reqMock, resMock)).rejects.toThrow(CarIdNotDefinedError);

		reqMock.params.id = 1;

	});
	test("redirects to '/car' route when cannot get a car to view", async () => {
		serviceMock.getById = jest.fn(() => Promise.rejects());

		try{
			await controller.view(reqMock, resMock);
		}catch(e){
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/car");
			expect(reqMock.session.errors).toEqual([e.errors, e.messages]);
		}

		serviceMock.getById = jest.fn(() => {
			return {
				brand: "toyota",
				model: "corolla",
				year: 2000
			};
		});
	});
});
describe("create method", () => {
	test("renders 'add a new car' form", () => {
		controller.create(reqMock, resMock);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("car/view/form/form.html", {
			pageTitle: "Add new car"
		});
	});
});
describe("edit method", () => {
	test("renders 'edit a car' form", async () => {
		await controller.edit(reqMock, resMock);

		expect(serviceMock.getById).toHaveBeenCalledTimes(1),
		expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id),
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("car/view/form/form.html", {
			data: {
				car: {
					brand: "toyota",
					model: "corolla",
					year: 2000
				}
			},
			pageTitle: "Edit toyota corolla 2000"
		});
	});
	test("throws an error when receives an invalid id", async () => {
		reqMock.params.id = undefined;

		await expect(controller.edit(reqMock, resMock)).rejects.toThrow(CarIdNotDefinedError);

		reqMock.params.id = 1;
	});
	test("redirects to '/car' route when cannot renders the form", async () => {
		serviceMock.getById = jest.fn(() => Promise.rejects());

		try{
			await controller.edit(reqMock, resMock);
		}catch(e){
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/car");
			expect(reqMock.session.errors).toEqual([e.errors, e.messages]);
		}

		serviceMock.getById = jest.fn(() => {
			return {
				brand: "toyota",
				model: "corolla",
				year: 2000
			};
		});
	});

});
describe("save method", () => {
	test("redirects to '/car' saving a new car", async () => {
		reqMock.body.id = null;
		carSample.id = null;

		await controller.save(reqMock, resMock);

		expect(serviceMock.save).toHaveBeenCalledTimes(1);
		expect(serviceMock.save).toHaveBeenCalledWith(carSample);
		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/car");
		expect(reqMock.session.messages).toEqual(["toyota corolla 2000 added succesfully"]);

		reqMock.body.id = 1;
		carSample.id = 1;
	});
	test("redirects to '/car' saving an edit in an existing car", async () => {
		await controller.save(reqMock, resMock);

		expect(serviceMock.save).toHaveBeenCalledTimes(1);
		expect(serviceMock.save).toHaveBeenCalledWith(carSample);
		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/car");
		expect(reqMock.session.messages).toEqual(["toyota corolla 2000 edited succesfully"]);
		
	});
	test("renders the car form if validation fails", async () => {
		serviceMock.validateForm = jest.fn(() => { return { a: false };});
		await controller.save(reqMock, resMock);

		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("car/view/form/form.html", {
			data: {
				car: new Car({
					id: 1,
					brand: "toyota",
					model: "corolla",
					year: 2000,
					transmission: "Manual",
					seats: "4",
					doors: "5",
					airConditioning: 1,
					trunk: 300,
					fuel: "Hybrid",
					price: 20,
					unlimitedMileage: 1,
					image: {
						path: "",
						size: 1
					},
					description: "car description"
				})
			},
			validation: {
				a: false
			},
			pageTitle: "Edit car"
		});

		serviceMock.validateForm = jest.fn(() => { return { a: true };});
	});
	test("redirects to '/car' when saving the car fails", async () => {
		serviceMock.save = jest.fn(() => Promise.rejects());

		try{
			await controller.save(reqMock, resMock);
		}catch(e){
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/car");
			expect(reqMock.session.errors).toEqual([e.messages, e.stack]);
		}

		serviceMock.save = jest.fn(() => {
			return {
				brand: "toyota",
				model: "corolla",
				year: 2000
			};
		});
	});
});
describe("delete method", () => {
	test("redirects to '/car' route when deletes a team", async () => {
		await controller.delete(reqMock, resMock);

		expect(serviceMock.delete).toHaveBeenCalledTimes(1);
		expect(serviceMock.delete).toHaveBeenCalledWith(reqMock.params.id);
		expect(reqMock.session.messages).toEqual(["toyota corolla 2000 deleted succesfully"]);
		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/car");
	});
	test("throws an error when receives an invalid id", async () => {
		reqMock.params.id = undefined;

		await expect(controller.delete(reqMock, resMock)).rejects.toThrow(CarIdNotDefinedError);

		reqMock.params.id = 1;

	});
	test("redirects to '/car' when deleting a team fails", async () => {
		serviceMock.delete = jest.fn(() => Promise.rejects());

		try{
			controller.delete(reqMock, resMock);
		}catch(e){
			expect(reqMock.session.errors).toEqual([e.message, e.stack]);
			expect(resMock.redirect).toHaveBeenCalledTimes(1);
			expect(resMock.redirect).toHaveBeenCalledWith("/car");
		}
	});
});

