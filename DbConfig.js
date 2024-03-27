const Sequelize = require("sequelize");
const { EmailVerification } = require("./EmailVerificationStatusModel");
require('dotenv').config();

//const { logger } = require("./util/Logging");

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
   {
     host: process.env.DB_HOST,
     dialect: 'mysql'
   } 
 );

const EmailVModel = EmailVerification(db, Sequelize.DataTypes);


const sync = async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    //sync with force true if environment is development
    await db.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    //load the csv file to the database
    //await loadCSVtoDB(process.env.USER_CSV_PATH);
  } catch (error) {
    console.log("error : " + error);
  }
}

module.exports = {
  sync,
  EmailVModel
};