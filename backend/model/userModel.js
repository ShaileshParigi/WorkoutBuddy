const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const emailExistence = require("email-existence");
const emailVerify = require("email-verify");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Signup Statics
userSchema.statics.signup = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("User already exists");
  }

  // Verify email existence using email-existence package
  const checkEmailExistence = (email) =>
    new Promise((resolve, reject) => {
      emailExistence.check(email, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });

  try {
    await checkEmailExistence(email);
  } catch (error) {
    throw Error("Email does not exist");
  }

  // Verify email existence using email-verify package
  const checkEmailVerification = (email) =>
    new Promise((resolve, reject) => {
      emailVerify.verify(email, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

  try {
    const verificationResult = await checkEmailVerification(email);
    if (!verificationResult.success) {
      throw Error("Email verification failed");
    }
  } catch (error) {
    throw Error("Email verification failed");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });
  return user;
};

// Login user
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Invalid Email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid Password");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
