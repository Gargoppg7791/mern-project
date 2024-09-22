const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define schema
const registerSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure this field is unique
        trim: true    // Removes any whitespace from the email
    },
    number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    confirmpassword: {
        type: String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
});
//generating tokens
registerSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this.id);
        const token = jwt.sign({ _id: this._id.toString()}, process.env["SECRET-KEY"]);
        this.tokens = this.tokens.concat({token})
        await this.save();
        return token;

    }catch(err){
        res.send("the err part" + err);
        console.log("the err part" + err);

    }
}

registerSchema.pre("save", async function (next) {

    if ( this.isModified("password")){
        //actal password kya tha
        
        this.password = await bcrypt.hash(this.password, 10);
        //after hash mera password
        
        //for conform password
        this.confirmpassword = await bcrypt.hash(this.password, 10);

    }
    
    next()
});

// Create model
const Register = mongoose.model('Register', registerSchema);

module.exports = Register;
