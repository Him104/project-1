const authorModel = require("../models/authorModel.js");
const jwt = require('jsonwebtoken');

const login = async function(req, res) {
  try {
    const data = req.body;

    if (!data.email || !data.password) {
      return res.status(400).send({ status: false, msg: "Email and password are required" });
    }

    const userMatch = await authorModel.findOne({ email: data.email, password: data.password });

    if (!userMatch) {
      return res.status(400).send({ status: false, msg: "Email or password is incorrect" });
    }

    const token = jwt.sign({ userId: userMatch._id.toString() }, process.env.SECRET_KEY, { expiresIn: '80h' });

    return res.status(200).send({
      status: true,
      msg: "You have successfully logged in",
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, error: "Internal Server Error" });
  }
};

module.exports.login = login;
