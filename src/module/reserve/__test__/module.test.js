const { init } = require("../module");

const configureRoutesMock = jest.fn();
const containerMock = {
	get: jest.fn(() => {
		return {
			configureRoutes: configureRoutesMock
		};
	})
};
const appMock = jest.fn();

test("configure module routes", () => {
	init(appMock, containerMock);

	expect(containerMock.get).toHaveBeenCalledTimes(1);
	expect(containerMock.get).toHaveBeenCalledWith("ReserveController");
	expect(configureRoutesMock).toHaveBeenCalledTimes(1);
	expect(configureRoutesMock).toHaveBeenCalledWith(appMock);
});