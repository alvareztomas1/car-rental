const ReserveController = require("./controller/reserveController");
const ReserveService = require("./service/reserveService");
const ReserveRepository = require("./repository/reserveRepository");
const ReserveModel = require("./model/reserveModel");

function init(app, container){
	const controller = container.get("ReserveController");
	controller.configureRoutes(app);
}

module.exports = {
	init,
	ReserveController,
	ReserveService,
	ReserveRepository,
	ReserveModel
};