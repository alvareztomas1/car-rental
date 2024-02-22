const AbstractController = require("./abstractController");
module.exports = class CarController extends AbstractController {
	constructor(uploadMiddleware, carService) {
		super();
		this.ROUTE_BASE = "/car";
		this.uploadMiddleware = uploadMiddleware;
		this.carService = carService;
	}

	configureRoutes(app) {
		const ROUTE = this.ROUTE_BASE;
		app.get(`${ROUTE}`, this.index.bind(this));
	}
	async index(req, res){
		const cars = await this.carService.getAll();
		res.render("car/view/index.html", { data: { cars } });
	}
	
};