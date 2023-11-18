const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: {
        values: ["Mr", "Mrs", "Miss"],
        message: "Must be 'Mr', 'Mrs', or 'Miss'."
      },
      trim: true
    },
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    
      validate: {
        validator: function (value) {
          return mongoose.models.authors
            .findOne({ email: { $regex: new RegExp(`^${value}$`, 'i') } })
            .then((existingAuthor) => !existingAuthor);
        },
        message: "Email is already in use."
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, 'Must be at least 8 characters'],
      maxlength: [15, 'Must be at most 15 characters']
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('authors', authorSchema);
