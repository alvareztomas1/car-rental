const AbstractController = require("./abstractController");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");

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
		app.get(`${ROUTE}/view/:id`, this.view.bind(this));
		
	}
	async index(req, res){
		const cars = await this.carService.getAll();
		const { errors, messages } = req.session;

		res.render("car/view/index/index.html", { data: { cars }, errors, messages });

		req.session.errors = [];
		req.session.message = [];

	}
	async view(req, res){
		const id = req.params.id;

		if(!id){
			throw new CarIdNotDefinedError("Car id not defined");
		}

		try{
			const car = await this.carService.getById(id);
			res.render("car/view/view/view.html", { data: { car } });
		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/car");
		}

	}
	
};