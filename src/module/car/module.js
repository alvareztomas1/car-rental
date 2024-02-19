const CarController = require("./controller/carController");
const CarService = require("./service/carService");
const CarRepository = require("./repository/carRepository");

function init(app, container){
	const controller = container.get("CarController");
	controller.configureRoutes(app);
}

module.exports = {
	init,
	CarController,
	CarService,
	CarRepository
};