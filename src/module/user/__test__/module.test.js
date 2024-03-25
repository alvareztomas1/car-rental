const { init } = require("../module");

const appMock = jest.fn();
const configureRoutesMock = jest.fn();
const containerMock = {
	get: jest.fn(() => {
		return {
			configureRoutes: configureRoutesMock
		};
	})
};

test("verifies init function gets the module controller and configure routes", () => {

	init(appMock, containerMock);

	expect(containerMock.get).toHaveBeenCalledTimes(1);
	expect(containerMock.get).toHaveBeenCalledWith("UserController");
    expect(configureRoutesMock).toHaveBeenCalledTimes(1);
    expect(configureRoutesMock).toHaveBeenCalledWith(appMock);
});