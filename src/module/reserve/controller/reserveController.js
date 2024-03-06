const AbstractController = require("../../car/controller/abstractController");
const { fromDataToReserveEntity } = require("../mapper/reserveMapper");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");

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
		app.get(`${ROUTE}/:id`, this.create.bind(this));
		app.post(`${ROUTE}/:id`, this.save.bind(this));

	}

	index(req, res) {
		res.render("reserve/view/index.html", { pageTitle: "Cars reserves" });
	}

	async create(req, res) {
		try {
			const id = req.params.id;
			if (id === undefined) {
				throw new CarIdNotDefinedError("Car id not defined");
			}
			const car = await this.carService.getById(id);

			res.render("reserve/view/form/form.html", { data: { car }, pageTitle: "Reserve a car" });

		} catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}
	
	async save(req, res) {
		try {
			const carId = req.body["car-id"];
			const { since, until } = req.body;

			const car = await this.carService.getById(carId);
			const reserve = fromDataToReserveEntity({ car, since, until });
			const reserveResult = await this.reserveService.save(reserve);
			
			if(reserve.id){
				req.session.messages = ["Reserved edited succesfully"];
			}else{
				req.session.messages = [`${reserveResult.car.brand} ${reserveResult.car.model} ${reserveResult.car.year} reserved succesfully`];
			}
			res.redirect("/");

		} catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}
};

