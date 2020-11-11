const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // TODO: 9.4 Implement this
  name: {
    type: String,
    trim: true,
    required: "Name is required",
    validate: [
      function(input) {
        return input.length <= 50;
      }
    ]
  },
  email: {
    type: String,
    trim: true,
    required: "Email is required",
    unique: "Email has been used",
    match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/]
  },
  password: {
    type: String,
    required: "Password is required",
    validate: [
      function(input) {
        return input.length >= 10;
      },
      "Password should be longer."
    ],
    set: [(input) => {
      if (input.length >= 10) {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(input, salt);
      }
    }]
  },
  role: {
    type: String,
    required: "Role is required",
    default: "customer",
    enum: ["admin", "customer"],
    trim: true,
    lowercase: true
  }
});

/**
 * Compare supplied password with user's own (hashed) password
 *
 * @param {string} password
 * @returns {Promise<boolean>} promise that resolves to the comparison result
 */
userSchema.methods.checkPassword = async function (password) {
  // TODO: 9.4 Implement this
  return await bcrypt.compare(password, this.password);
};

// Omit the version key when serialized to JSON
userSchema.set("toJSON", { virtuals: false, versionKey: false });

const User = new mongoose.model("User", userSchema);
module.exports = User;
