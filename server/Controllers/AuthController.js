const express = require("express");
const { cleanUpAndValidate } = require("../Utils/AuthUtil");
const AuthRouter = express.Router();
const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const { isAuth } = require("../Middlewares/AuthMiddleware");

AuthRouter.post("/register", async (req, res) => {
  const { username, name, password, email } = req.body;

  //clean the data
  try {
    await cleanUpAndValidate({ email, username, password, name });
  } catch (error) {
    return res.status(400).send({
      message: "Data related error",
      error: error,
    });
  }

  try {
    await User.verifyUsernameAndEmailsExits({ email, username });

    const userObj = new User({
      name,
      email,
      password,
      username,
    });

    const userDb = await userObj.registerUser();

    return res.status(201).send({
      message: "Registeration successfull",
      data: userDb,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

AuthRouter.post("/login", async (req, res) => {

  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).send({
      message: "Missing credentials",
    });
  }

  try {
    const userDb = await User.findUserEmailUsername({ loginId });

    //compare the passoword

    const isMatch = await bcrypt.compare(password, userDb.password);

    if (!isMatch) {
      return res.status(400).send({
        message: "Wrong Password",
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.status(200).send({
      message: "Login Successfull",
      data: userDb,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Database error",
      error: error,
    });
  }
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  console.log(session)
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send({
        message: "Logout unsuccessfull",
        error: err,
      });
    }

    return res.status(200).send({
      message: "Logout successfull",
    });
  });
});

module.exports = AuthRouter;

//index.js   routes  controller

//Schema<--->Model(User)<---->Controllers<--->server(index.js)<--------->Client
