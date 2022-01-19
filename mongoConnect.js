const mongoose = require('mongoose');



mongoose.connect('mongodb://localhost:27017/lab5').then(()=>{
    console.log("connected")
    }); 