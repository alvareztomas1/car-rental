const User = require("../../entity/user");
const { fromModelToUserEntity } = require("../userMapper");

test("transforms a model into a User entity", () => {
	expect(fromModelToUserEntity({birthdate: new Date()})).toBeInstanceOf(User);
});