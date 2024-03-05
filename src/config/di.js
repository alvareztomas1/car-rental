const { CarController, CarService, CarRepository } = require("../module/car/module");
const { ReserveController, ReserveService, ReserveRepository } = require("../module/reserve/module");
const { default: DIContainer, object, get, factory } = require("rsdi");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const Sqlite3Database = require("better-sqlite3");

function configureMainDatabaseAdapter(){
	return new Sqlite3Database(process.env.DB_path,{
		verbose: console.log
	});
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

function addCommonDefinitions(container){
	container.addDefinitions({
		MainDatabaseAdapter: factory(configureMainDatabaseAdapter),
		Multer: factory(configureMulter),
		Session: factory(configureSession),
	});
}
function addCarModuleDefinitions(container){
	container.addDefinitions({
		CarController: object(CarController).construct(get("Multer"), get("CarService")),
		CarService: object(CarService).construct(get("CarRepository")),
		CarRepository: object(CarRepository).construct(get("MainDatabaseAdapter")),
	});
}

function addReserveModuleDefinitions(container){
	container.addDefinitions({
		ReserveController: object(ReserveController).construct(get("CarService"), get("ReserveService")),
		ReserveService: object(ReserveService).construct(get("ReserveRepository")),
		ReserveRepository: object(ReserveRepository).construct(get("MainDatabaseAdapter")),
	});
}

module.exports = function configureDI(){
	const container = new DIContainer();
	addCommonDefinitions(container);
	addCarModuleDefinitions(container);
	addReserveModuleDefinitions(container);

	return container;
};



