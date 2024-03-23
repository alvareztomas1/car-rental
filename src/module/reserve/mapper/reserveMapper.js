const Reserve = require("../entity/reserve");

function fromModelToReserveEntity({ 
	id,
	since,
	until,
	price_per_day: pricePerDay,
	total_price: totalPrice,
	payed,
	payment_method: paymentMethod,
	Car: car,
	User: user
}){
	return new Reserve({
		id,
		car,
		user,
		since: since.toISOString().split("T")[0],
		until: until.toISOString().split("T")[0],
		pricePerDay,
		totalPrice,
		payed,
		paymentMethod
	});
}
function fromDataToReserveEntity({
	id,
	car,
	user,
	since,
	until,
	pricePerDay,
	totalPrice,
	payed,
	paymentMethod

}){
	return new Reserve({
		id,
		car,
		user,
		since,
		until,
		pricePerDay,
		totalPrice,
		payed,
		paymentMethod
	});
}

module.exports = {
	fromModelToReserveEntity,
	fromDataToReserveEntity
};