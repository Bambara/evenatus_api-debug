const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, "cyP5R$MR%u28ASt236*ET9YS", (err, decode) => {
      if (err) {
        res.status(401).json({ error: err.toString() });
      } else {
        req.user = decode;
        console.info({ "Logged User": req.user.user_name });
        next();
      }
    });
  } else {
    res.status(401).json({ message: "No Authentication" });
  }
};

const isPremium = (req, res, next) => {
  if (req.user && req.user.role === "PREMIUM") {
    console.info({ "User Role": req.user.role });
    next();
  } else {
      res.status(498).json({ message: "Invalid Premium Token" });
  }
};

const isPlayer = (req, res, next) => {
  if (req.user && req.user.role === "FREE") {
    console.info({ "User Role": req.user.role });
    next();
  } else {
    res.status(498).json({ message: "Invalid Player Token" });
  }
};

module.exports = {
  isAuth,
  isPremium,
  isPlayer,
};
