const AbstractController = require("./abstractController");
const CarIdNotDefinedError = require("./error/carIdNotDefinedError");
const { fromDataToEntity } = require("../mapper/carMapper");

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
		app.post(`${ROUTE}/create`, this.uploadMiddleware.single("image"), this.save.bind(this));


	}
	async index(req, res) {
		const cars = await this.carService.getAll();
		const { errors, messages } = req.session;

		res.render("car/view/index/index.html", { data: { cars }, errors, messages });

		req.session.errors = [];
		req.session.message = [];

	}
	async view(req, res) {
		const id = req.params.id;

		if (!id) {
			throw new CarIdNotDefinedError("Car id not defined");
		}

		try {
			const car = await this.carService.getById(id);
			res.render("car/view/view/view.html", { data: { car } });
		} catch (e) {
			req.session.errors = [e.message, e.stack];
			res.redirect("/car");
		}

	}
	async create(req, res) {
		res.render("car/view/form/form.html");
	}
	async save(req, res) {
		try {
			const car = fromDataToEntity(req.body);

			if (req.file) {
				const { path } = req.file;
				car.image = path.replace("public", "");
			}
			const savedCar = await this.carService.save(car);

			if (car.id) {
				req.session.messages = [`${car.id} edited succesfully`];
			} else {
				req.session.messages = [`${savedCar.brand} ${savedCar.model} ${savedCar.year} added succesfully`];
			}

			res.redirect("/car");
		} catch (e) {
			res.render("car/view/form/form.html");

		}
	}
};