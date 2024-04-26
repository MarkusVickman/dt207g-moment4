const mongoose = require("mongoose");
// Skapa ett db-schema
const WorkSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});


// Skapa en model
const WorkExperience = mongoose.model('Work_experience', WorkSchema);
module.exports = WorkExperience;