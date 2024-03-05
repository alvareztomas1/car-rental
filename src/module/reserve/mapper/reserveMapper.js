const Reserve = require("../entity/reserve");

function fromDbToEntity({ 
	id,
	fk_car_id: carId,
	since,
	until
}){
	return new Reserve({
		id,
		carId,
		since,
		until
	});
}
function fromDataToEntity({
	id,
	"car-id": carId,
	since,
	until
}){
	return new Reserve({
		id,
		carId,
		since,
		until
	});
}

module.exports = {
	fromDbToEntity,
	fromDataToEntity
};