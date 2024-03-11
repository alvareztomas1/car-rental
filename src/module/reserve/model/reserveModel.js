const { Sequelize, Model: AbstractModel, DataTypes } = require("sequelize");

module.exports = class ReserveModel extends AbstractModel {
	static setup(sequelizeInstance) {
		ReserveModel.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false,
					unique: true
				},
				fk_car_id: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				since: {
					type: DataTypes.DATE,
					allowNull: false
				},
				until: {
					type: DataTypes.DATE,
					allowNull: false
				},
				price_per_day: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				total_price: {
					type: DataTypes.INTEGER,
					allowNull: false
				},
				payed: {
					type: DataTypes.BOOLEAN,
					allowNull: false
				},
				payment_method: {
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
			}, {
				sequelize: sequelizeInstance,
				modelName: "Reserve",
				timestamps: false
			}
		);
	}
	static setUpAssociations(CarModel) {
		ReserveModel.belongsTo(CarModel, { foreignKey: "fk_car_id" });
	}
};