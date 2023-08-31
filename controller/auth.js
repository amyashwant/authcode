const Signup = require("../models/signupModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Signup
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const emailCheck = await Signup.findOne({ email });

  if (!email || !password) {
    res.status(401).send({
      success: false,
      message: "please enter all the details",
    });
  }

  if (emailCheck) {
    res.status(401).json({
      success: false,
      message: "email id is already registered",
    });
  }

  //   try {
  //     let hashedPassword = await bcrypt.hash(password, 10);
  //   } catch (error) {
  //     res.status(403).json({
  //       success: false,
  //       message: "something wrong with password",
  //     });
  //   }
  let hashedPassword = await bcrypt.hash(password, 10);

  const signup = new Signup({ name, email, password: hashedPassword, role });
  const savedSignup = await signup.save();

  res.status(200).json({
    success: true,
    message: "user is successfully registered",
    data: savedSignup,
  });
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailCheck = await Signup.findOne({ email });
    // console.log(emailCheck);
    if (!emailCheck) {
      return res.status(401).json({
        success: false,
        message: "email is not registered, first register",
      });
    }

    const passwordCheck = await bcrypt.compare(password, emailCheck.password);
    // console.log(passwordCheck);

    const payload = {
      email: emailCheck.email,
      id: emailCheck._id,
      role: emailCheck.role,
    };

    if (passwordCheck) {
      let token = jwt.sign(payload, process.env.SEC_KEY, { expiresIn: "3h" });
      //   console.log(token);
      //   console.log(emailCheck);

      //   emailCheck = emailCheck.toObject();
      emailCheck.token = token;
      //   console.log(emailCheck);
      emailCheck.password = undefined;
      //   console.log(emailCheck);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      //   console.log(options);
      return res.cookie("token", token, options).status(200).send({
        success: true,
        token,
        emailCheck,
        message: "user logged in successfully",
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "password do not match",
      });
    }
  } catch (error) {
    res.status(409).send({
      success: false,
      message: error,
    });
  }
};
