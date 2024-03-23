module.exports = class User{
	constructor({
		id,
		names,
		surnames,
		personalIdType,
		personalIdNumber,
		nationality,
		email,
		phone,
		birthdate,
		address
	})
	{
		this.id = id;
		this.names = names;
		this.surnames = surnames;
		this.personalIdType = personalIdType;
		this.personalIdNumber = personalIdNumber;
		this.nationality = nationality;
		this.email = email;
		this.phone = phone;
		this.birthdate = birthdate;
		this.address = address;
	}
};