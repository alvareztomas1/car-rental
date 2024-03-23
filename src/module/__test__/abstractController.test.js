const AbstractController = require("../abstractController");
const AbstractControllerError = require("../error/abstractControllerError");

test("An AbstractController cannot be instantiated", () => {
	let controllerInstance;
	try{
		controllerInstance = new AbstractController();
	}catch(e){
		expect(e).toBeInstanceOf(AbstractControllerError);
	} finally{
		expect(controllerInstance).toBeUndefined();
	}
});

test("A concrete controller can be instantiated", () => {
	let ConcreteController = class  extends AbstractController{};	
	expect(new ConcreteController()).toBeInstanceOf(AbstractController);
	
});