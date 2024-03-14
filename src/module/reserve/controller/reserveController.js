const AbstractController = require("../../abstractController");
const { fromDataToReserveEntity } = require("../mapper/reserveMapper");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");
const ReserveIdNotDefinedError = require("./error/reserveIdNotDefinedError");
const NoUsersFoundError = require("./error/noUsersFoundError");

module.exports = class ReserveController extends AbstractController {
	constructor(carService, reserveService, userService) {
		super();
		this.ROUTE_BASE = "/reserve";
		this.carService = carService;
		this.reserveService = reserveService;
		this.userService = userService;
	}
	configureRoutes(app) {
		const ROUTE = this.ROUTE_BASE;
		app.get(`${ROUTE}/list`, this.index.bind(this));
		app.get(`${ROUTE}/:id`, this.create.bind(this));
		app.post(`${ROUTE}/:id`, this.save.bind(this));
		app.post(`${ROUTE}/delete/:id`, this.delete.bind(this));
		app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
	}

	async index(req, res) {
		const reserves = await this.reserveService.getAll();
		res.render("reserve/view/index.html", { reserves: reserves ? reserves : false, pageTitle: "Cars reserves" });
	}

	async create(req, res) {
		try {
			const id = req.params.id;
			if (id === undefined) {
				throw new CarIdNotDefinedError("Car id not defined");
			}
			const car = await this.carService.getById(id);
			const users = await this.userService.getAll();
			
			if(!users){
				throw new NoUsersFoundError("No users found. Create an User first");
			}

			res.render("reserve/view/form/form.html", { car, users, pageTitle: "Reserve a car" });

		} catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}
	
	async save(req, res) {
		const { since, until, id } = req.body;
		const carId = req.body["car-id"];
		const userId = req.body["user-id"];

		const dataToValidate = {
			id,
			carId,
			userId,
			since,
			until,
			paymentMethod: req.body["payment-method"]
		};

		try {
			const car = await this.carService.getById(carId);
			const user = await this.userService.getById(userId);

			const reserveToSave = {
				id, 
				car,
				user, 
				since, 
				until,
				pricePerDay: car.price,
				totalPrice: this.reserveService.calculateCost(since, until, car.price),
				payed: dataToValidate.paymentMethod === "Cash" ? false : true,
				paymentMethod: dataToValidate.paymentMethod 
			};

			const reserve = fromDataToReserveEntity(reserveToSave);
			const validation = this.reserveService.validate(dataToValidate);
			const validationIsSuccess = !Object.values(validation).includes(false);

			if (validationIsSuccess) {
				const savedReserve = await this.reserveService.save(reserve);
				
				if(id){
					req.session.messages = [`Reserve #${savedReserve.id} of ${savedReserve.car.brand} ${savedReserve.car.model} ${savedReserve.car.year} edited succesfully`];
				}else{
					req.session.messages = [`${savedReserve.car.brand} ${savedReserve.car.model} ${savedReserve.car.year} reserved succesfully`];
				}

				res.redirect("/");
			}else{
				const users = await this.userService.getAll();
				res.render("reserve/view/form/form.html", { car, users, reserve, validation, pageTitle: "Reserve a car" });
			}

		} catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}

	async delete(req, res){
		const id = req.params.id;

		if(id === undefined){
			throw new ReserveIdNotDefinedError("Reserve id not defined");
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

	async edit(req, res){
		const id = req.params.id;

		if(id === undefined){
			throw new ReserveIdNotDefinedError("Reserve id not defined");
		}

		try{
			const reserve = await this.reserveService.getById(id);
			const users = await this.userService.getAll();

			const car = reserve.car;

			res.render("reserve/view/form/form.html", { car, users, reserve, pageTitle: "Reserve a car" });	
		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
		
	}

};

