const authorModel = require("../models/authorModel.js");

const createAuthor = async function (req, res) {
  try {
    const data = req.body;
    
    if (data.password.length < 8 || data.password.length > 15) {
      return res.status(400).send({
        status: false,
        msg: "Password length should be between 8 to 15 characters",
      });
    }

    const duplicateEmail = await authorModel.findOne({ email: data.email });

    if (duplicateEmail) {
      return res.status(400).send({ status: false, msg: "Email already exists" });
    }

    const createdAuthor = await authorModel.create(data);

    res.status(201).send({
      status: true,
      message: "Author created successfully",
      data: createdAuthor,
    });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

module.exports = { createAuthor };
