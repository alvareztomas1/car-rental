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
		app.post(`${ROUTE}/delete/:id`, this.delete.bind(this));
	}

	async index(req, res) {
		const data = await this.reserveService.getAll();
		
		const reserves = data ? data.map((reserve) => {
			return {
				reserve,
				price: this.reserveService.calculateCost(reserve.since, reserve.until, reserve.car.price)
			};
		}) : false;

		
		res.render("reserve/view/index.html", { reserves, pageTitle: "Cars reserves" });
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
			const { since, until, id } = req.body;
			const carId = req.body["car-id"];

			const reserveData = {
				id,
				since,
				until,
				carId
			};

			const car = await this.carService.getById(carId);
			const validation = this.reserveService.validate(reserveData);
			const validationIsSuccess = !Object.values(validation).includes(false);

			if (validationIsSuccess) {
				const reserve = fromDataToReserveEntity({ id, car, since, until });
				const reserveResult = await this.reserveService.save(reserve);
				
				if(id){
					req.session.messages = [`Reserve #${reserveResult.id} of ${reserveResult.car.brand} ${reserveResult.car.model} ${reserveResult.car.year} edited succesfully`];
				}else{
					req.session.messages = [`${reserveResult.car.brand} ${reserveResult.car.model} ${reserveResult.car.year} reserved succesfully`];
				}
				res.redirect("/");
			}else{
				res.render("reserve/view/form/form.html", { data: { car }, validation, pageTitle: "Reserve a car" });
			}
			

		} catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}

	async delete(req, res){
		const id = req.params.id;

		if(id === undefined){
			throw new CarIdNotDefinedError("Car id not defined");
		}

		try{
			const deletedReserve = await this.reserveService.delete(id);

			req.session.messages = [`Reserve # ${deletedReserve.id} of ${deletedReserve.car.brand} ${deletedReserve.car.model} ${deletedReserve.car.year} canceled succesfully`];

			res.redirect("/");
		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}

};

