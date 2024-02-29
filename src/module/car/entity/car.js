module.exports = class Car{
	constructor({
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
		reserved
	}){
		this.id = id;
		this.brand = brand;
		this.model = model;
		this.year = year;
		this.transmission = transmission;
		this.seats = seats;
		this.doors = doors;
		this.airConditioning = Number(airConditioning);
		this.trunk = trunk;
		this.fuel = fuel;
		this.price = price;
		this.unlimitedMileage = Number(unlimitedMileage);
		this.image = image;
		this.description = description;
		this.reserved = Number(reserved);
	}
};