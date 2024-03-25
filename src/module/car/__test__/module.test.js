const { init } = require("../module");
test("verifies init function", () => {

	const appMock = jest.fn();
	const configureRoutesMock = jest.fn((app) => {});

	const containerMock = {
		get: jest.fn(() => ({
			configureRoutes: configureRoutesMock
		}))
	};

	init(appMock, containerMock);

	expect(containerMock.get).toHaveBeenCalledTimes(1);
	expect(containerMock.get).toHaveBeenCalledWith("CarController");
	expect(containerMock.get().configureRoutes).toHaveBeenCalledTimes(1);
	expect(containerMock.get().configureRoutes).toHaveBeenCalledWith(appMock);
});