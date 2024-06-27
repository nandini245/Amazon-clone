const mongoose = require("mongoose");
const DB= process.env.DATABASE;
mongoose.connect(DB).then(()=>console.log("DB connected")).catch((e)=>console.log(e))
// QVZUx63ZYK0l7BxI