const Reserve = require("../entity/reserve");

function fromDbToReserveEntity({ 
	id,
	car: car,
	since,
	until
}){
	return new Reserve({
		id,
		car,
		since,
		until
	});
}
function fromDataToReserveEntity({
	id,
	car,
	since,
	until
}){
	return new Reserve({
		id,
		car,
		since,
		until
	});
}

module.exports = {
	fromDbToReserveEntity,
	fromDataToReserveEntity
};