const ReserveController = require("./controller/reserveController");
const ReserveService = require("./service/reserveService");
const ReserveRepository = require("./repository/reserveRepository");

function init(app, container){
	const controller = container.get("ReserveController");
	controller.configureRoutes(app);
}

module.exports = {
	init,
	ReserveController,
	ReserveService,
	ReserveRepository
};