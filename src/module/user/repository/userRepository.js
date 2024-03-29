const AbstractRepository = require("../../abstractRepository");
const { fromModelToUserEntity } = require("../mapper/userMapper");
const UserNotFoundError = require("./error/userNotFoundError");
const CouldNotDeleteUser = require("./error/couldNotDeleteUser");
const UserIdNotDefinedError = require("./error/userIdNotDefinedError");

module.exports = class UserRepository extends AbstractRepository {
	constructor(userModel, reserveModel) {
		super();
		this.userModel = userModel;
		this.reserveModel = reserveModel;
	}

	async getAll() {
		const users = await this.userModel.findAll({
			attributes: {
				exclude: ["created_at", "updated_at"]
			}
		});


		if (users.length === 0) {
			return false;
		}

		return users.map((user) => fromModelToUserEntity(user.toJSON()));
	}

	async getById(id) {
		if(id === undefined){
			throw new UserIdNotDefinedError("User id is not defined");
		}

		const user = await this.userModel.findByPk(id, {
			attributes: {
				exclude: ["created_at", "updated_at"]
			}
		});

		if (!user) {
			throw new UserNotFoundError("User not found");
		}

		return fromModelToUserEntity(user.toJSON());
	}

	async save(user) {
		const userToSave = {
			id: user.id ? user.id : null,
			names: user.names,
			surnames: user.surnames,
			personal_id_type: user.personalIdType,
			personal_id_number: user.personalIdNumber,
			nationality: user.nationality,
			email: user.email,
			phone: user.phone,
			birthdate: user.birthdate,
			address: user.address
		};

		const buildOptions = {
			isNewRecord: !user.id
		};

		let userModel = this.userModel.build(userToSave, buildOptions);
		userModel = await userModel.save();
		const result = await this.getById(userModel.id);

		return result;
	}

	async delete(id) {

		if(id === undefined) {
			throw new UserIdNotDefinedError("User id not defined");
		}

		const userHasReservation = await this.reserveModel.findOne({
			where: {
				fk_user_id: id
			}
		});
		if(userHasReservation) {
			throw new CouldNotDeleteUser("User has reservation");
		}

		const userToDelete = await this.getById(id);

		await this.userModel.destroy({
			where: {
				id
			}
		});
		

		return userToDelete;
	}
};