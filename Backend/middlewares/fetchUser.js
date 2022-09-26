const jwt = require("jsonwebtoken");

const jwt_secret = "aditya@7054Dixit";
const fetchUser = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please autheticate with valid tokens" });
  }
  try {
    const data = jwt.verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.send(401).send({ error: "please authenticate with valid tokens" });
  }
};

module.exports = fetchUser;
