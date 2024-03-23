const User = require("../entity/user");

function fromDataToUserEntity({
	id,
	names,
	surnames,
	["personal-id-type"]: personalIdType,
	["personal-id-number"]: personalIdNumber,
	nationality,
	email,
	phone,
	birthdate,
	address

}){
	return new User({
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
	});
}
function fromModelToUserEntity({
	id,
	names,
	surnames,
	personal_id_type: personalIdType,
	personal_id_number: personalIdNumber,
	nationality,
	email,
	phone,
	birthdate,
	address
}){
	return new User({
		id,
		names,
		surnames,
		personalIdType,
		personalIdNumber,
		nationality,
		email,
		phone,
		birthdate: birthdate.toISOString().split("T")[0],
		address
	});
}
 
module.exports = {
	fromDataToUserEntity,
	fromModelToUserEntity
};