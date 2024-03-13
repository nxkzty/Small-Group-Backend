import { DataTypes } from "sequelize"
import bcrypt from "bcrypt"
import sequelize from "./index.js"

export default sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate(user) {
            const salt = bcrypt.genSaltSync(10)
            user.password = bcrypt.hashSync(user.password, salt)
        }
    }
})