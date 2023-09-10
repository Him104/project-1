const authorModel = require("../models/authorModel.js");

const createAuthor = async function (req, res) {
    try {
      const data = req.body;
      if (!data.title) {
        return res
          .status(400)
          .send({ status: false, msg: "title is required field" });
      }
      if (!data.fname) {
        return res.status(400).send({ status: false, msg: "fname is required" });
      }
      if (!data.lname) {
        return res.status(400).send({ status: false, msg: "lname is required" });
      }
     
  
      if (!data.email) {
        return res.status(400).send({ status: false, msg: "email is required" });
      }
  
      const duplicateEmail = await authorModel.findOne({ email: data.email });
  
      if (duplicateEmail) {
        return res
          .status(400)
          .send({ status: false, msg: "email already exists" });
      }
  
      if (!data.password) {
        return res
          .status(400)
          .send({ status: false, msg: "password is required" });
      }
  
      if ((data.password.length < 8 && data.password.length >15)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "password length should be between 8 to 15 characters",
          });
      }
  
      const createAuthor = await authorModel.create(data);
      res
        .status(201)
        .send({
          status: true,
          message: "User created successfully",
          data: createAuthor,
        });
    } catch (error) {
      return res.status(500).send({ msg: error.message });
    }
  };
  


module.exports = {createAuthor};