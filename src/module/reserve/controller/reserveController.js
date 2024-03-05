const AbstractController = require("../../car/controller/abstractController");

module.exports = class ReserveController extends AbstractController {
	constructor(carService, reserveService) {
		super();
		this.ROUTE_BASE = "/reserve";
		this.carService = carService;
		this.reserveService = reserveService;
	}
	configureRoutes(app) {
		const ROUTE = this.ROUTE_BASE;
		app.get(`${ROUTE}/list`, this.index.bind(this));

	}

	index (req, res) {
		res.render("reserve/view/index.html", { pageTitle: "Cars reserves" });
	}

	

};

