
import { DataTypes,Sequelize } from 'sequelize'; 
import dotenv from 'dotenv'
dotenv.config()
const dbConfig = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
  dialectOptions: {
    ssl: {
      require: true,  // Enforces SSL connection
      rejectUnauthorized: false, // Optional, depends on your environment (self-signed cert)
    },
  },
};

const sequelize = new Sequelize(dbConfig);
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            isEmail: {
                args: true,
                msg: 'Please provide a valid email address',
            },
        },
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        trim: true,
        
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['male', 'female', 'other']],
                msg: 'Gender must be one of the following: male, female, other',
            },
        },
    },
    avatar_id: {
        type: DataTypes.STRING, 
        allowNull: true,  
    },
}, {
    timestamps: true, 
});

export default User;
