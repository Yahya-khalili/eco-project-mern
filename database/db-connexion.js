const mongoose = require("mongoose");
const connection_string = "mongodb+srv://root:root@eco-project.gu74etc.mongodb.net/db-store?retryWrites=true&w=majority&appName=eco-project";

mongoose.connect(connection_string, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => console.log("DB CONNECTED...")).catch((error) => console.log(error.message))