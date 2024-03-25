const UserService = require("../userService");
const UserIdNotDefinedError = require("../error/userIdNotDefinedError");
const UserIsNotDefinedError = require("../error/userNotDefinedError");

const repositoryMock = {
	getAll: jest.fn(),
	getById: jest.fn(() => Promise.resolve({})),
	save: jest.fn(() => Promise.resolve({})),
	delete: jest.fn(() => Promise.resolve({}))

};

afterEach(() => {
	jest.clearAllMocks(); 
});

const service = new UserService(repositoryMock);

describe("getAll method", () => {
	test("returns all users", async () => {
		service.getAll();

		expect(repositoryMock.getAll).toHaveBeenCalledTimes(1);
	});
});

describe("getById method", () => {
	test("returns an user", async () => {
		const DEFINED_ID = 1;

		await service.getById(DEFINED_ID);

		expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
		expect(repositoryMock.getById).toHaveBeenCalledWith(DEFINED_ID);

	});
	test("throws an error when receives an invalid id", async () => {
		const UNDEFINED_ID = undefined;
		await expect(service.getById(UNDEFINED_ID)).rejects.toThrow(UserIdNotDefinedError);
	});
});

describe("save method", () => {
	test("saves an user", () => {
		const USER = {};
		service.save(USER);

		expect(repositoryMock.save).toHaveBeenCalledTimes(1);
		expect(repositoryMock.save).toHaveBeenCalledWith(USER);

	});
	test("throws an error when receives an undefined user", async () => {
		const UNDEFINED_USER = undefined;

		await expect(service.save(UNDEFINED_USER)).rejects.toThrow(UserIsNotDefinedError);
	});
});

describe("delete method", () => {
	test("deletes an id", () => {
		const DEFINED_ID = 1;
		service.delete(DEFINED_ID);

		expect(repositoryMock.delete).toHaveBeenCalledTimes(1);
		expect(repositoryMock.delete).toHaveBeenCalledWith(DEFINED_ID);
	});
	test("throws an error when receives an undefined id", async () => {
		const UNDEFINED_ID = undefined;

		await expect(service.delete(UNDEFINED_ID)).rejects.toThrow(UserIdNotDefinedError);
	});
});

describe("validate method", () => {
	test("calls validation callback function", () => {
		const DATA = {
			id: 1,
			names: "user",
			surnames: "user surnames"
		};
		const validationCallbackFunctionMock = jest.fn();

		service.validate(DATA, validationCallbackFunctionMock);

		expect(validationCallbackFunctionMock).toHaveBeenCalledTimes(3);
		expect(validationCallbackFunctionMock).toHaveBeenCalledWith("id", 1);
		expect(validationCallbackFunctionMock).toHaveBeenCalledWith("names", "user");
		expect(validationCallbackFunctionMock).toHaveBeenCalledWith("surnames", "user surnames");

	});
});

