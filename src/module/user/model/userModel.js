const { Sequelize, Model: AbstractModel, DataTypes } = require("sequelize");

module.exports = class UserModel extends AbstractModel{
	static setup(sequelizeInstance) {        
		UserModel.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
					unique: true    
				},
				names: {
					type: DataTypes.STRING,
					allowNull: false
				},
				surnames: {
					type: DataTypes.STRING,
					allowNull: false
				},
				personal_id_type: {
					type: DataTypes.STRING,
					allowNull: false
				},
				personal_id_number: {
					type: DataTypes.STRING,
					allowNull: false
				},
				nationality: {
					type: DataTypes.STRING,
					allowNull: false
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false
				},
				address: {
					type: DataTypes.STRING,
					allowNull: false
				},
				phone: {
					type: DataTypes.STRING,
					allowNull: false
				},
				birthdate: {
					type: DataTypes.DATE,
					allowNull: false
				},
				created_at: {
					type: DataTypes.DATE,
					defaultValue: Sequelize.NOW
				},
				updated_at: {
					type: DataTypes.DATE,
					defaultValue: Sequelize.NOW
				}
			},
			{
				sequelize: sequelizeInstance,
				modelName: "User",
				timestamps: false
			}
		);

		UserModel.sync({ force: false });
		
		return UserModel;
	}
};