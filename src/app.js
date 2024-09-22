require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
require("./db/conn"); // MongoDB connection
const Register = require("./models/registers"); // User model
const hbs = require("hbs");
const bcrypt =require("bcrypt");
const port = process.env.PORT || 3000;

// Define paths for Express config
const static_path = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../views");
const partials_path = path.join(__dirname, "../views/partials");

app.use(express.json());

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partials_path);

// Setup static directory to serve
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: false })); // To parse form data

console.log(process.env["SECRET-KEY"]);

// Routes
app.get("/signin", (req, res) => {
    res.render("signin");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register new user
app.post("/register", async (req, res) => {
    try {
        //data ko get
        const { Username, email, number, password, confirmpassword } = req.body;

        // Check if all fields are provided
        if (!Username || !email || !number || !password || !confirmpassword) {
            return res.status(400).send("Please fill out all fields.");
        }

        // Validate email
        if (!email.trim()) {
            return res.status(400).send("Email cannot be empty.");
        }

        // Check if passwords match
        if (password !== confirmpassword) {
            return res.status(400).send("Passwords do not match.");
        }

        // Check if the email already exists in the database
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already registered.");
        }

        // Save the user data to the database
        const registerUser = new Register({
            Username,
            email: email.trim(), // Trim to ensure no spaces
            number,
            password,
            confirmpassword
        });

        //password hash
        //middle concept used here coz we cll this password btw get and save
        console.log("the success part" + registerUser);

        const token = await registerUser.generateAuthToken();
        console.log("the token part" + token);


        await registerUser.save();

        // Redirect to water.hbs page after successful signup
        res.redirect("/water");

    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).send("There was an error registering the user.");
    }
});

// Sign in user
app.post("/signin", async (req, res) => {
    try {
        const { number, password } = req.body;

        // Validate mobile number and password
        if (!number || !password) {
            return res.status(400).send("Mobile number and password are required.");
        }

        // Find the user by mobile number
        const user = await Register.findOne({ number });
//compare password with userpassword that will stored on database for signin
        const isMatch = await bcrypt.compare(password, user.password);

        const token = await user.generateAuthToken();
        console.log("the token part" + token);
        if (!user) {
            return res.status(400).send("Invalid mobile number.");
        }

        // Validate password
        if (isMatch) {
            res.redirect("/water");
            
        }else{
            return res.status(400).send("Invalid password.");

        }

        // Redirect to the water page if login is successful
        

    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).send("There was an error logging in the user.");
    }
});

// Routes for various pages
app.get("/water", (req, res) => {
    res.render("water");
});

app.get("/electricity", (req, res) => {
    res.render("electricity");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/edit", (req, res) => {
    res.render("edit");
});









//hashing 
//const bcrypt =require("bcrypt");

//const securePassword = async (password) => {
// for signup password
    //const passwordHash = await bcrypt.hash(password, 10);
    //console.log(passwordHash);
//for signin password
    //const passwordmatch = await bcrypt.hash(password, passwordHash);
    //console.log(passwordmatch);
//}

//securePassword("pg@123")


//jwt

//const jwt = require("jsonwebtoken");

//const createToken = async() => {
   ////const token = await jwt.sign({_id:"66eedf4feed21d232a0494c4"}, "secretkey", {
   //expiresIn: "2 seconds"
   //////});
   
   ////console.log(token);

   //const userver = jwt.verify(token, "secretkey");
   ////console.log(userver);
//}

//createToken();



// Listen on port
app.listen(port, () => {
    console.log("Server is running on port 3000");
});