describe("validateField method", () => {
	test("verifies id case returns true with '' id", () => {
		const EMPTY_ID = "";
		expect(service.validateField("id", EMPTY_ID)).toEqual(true);
	});
	test("verifies id case calls repository.getById method", () => {
		const id = 1;

		service.validateField("id", id);

		expect(repositoryMock.getById).toHaveBeenCalledTimes(1);
		expect(repositoryMock.getById).toHaveBeenCalledWith(id);

	});
	test("verifies names case returns true with a valid input", () => {
		const VALID_NAMES = "user";
		expect(service.validateField("names", VALID_NAMES)).toEqual(true);
	});
	test("verifies names case returns false with an invalid input", () => {
		const INVALID_NAMES = "1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556575859606162636465666768697071727374757677787980818283848586878889909192100";
		expect(service.validateField("names", INVALID_NAMES)).toEqual(false);
	});
	test("verifies surnames case returns true with a valid input", () => {
		const VALID_SURNAMES = "user";
		expect(service.validateField("surnames", VALID_SURNAMES)).toEqual(true);
	});
	test("verifies surnames case returns false with an invalid input", () => {
		const INVALID_SURNAMES = "1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556575859606162636465666768697071727374757677787980818283848586878889909192100";
		expect(service.validateField("surnames", INVALID_SURNAMES)).toEqual(false);
	});
	test("verifies personalIdType case returns true with a valid input", () => {
		const VALID_PERSONAL_ID_TYPE = "Passport";
		expect(service.validateField("personalIdType", VALID_PERSONAL_ID_TYPE)).toEqual(true);
	});
	test("verifies personalIdType case returns false with an invalid input", () => {
		const INVALID_PERSONAL_ID_TYPE = "1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556575859606162636465666768697071727374757677787980818283848586878889909192100";
		expect(service.validateField("personalIdType", INVALID_PERSONAL_ID_TYPE)).toEqual(false);
	});
	test("verifies personalIdNumber case returns true with a valid input", () => {
		const VALID_PERSONAL_ID_NUMBER = 123456789;
		expect(service.validateField("personalIdNumber", VALID_PERSONAL_ID_NUMBER)).toEqual(true);
	});
	test("verifies personalIdNumber case returns false with an invalid input", () => {
		const INVALID_PERSONAL_ID_NUMBER = "123a----------##.";
		expect(service.validateField("personalIdNumber", INVALID_PERSONAL_ID_NUMBER)).toEqual(false);
	});
	test("verifies nationality case returns true with a valid input", () => {
		const VALID_NATIONALITY = "Argentinean";
		expect(service.validateField("nationality", VALID_NATIONALITY)).toEqual(true);
	});
	test("verifies nationality case returns false with an invalid input", () => {
		const INVALID_NATIONALITY = "Argentina";
		expect(service.validateField("nationality", INVALID_NATIONALITY)).toEqual(false);
	});
	test("verifies email case returns true with a valid input", () => {
		const VALID_EMAIL = "user@email.com";
		expect(service.validateField("email", VALID_EMAIL)).toEqual(true);
	});
	test("verifies email case returns false with an invalid input", () => {
		const INVALID_EMAIL = "user";
		expect(service.validateField("email", INVALID_EMAIL)).toEqual(false);
	});
	test("verifies phone case returns true with a valid input", () => {
		const VALID_PHONE = "+54 1234-5678";
		expect(service.validateField("phone", VALID_PHONE)).toEqual(true);
	});
	test("verifies phone case returns false with an invalid input", () => {
		const INVALID_PHONE = "+++(1234) 112345";
		expect(service.validateField("phone", INVALID_PHONE)).toEqual(false);
	});
	test("verifies birthdate case returns true with a valid input", () => {
		const INVALID_DATE = "1900-01-01";
		expect(service.validateField("birthdate", INVALID_DATE)).toEqual(true);
	});
	test("verifies birthdate case returns false with raw date format input", () => {
		const INVALID_DATE = "1999 01 01";
		expect(service.validateField("birthdate", INVALID_DATE)).toEqual(false);
	});
	test("verifies birthdate case returns false with an unexisting date", () => {
		const UNEXISTING_DATE = "1999-02-31";
		expect(service.validateField("birthdate", UNEXISTING_DATE)).toEqual(false);
	});
	test("verifies birthdate case returns false with a non 18 years old user", () => {
		const CURRENT_DATE = new Date().toISOString().slice(0, 10);
		expect(service.validateField("birthdate", CURRENT_DATE)).toEqual(false);
	});
	test("verifies birthdate case returns false with a birthdate older than minimum date", () => {
		const OLDER_THAN_MINIMUM = "1800-01-01";
		expect(service.validateField("birthdate", OLDER_THAN_MINIMUM)).toEqual(false);
	});
	test("verifies address case returns true with a valid input", () => {
		const VALID_ADDRESS = "Valid address N° 1234";
		expect(service.validateField("address", VALID_ADDRESS)).toEqual(true);
	});
	test("verifies address case returns false with a valid input", () => {
		const VALID_ADDRESS = "1234567891011121314151617181920212223242526272829303132333435363738394041424344454647484950515253545556575859606162636465666768697071727374757677787980818283848586878889909192100";
		expect(service.validateField("address", VALID_ADDRESS)).toEqual(false);
	});
});