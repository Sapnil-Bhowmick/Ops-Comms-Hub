const mongoose = require("mongoose")

const Initialize_DB_Connection = async(connection_URL) => {
    const connection = await mongoose.connect(connection_URL , {dbName: "Bread_Butter"})
    return connection
}

module.exports = Initialize_DB_Connection