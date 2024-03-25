const Reserve = require("../../entity/reserve");
const { fromModelToReserveEntity } = require("../reserveMapper");

test("transforms a model into a Reserve entity", () => {
	expect(fromModelToReserveEntity({since: new Date(), until: new Date()})).toBeInstanceOf(Reserve);
});