const AbstractService = require("./abstractService");
const UserNotDefinedError = require("./error/userNotDefinedError");
const UserIdNotDefinedError = require("./error/userIdNotDefinedError");


module.exports = class UserService extends AbstractService {
	constructor(userRespotiroy) {
		super();
		this.userRespotiroy = userRespotiroy;
	}

	getAll(){
		return this.userRespotiroy.getAll();
	}

	getById(id){
		if(id === undefined){
			throw new UserIdNotDefinedError("User id not defined");
		}
		return this.userRespotiroy.getById(id);
	}

	save(user) {
		
		if (user === undefined) {
			throw new UserNotDefinedError("User is not defined");
		}

		return this.userRespotiroy.save(user);
	}

	delete(id) {

		if (id === undefined) {
			throw new UserIdNotDefinedError("User id is not defined");
		}

		return this.userRespotiroy.delete(id);
	}

	validate(data) {
		const validation = {};

		Object.keys(data).forEach((key) => {
			validation[key] = this.validateField(key, data[key]);
		});

		return validation;
	}

	validateField(type, input) {

		switch (type) {
		case "id":
			return input === "" || !!this.getById(input);
		case "names":
			return /^(?=.{3,100}$)[a-zA-ZÀ-ÿ\u00f1\u00d1]+(([',. -][a-zA-ZÀ-ÿ\u00f1\u00d1 ])?[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*$/
				.test(input);			
		case "surnames":
			return /^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s'-]{1,100}$/.test(input);
		case "personalIdType":
			return /^(Passport|SSN|Driver's license|National ID Card|Other)$/.test(input);
		case "personalIdNumber":
			return /^[A-Za-z0-9]{3,20}$/.test(input);
		case "nationality":{
			const nationalities = [
				"Afghan",
				"Albanian",
				"Algerian",
				"American",
				"Andorran",
				"Angolan",
				"Antiguans",
				"Argentinean",
				"Armenian",
				"Australian",
				"Austrian",
				"Azerbaijani",
				"Bahamian",
				"Bahraini",
				"Bangladeshi",
				"Barbadian",
				"Barbudans",
				"Batswana",
				"Belarusian",
				"Belgian",
				"Belizean",
				"Beninese",
				"Bhutanese",
				"Bolivian",
				"Bosnian",
				"Brazilian",
				"British",
				"Bruneian",
				"Bulgarian",
				"Burkinabe",
				"Burmese",
				"Burundian",
				"Cambodian",
				"Cameroonian",
				"Canadian",
				"Cape Verdean",
				"Central African",
				"Chadian",
				"Chilean",
				"Chinese",
				"Colombian",
				"Comoran",
				"Congolese",
				"Costa Rican",
				"Croatian",
				"Cuban",
				"Cypriot",
				"Czech",
				"Danish",
				"Djibouti",
				"Dominican",
				"Dutch",
				"East Timorese",
				"Ecuadorean",
				"Egyptian",
				"Emirian",
				"Equatorial Guinean",
				"Eritrean",
				"Estonian",
				"Ethiopian",
				"Fijian",
				"Filipino",
				"Finnish",
				"French",
				"Gabonese",
				"Gambian",
				"Georgian",
				"German",
				"Ghanaian",
				"Greek",
				"Grenadian",
				"Guatemalan",
				"Guinea-Bissauan",
				"Guinean",
				"Guyanese",
				"Haitian",
				"Herzegovinian",
				"Honduran",
				"Hungarian",
				"Icelander",
				"Indian",
				"Indonesian",
				"Iranian",
				"Iraqi",
				"Irish",
				"Israeli",
				"Italian",
				"Ivorian",
				"Jamaican",
				"Japanese",
				"Jordanian",
				"Kazakhstani",
				"Kenyan",
				"Kittian and Nevisian",
				"Kuwaiti",
				"Kyrgyz",
				"Laotian",
				"Latvian",
				"Lebanese",
				"Liberian",
				"Libyan",
				"Liechtensteiner",
				"Lithuanian",
				"Luxembourger",
				"Macedonian",
				"Malagasy",
				"Malawian",
				"Malaysian",
				"Maldivan",
				"Malian",
				"Maltese",
				"Marshallese",
				"Mauritanian",
				"Mauritian",
				"Mexican",
				"Micronesian",
				"Moldovan",
				"Monacan",
				"Mongolian",
				"Moroccan",
				"Mosotho",
				"Motswana",
				"Mozambican",
				"Namibian",
				"Nauruan",
				"Nepalese",
				"New Zealander",
				"Ni-Vanuatu",
				"Nicaraguan",
				"Nigerien",
				"North Korean",
				"Northern Irish",
				"Norwegian",
				"Omani",
				"Pakistani",
				"Palauan",
				"Panamanian",
				"Papua New Guinean",
				"Paraguayan",
				"Peruvian",
				"Polish",
				"Portuguese",
				"Qatari",
				"Romanian",
				"Russian",
				"Rwandan",
				"Saint Lucian",
				"Salvadoran",
				"Samoan",
				"San Marinese",
				"Sao Tomean",
				"Saudi",
				"Scottish",
				"Senegalese",
				"Serbian",
				"Seychellois",
				"Sierra Leonean",
				"Singaporean",
				"Slovakian",
				"Slovenian",
				"Solomon Islander",
				"Somali",
				"South African",
				"South Korean",
				"Spanish",
				"Sri Lankan",
				"Sudanese",
				"Surinamer",
				"Swazi",
				"Swedish",
				"Swiss",
				"Syrian",
				"Taiwanese",
				"Tajik",
				"Tanzanian",
				"Thai",
				"Togolese",
				"Tongan",
				"Trinidadian or Tobagonian",
				"Tunisian",
				"Turkish",
				"Tuvaluan",
				"Ugandan",
				"Ukrainian",
				"Uruguayan",
				"Uzbekistani",
				"Venezuelan",
				"Vietnamese",
				"Welsh",
				"Yemenite",
				"Zambian",
				"Zimbabwean"
			];
			return nationalities.includes(input);
		}
		case "email":
			return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input);
		case "phone":
			return /^\+?\d{1,3}[- .]?\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4}$/.test(input);
		case "birthdate":
			return this.validateBirthdate(input);
		case "address":
			return /^[a-zA-Z0-9\s.,#-]+$/.test(input);
		}
	}

	validateBirthdate(date){
		const match = date.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
		if (!match) return false;

		const birthdate = new Date(date);
		if(!birthdate) return false;

		const currentDate = new Date();
		const dateEighteenYearsAgo = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
		if(birthdate >= dateEighteenYearsAgo) return false;

		const minDate = new Date("1900-01-01");
		if(birthdate >= minDate) return true;

		const daysInMonth = new Date(year, month, 0).getDate();
		const year = parseInt(match[0]);
		const month = parseInt(match[1]);
		const day = parseInt(match[2]);
		if (isNaN(year) || isNaN(month) || isNaN(day) || day < 1 || day > daysInMonth) {
			return false;
		}

	}
};