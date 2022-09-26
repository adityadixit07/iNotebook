const { request, application } = require("express");
const expres = require("express");
const router = expres.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser=require('../middlewares/fetchUser')

const jwt_secret = "aditya@7054Dixit";
// create a user using post "/api/auth/" .It doesn't require auth
// router :1
router.post(
  "/createUser",
  [
    body("name", "enter a valid name").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "enter the strong password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // give message on bad  errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // check that the user already exist with the email or not?
      let user = await User.findOne({ email: req.body.email });
      // console.log(user);
      if (user) {
        return res
          .status(400)
          .json({ error: "User already exist with this email." });
      }
      // hashing ans salt
      const salt = await bcrypt.genSalt(10);
      const securepass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securepass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      //    .then(user=>res.json(user)).
      //    catch(err=>{console.log(err);
      //  res.json({message:"enter the unique value",message:err.message})});

      const authtoken = jwt.sign(data, jwt_secret);
      console.log(authtoken);
      res.json(authtoken); //returning the authtoken when any user sign then they get authtoken
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error!");
    }
  }
);

// authenticate the user :no login required
// router 2
router.post(
  "/login",
  [
    body("email", "enter a valid name").isEmail(),
    body("password", "password cann't be empty").exists(),
  ],
  async (req, res) => {
    // returning the bad errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "Login with right credentials" });
      }
      const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        return res.status(404).json({ error: "Login with right credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server problem!");
    }
  }
);

// get logged in user detail
// router :3

router.post("/getUser",fetchUser,async (req, res) => {
    
    try {
      const userid = req.user.id
      const user = await User.findById(user.id).select("-password");
      res.send(user)
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal error occured");
    }
  }
);

module.exports = router;
