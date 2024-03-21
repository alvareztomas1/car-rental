const { Sequelize, Model: AbstractModel, DataTypes } = require("sequelize");

module.exports = class CarModel extends AbstractModel{
	static setup(sequelizeInstance){
		CarModel.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
					unique: true
				},
				brand: {
					type: DataTypes.STRING,
					allowNull: false
				},
				model: {
					type: DataTypes.STRING,
					allowNull: false
				},
				car_year: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				transmission: {
					type: DataTypes.STRING,
					allowNull: false
				},
				seats: {
					type: DataTypes.STRING,
					allowNull: false
				},
				doors: {
					type: DataTypes.STRING,
					allowNull: false
				},
				air_conditioning: {
					type: DataTypes.BOOLEAN,
					allowNull: false
				},
				trunk: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				fuel: {
					type: DataTypes.STRING,
					allowNull: false
				},
				price: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				unlimited_mileage: {
					type: DataTypes.BOOLEAN,
					allowNull: false
				},
				car_image: {
					type: DataTypes.STRING,
					allowNull: false
				},
				car_description: {
					type: DataTypes.STRING,
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
				modelName: "Car",
				timestamps: false
			}
		);
		
		return CarModel;
	}

};