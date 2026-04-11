const mongoose = require("mongoose");

const transectionSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
    reference: {
      type: String,
    },
    description: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
  },
  { timestamps: true },
);

transectionSchema.index({ userid: 1, date: -1 });

const transectionModel = mongoose.model("transections", transectionSchema);
module.exports = transectionModel;
