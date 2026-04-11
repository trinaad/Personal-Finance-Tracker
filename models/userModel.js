const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required and should be unique"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  if (isMatch) {
    return true;
  }

  // fallback for legacy plaintext passwords stored before bcrypt was added
  const isPlaintextMatch = candidatePassword === this.password;
  if (isPlaintextMatch) {
    this.password = candidatePassword;
    await this.save();
    return true;
  }

  return false;
};

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
