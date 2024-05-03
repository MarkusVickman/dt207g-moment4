
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//mongoose-schema för användare. Skapande datum skapas automatiskt
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

//Innan en user lagras i databasen hashas lösenordet för att det inte ska gå att läsa av i klartext.
userSchema.pre("save", async function (next) {
    try {
        if (this.isNew || this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }

        next();
    } catch (error) {
        next(error);
    }
});

//Vid inloggning hashas det inskrivna lösenordet och testas mot det hashade lösenorden som finns i databasen.
userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;

