const { CarController, CarService, CarRepository, CarModel } = require("../module/car/module");
const { ReserveController, ReserveService, ReserveRepository, ReserveModel } = require("../module/reserve/module");
const { UserController, UserService, UserRepository, UserModel } = require("../module/user/module");
const { default: DIContainer, object, get, factory } = require("rsdi");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const { Sequelize } = require("sequelize");

function configureMainSequelizeAdapter(){
	const sequelize = new Sequelize({
		dialect: "sqlite",
		storage: process.env.DB_path
	});

	return sequelize;
}

function configureSession(){
	const ONE_WEEK_IN_SECONDS = 604800000;
	const sessionOptions = {
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: ONE_WEEK_IN_SECONDS } 
	};

	return session(sessionOptions);
}

function configureMulter(){
	const storage = multer.diskStorage({
		destination(req, file, cb){
			cb(null, process.env.CARS_PICS_UPLOADS_DIR);
		},
		filename(req, file, cb){
			cb(null, Date.now() + path.extname(file.originalname));
		},
	});

	return multer({ storage });
}

function configureCarModel(container){
	CarModel.setup(container.get("Sequelize"));
	return CarModel;
}

function configureReserveModel(container){
	ReserveModel.setup(container.get("Sequelize"));
	ReserveModel.setUpAssociations(container.get("CarModel"));

	ReserveModel.setUpAssociations(container.get("CarModel"),  container.get("UserModel"));
	return ReserveModel;
}

function configureUserModel(container){
	UserModel.setup(container.get("Sequelize"));

	return UserModel;
}

function addCommonDefinitions(container){
	container.addDefinitions({
		Multer: factory(configureMulter),
		Session: factory(configureSession),
		Sequelize: factory(configureMainSequelizeAdapter),
	});
}
function addCarModuleDefinitions(container){
	container.addDefinitions({
		CarController: object(CarController).construct(get("Multer"), get("CarService")),
		CarService: object(CarService).construct(get("CarRepository")),
		CarRepository: object(CarRepository).construct(get("CarModel"), get("ReserveModel")),
		CarModel: factory(configureCarModel),
	});
}

function addReserveModuleDefinitions(container){
	container.addDefinitions({
		ReserveController: object(ReserveController).construct(get("CarService"), get("ReserveService"), get("UserService")),
		ReserveService: object(ReserveService).construct(get("ReserveRepository"), get("CarService"), get("UserService")),
		ReserveRepository: object(ReserveRepository).construct(get("ReserveModel"), get("CarModel"), get("UserModel")),
		ReserveModel: factory(configureReserveModel),
	});
}

function addUserModuleDefinitions(container){
	container.addDefinitions({
		UserController: object(UserController).construct(get("UserService")),
		UserService: object(UserService).construct(get("UserRepository")),
		UserRepository: object(UserRepository).construct(get("UserModel")),
		UserModel: factory(configureUserModel),
	});
}

module.exports = function configureDI(){
	const container = new DIContainer();
	addCommonDefinitions(container);
	addCarModuleDefinitions(container);
	addReserveModuleDefinitions(container);
	addUserModuleDefinitions(container);

	return container;
};



