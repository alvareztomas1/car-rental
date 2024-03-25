const Car = require("../../entity/car");
const { fromModelToCarEntity } = require("../carMapper");

test("transforms a model into a Car entity", () => {
	expect(fromModelToCarEntity({})).toBeInstanceOf(Car);
});