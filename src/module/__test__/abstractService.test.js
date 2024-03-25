const AbstractService = require("../abstractService");
const AbstractServiceError = require("../error/abstractServiceError");

test("An AbstractService cannot be instantiated", () => {
	let serviceInstance;
	try{
		serviceInstance = new AbstractService();
	}catch(e){
		expect(e).toBeInstanceOf(AbstractServiceError);
	} finally{
		expect(serviceInstance).toBeUndefined();
	}
});

test("A concrete service can be instantiated", () => {
	let ConcreteService = class  extends AbstractService{};	
	expect(new ConcreteService()).toBeInstanceOf(AbstractService);
	
});