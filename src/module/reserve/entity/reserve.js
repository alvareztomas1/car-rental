module.exports = class Reserve{
	constructor({
		id,
		carId, 
		since, 
		until
	}){
		this.id = id;
		this.carId = carId;
		this.since = since;
		this.until = until;
	}
};