const Car = require("../entity/car");
function fromDbToCarEntity({
	id,
	brand,
	model,
	car_year: year,
	transmission,
	seats,
	doors,
	air_conditioning: airConditioning,
	trunk,
	fuel,
	price,
	unlimited_mileage: unlimitedMileage,
	car_image: image,
	car_description: description,
}) {
	return new Car({
		id,
		brand,
		model,
		year,
		transmission,
		seats,
		doors,
		airConditioning,
		trunk,
		fuel,
		price,
		unlimitedMileage,
		image,
		description,
	});
}
function fromDataToCarEntity({
	id,
	brand,
	model,
	"car-year": year,
	transmission,
	seats,
	doors,
	"air-conditioning": airConditioning,
	trunk,
	fuel,
	price,
	"unlimited-mileage": unlimitedMileage,
	image,
	"car-description": description,
}) {
	return new Car({
		id,
		brand,
		model,
		year,
		transmission,
		seats,
		doors,
		airConditioning,
		trunk,
		fuel,
		price,
		unlimitedMileage,
		image,
		description,
	});
}

module.exports = {
	fromDbToCarEntity,
	fromDataToCarEntity
};