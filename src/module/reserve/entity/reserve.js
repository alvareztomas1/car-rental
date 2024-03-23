module.exports = class Reserve{
	constructor({
		id,
		car, 
		since, 
		until
	}){
		this.id = id;
		this.car = car;
		this.since = since;
		this.until = until;
	}
};