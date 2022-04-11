const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL,
     {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
         useFindAndModify: false,

     }
     ).then(()=> console.log("connected to MongoDB"))
      .catch((err) => console.log("Failed to connect to MongoDB",err));


