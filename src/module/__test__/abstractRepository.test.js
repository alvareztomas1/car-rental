const AbstractRepository = require("../abstractRepository");
const AbstractRepositoryError = require("../error/abstractRepositoryError");

test("An AbstractRepository cannot be instantiated", () => {
	let repositoryInstance;
	try{
		repositoryInstance = new AbstractRepository();
	}catch(e){
		expect(e).toBeInstanceOf(AbstractRepositoryError);
	} finally{
		expect(repositoryInstance).toBeUndefined();
	}
});

test("A concrete repository can be instantiated", () => {
	let ConcreteRepository = class  extends AbstractRepository{};	
	expect(new ConcreteRepository()).toBeInstanceOf(AbstractRepository);
	
});