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
		app.get(`${ROUTE}/:id`, this.view.bind(this));
	}
	async index(req, res){
		const cars = await this.carService.getAll();
		res.render("car/view/index.html", { data: { cars } });
	}
	async view(req, res){
		const id = req.params.id;
		try{
			const car = await this.carService.getById(id);
			console.log(car);
			res.render("car/view/view.html", { data: { car } });
		}catch(e){
			// SHOW ERROR
			res.redirect("/car");
		}

	}

};