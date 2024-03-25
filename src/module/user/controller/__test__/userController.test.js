const UserController = require("../userController");
const User = require("../../entity/user");
const UserIdNotDefinedError = require("../error/userIdNotDefinedError");

const serviceMock = {
	getAll: jest.fn(() => ["users"]),
	getById: jest.fn(() => Promise.resolve({
		names: "user",
		surnames: "user surnames"
	})), 
	save: jest.fn(() => Promise.resolve({ id: 1 })),
	delete: jest.fn(() => Promise.resolve({
		id: 1,
		names: "user",
		surnames: "user surnames"
	})),
	validate: jest.fn(() => { return { a: true }; }),
	validateField: jest.fn()
};
const controller = new UserController(serviceMock);
const userSampler = new User({
	id: 1,
	names: "user",
	surnames: "user surnames",
	personalIdType: "Passport",
	personalIdNumber: "123456789",
	nationality: "Argentinean",
	email: "user@email.com",
	phone: "+12 3456-7890",
	birthdate: "1900-01-01",
	address: "user address"
});
const reqMock = {
	params: {
		id: 1
	},
	body: {
		id: 1,
		names: "user",
		surnames: "user surnames",
		["personal-id-type"]: "Passport",
		["personal-id-number"]: "123456789",
		nationality: "Argentinean",
		email: "user@email.com",
		phone: "+12 3456-7890",
		birthdate: "1900-01-01",
		address: "user address"   
	},
	session: {
		messages: [],
		errors: []
	}
};
const resMock = {
	render: jest.fn(),
	redirect: jest.fn()
};

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

	test("renders the user list", async () => {
		
		await controller.index(reqMock, resMock);

		expect(serviceMock.getAll).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("user/view/index.html", {
			users: ["users"],
			pageTitle: "Users list"
		});
        
	});

});

describe("create method", () => {

	test("renders the user form", () => {
		
		controller.create(reqMock, resMock);
        
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("user/view/form/form.html",{
			pageTitle: "Add new user"
		});
	});

});

describe("save method", () => {

	test("editing an user redirects to 'route'", async () => {
		await controller.save(reqMock, resMock);

		expect(serviceMock.save).toHaveBeenCalledTimes(1);
		expect(serviceMock.save).toHaveBeenCalledWith(userSampler);
		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");
		expect(reqMock.session.messages).toEqual(["User #1 edited succesfully"]);
	});
	test("adding an user redirects to 'route'", async () => {
		serviceMock.save = jest.fn(() => { return { id: 2 };}),
		reqMock.body.id = null;
		userSampler.id = null;
        
		await controller.save(reqMock, resMock);

		expect(serviceMock.save).toHaveBeenCalledTimes(1);
		expect(serviceMock.save).toHaveBeenCalledWith(userSampler);
		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");
		expect(reqMock.session.messages).toEqual(["User #2 added succesfully"]);

		serviceMock.save = jest.fn(() => { return { id: 1 };}),
		reqMock.body.id = 1;
		userSampler.id = 1;

	});
	test("when validation fails it re-renders the form", async () => {
		serviceMock.validate = jest.fn(() => { return { a: false }; });
        
		await controller.save(reqMock, resMock);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("user/view/form/form.html", {
			data: {
				user: userSampler,
			},
			validation: {
				a: false
			},
			pageTitle: "Edit user"
		});
		serviceMock.validate = jest.fn(() => { return { a: true }; });
	});
	test("redirects to '/' route when saving an user fails", async () => {
		serviceMock.save = jest.fn(() => Promise.reject({}));
		await controller.save(reqMock, resMock);

		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");
		serviceMock.save = jest.fn(() => Promise.resolve({id: 1}));


	});

});

describe("delete method", () => {

	test("deleting a team redirects to '/' route", async () => {
		await controller.delete(reqMock, resMock);

		expect(serviceMock.delete).toHaveBeenCalledTimes(1);
		expect(serviceMock.delete).toHaveBeenCalledWith(reqMock.params.id);
		expect(reqMock.session.messages).toEqual(["User #1 user user surnames deleted succesfully"]);
		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/"); 
	});
	test("redirects to '/' route when deleting a team fails", async () => {
		serviceMock.delete = jest.fn(() => Promise.reject({}));
		await controller.delete(reqMock, resMock);

		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");

		serviceMock.delete = jest.fn(() => Promise.resolve({id: 1}));

	});
	test("throws an error when receives an invalid id", async () => {
		reqMock.params.id = undefined;

		await expect(controller.delete(reqMock, resMock)).rejects.toThrow(UserIdNotDefinedError);

		reqMock.params.id = 1;
		serviceMock.delete = jest.fn(() => Promise.resolve({id: 1}));

	});

});

describe("edit method", () => {
	test("renders the form when receives a valid id", async () => {
		await controller.edit(reqMock, resMock);
        
		expect(serviceMock.getById).toHaveBeenCalledTimes(1);
		expect(serviceMock.getById).toHaveBeenCalledWith(reqMock.params.id);
		expect(resMock.render).toHaveBeenCalledTimes(1);
		expect(resMock.render).toHaveBeenCalledWith("user/view/form/form.html", {
			data: {
				user: {
					names: "user",
					surnames: "user surnames"
				}
			},
			pageTitle: "Edit user user surnames"
		});
	});
	test("redirects to '/' route when edith method fails", async () => {
		serviceMock.getById = jest.fn(() => Promise.reject({}));
		await controller.edit(reqMock, resMock);

		expect(resMock.redirect).toHaveBeenCalledTimes(1);
		expect(resMock.redirect).toHaveBeenCalledWith("/");

		serviceMock.getById = jest.fn(() => Promise.resolve({
			names: "user",
			surnames: "user surnames"
		})); 
	});
	test("throws an error when receives an invalid id", async () => {
		reqMock.params.id = undefined;

		await expect(controller.edit(reqMock,resMock)).rejects.toThrow(UserIdNotDefinedError);
		reqMock.params.id = 1;
	});
});