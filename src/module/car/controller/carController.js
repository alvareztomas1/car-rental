const AbstractController = require("../../abstractController");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");
const { fromDataToCarEntity } = require("../mapper/carMapper");

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
		app.get(`${ROUTE}/create`, this.create.bind(this));
		app.get(`${ROUTE}/edit/:id`, this.edit.bind(this));
		app.post(`${ROUTE}/edit/:id`, this.uploadMiddleware.single("image"), this.save.bind(this));
		app.post(`${ROUTE}/create`, this.uploadMiddleware.single("image"), this.save.bind(this));
		app.post(`${ROUTE}/delete/:id`, this.delete.bind(this));
	}
	async index(req, res) {
		const cars = await this.carService.getAll();
		const { errors, messages } = req.session;

		res.render("car/view/index/index.html", { data: { cars }, errors, messages, pageTitle: "Car rental Web"  });

		req.session.errors = [];
		req.session.messages = [];

	}
	async view(req, res) {
		const id = req.params.id;

		if (!id) {
			throw new CarIdNotDefinedError("Car id not defined");
		}

		try {
			const car = await this.carService.getById(id);
			res.render("car/view/view/view.html", { data: { car }, pageTitle: `${car.brand} ${car.model} ${car.year}` });
		} catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/car");
		}

	}
	async create(req, res) {
		res.render("car/view/form/form.html", { pageTitle: "Add new car" });
	}
	async edit(req, res) {
		const id = req.params.id;

		if(id === undefined){
			throw new CarIdNotDefinedError("Car id not defined");
		}
		try{
			const car = await this.carService.getById(id);
			res.render("car/view/form/form.html", { data: { car }, pageTitle: `Edit ${car.brand} ${car.model} ${car.year}` });

		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/car");
		}

	}
	async save(req, res) {
		try {
			const car = fromDataToCarEntity(req.body);

			if (req.file) {
				const { path, size } = req.file;
				car.image = { 
					path: path.replace("public", ""),
					size: size
				};
			}

			const validation = this.carService.validateForm(car);
			const validationIsSuccess = !Object.values(validation).includes(false);
	
			if (validationIsSuccess){
				const savedCar = await this.carService.save(car);

				if (car.id) {
					req.session.messages = [`${savedCar.brand} ${savedCar.model} ${savedCar.year} edited succesfully`];
				} else {
					req.session.messages = [`${savedCar.brand} ${savedCar.model} ${savedCar.year} added succesfully`];
				}

				res.redirect("/car");
			}
			else {
				res.render("car/view/form/form.html", { data: { car }, validation, pageTitle: car.id ? "Edit car" : "Add new car" });
			}
		}
		catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/car");
		}
	}
	async delete(req, res){
		const id = req.params.id;

		if(id === undefined){
			throw new CarIdNotDefinedError("Car id not defined");
		}

		try{
			const deletedTeam = await this.carService.delete(id);

			req.session.messages = [`${deletedTeam.brand} ${deletedTeam.model} ${deletedTeam.year} deleted succesfully`];

			res.redirect("/car");
		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/car");

		}
	}
	
};