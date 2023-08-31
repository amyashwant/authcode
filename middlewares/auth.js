const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    console.log("body", req.body.token);
    console.log("cookies", req.cookies?.token);
    const token =
      req.body.token ||
      req.cookies?.token ||
      req.header("Authorization").replace("Bearer ", "");
    // const token = req.body.token;
    // console.log(token);
    const payload = jwt.verify(token, process.env.SEC_KEY);
    //   console.log(user);

    if (!token || token === undefined) {
      return res.status(401).send({
        success: false,
        message: "token missing",
      });
    }
    req.user = payload;
    // console.log(req.user);

    // res.status(200).send({
    //   success: true,
    //   message: "authenticated user",
    // });
    next();
  } catch (error) {
    res.status(403).send({
      success: false,
      message: "error in authentication1",
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      res.status(401).send({
        success: false,
        message: "unathorized user",
      });
    }
    next();
    // return res.status(401).json({
    //   success: false,
    //   message: "unathorized user",
    // });
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: "error in authorisation 1",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "unathorized user",
      });
    }
    next();

    // return res.status(401).json({
    //   success: false,
    //   message: "unathorized user",
    // });
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: error,
    });
  }
};
