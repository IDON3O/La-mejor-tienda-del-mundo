const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db/sequelize');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  user_role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'normal' // Valor por defecto para nuevos usuarios
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

User.associate = (models) => {
  User.hasMany(models.Product, {
    foreignKey: 'userId',
    as: 'products'
  });
};

User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
