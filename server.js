require ("dotenv").config() //to access .env resources throughout the express server
const app = require("./src/app")
const connectToDB = require('./src/config/db')

connectToDB();

app.listen(3000, ()=>{
    console.log("Server is running on Port 3000")
})