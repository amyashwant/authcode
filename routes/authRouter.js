const router = require("express").Router();
const { signup, login } = require("../controller/auth");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.get("/login", login);
router.get("/signup", signup);

router.get("/test", auth, (req, res) => {
  res.status(200).send({
    success: true,
    message: "you are in protected test route",
  });
});
router.get("/student", auth, isStudent, (req, res) => {
  res.status(200).send({
    success: true,
    message: "you are authorized to student portal",
  });
});
router.get("/admin", auth, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "you are authorized to admin portal",
  });
});

module.exports = router;
