module.exports = class Reserve{
	constructor({
		id,
		car, 
		since, 
		until,
		pricePerDay,
		totalPrice,
		payed,
		paymentMethod
	}){
		this.id = id;
		this.car = car;
		this.since = since;
		this.until = until;
		this.pricePerDay = pricePerDay;
		this.totalPrice = totalPrice;
		this.payed = payed;
		this.paymentMethod = paymentMethod;
	}
};