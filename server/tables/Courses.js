const mongoose = require("mongoose");
const schema = mongoose.Schema;

const courseSchema = new schema({
    courseName : {
        type: String,
        required: true
    },
    imgUrl : {
        type: String,
        required: true
    },
    timeStamp : {
        type: String,
        required : true
    }
});


module.exports = Course = mongoose.model("course",courseSchema);