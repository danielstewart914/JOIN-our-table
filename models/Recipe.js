const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Recipe extends Model {}

Recipe.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  image_path: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
  recipe_title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  directions: {
    type: DataTypes.STRING(6000),
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "user",
      key: "id",
    },
  },
  public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
