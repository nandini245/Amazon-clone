const express = require("express");
const router = new express.Router();
const Products = require("../models/product_schema");
const USER = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// Get products data API
router.get("/getproducts", async (req, res) => {
    try {
        const productsData = await Products.find();
        res.status(200).json(productsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get individual product data by ID
router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findOne({ id });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Register data
router.post("/register", async (req, res) => {
    const { fname, email, mobile, password, cpassword } = req.body;
    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "Fill in all the data" });
        console.log("Data not available");
    }
    try {
        const preuser = await USER.findOne({ email: email });
        if (preuser) {
            res.status(422).json({ error: "This user is already registered" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Passwords do not match" });
        } else {
            const finaluser = new USER({ fname, email, mobile, password, cpassword });
            const storedata = await finaluser.save();
            res.status(201).json(storedata);
        }
    } catch (e) {
        console.log("Error during registration: " + e.message);
        res.status(422).send(e);
    }
});

// Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Fill in all the data" });
    }
    try {
        const userlogin = await USER.findOne({ email: email });
        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            const token = await userlogin.generateAuthtoken();
            res.cookie("Amazonweb", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true
            });
            if (!isMatch) {
                res.status(400).json({ error: "Invalid Password" });
            } else {
                res.status(201).json(userlogin);
            }
        } else {
            res.status(400).json({ error: "Invalid Details" });
        }
    } catch (e) {
        res.status(400).json({ error: "Invalid details" });
    }
});

// Add data into cart
router.post("/addcart/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = Products.findOne({ id: id });
        const Usercontact = await USER.findOne({ _id: res.userID });
        if (Usercontact) {
            const cartData = await Usercontact.addcartdata(cart);
            await Usercontact.save();
            res.status(201).json(Usercontact);
        } else {
            res.status(401).json({ error: "Invalid user details" });
        }
    } catch (e) {
        res.status(401).json({ error: "Invalid user details" });
    }
});

// Get cart details
router.get("/cartdetails", authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        res.status(201).json(buyuser);
    } catch (e) {
        console.log(e);
    }
});

// Get valid user
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
        res.status(201).json(validuserone);
    } catch (e) {
        console.log(e);
    }
});

// Remove item from cart
router.get("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id;
        });
        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("Item removed");
    } catch (error) {
        console.log(error + "JWT provided then remove");
        res.status(400).json(error);
    }
});

// Logout user
router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token;
        });
        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("User logged out");
    } catch (error) {
        console.log(error + "JWT provided then logout");
    }
});

module.exports = router;
