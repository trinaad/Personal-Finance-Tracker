const transectionModel = require("../models/transectionModel");
const moment = require("moment");
const Joi = require("joi");

const getAllTransection = async (req, res) => {
  try {
    const schema = Joi.object({
      userid: Joi.string().optional(),
      frequency: Joi.string().valid("7", "30", "365", "custom").required(),
      type: Joi.string().valid("all", "income", "expense").required(),
      selectedDate: Joi.when("frequency", {
        is: "custom",
        then: Joi.array().items(Joi.date()).length(2).required(),
        otherwise: Joi.array().optional(),
      }),
    });

    const requestBody = {
      ...req.body,
      userid: req.userId || req.body.userid,
    };

    const { error } = schema.validate(requestBody);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    const { frequency, selectedDate, type, userid } = requestBody;
    const query = {
      userid,
      ...(type !== "all" && { type }),
      ...(frequency !== "custom"
        ? {
            date: {
              $gt: moment().subtract(Number(frequency), "d").toDate(),
            },
          }
        : {
            date: {
              $gte: selectedDate[0],
              $lte: selectedDate[1],
            },
          }),
    };

    const transections = await transectionModel.find(query).lean();
    res.status(200).json(transections);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message || error });
  }
};

const deleteTransection = async (req, res) => {
  try {
    const schema = Joi.object({
      transactionId: Joi.string().required(),
    });

    const transactionId = req.body.transactionId || req.params.transactionId;
    const { error } = schema.validate({ transactionId });
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    const query = { _id: transactionId };
    if (req.userId) {
      query.userid = req.userId;
    }

    const deleted = await transectionModel.findOneAndDelete(query);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Transaction not found" });
    }

    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message || error });
  }
};

const editTransection = async (req, res) => {
  try {
    const schema = Joi.object({
      amount: Joi.alternatives()
        .try(Joi.number().positive(), Joi.string().pattern(/^\d+(\.\d{1,2})?$/))
        .required(),
      type: Joi.string().valid("income", "expense").required(),
      category: Joi.string().required(),
      date: Joi.date().required(),
      description: Joi.string().optional(),
      reference: Joi.string().optional(),
    });

    const payload = req.body.payload || req.body;
    const { error } = schema.validate(payload);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    const transactionId = req.body.transactionId || req.params.transactionId;
    const query = { _id: transactionId };
    if (req.userId) {
      query.userid = req.userId;
    }

    const updated = await transectionModel.findOneAndUpdate(query, payload, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Transaction not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Edit successful",
        transaction: updated,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message || error });
  }
};

const addTransection = async (req, res) => {
  try {
    const schema = Joi.object({
      userid: Joi.string().optional(),
      amount: Joi.alternatives()
        .try(Joi.number().positive(), Joi.string().pattern(/^\d+(\.\d{1,2})?$/))
        .required(),
      type: Joi.string().valid("income", "expense").required(),
      category: Joi.string().required(),
      date: Joi.date().required(),
      description: Joi.string().optional(),
      reference: Joi.string().optional(),
    });

    const requestBody = {
      ...req.body,
      userid: req.userId || req.body.userid,
    };

    const { error } = schema.validate(requestBody);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    if (!requestBody.userid) {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required" });
    }

    const newTransection = new transectionModel(requestBody);
    await newTransection.save();
    res.status(201).json({ success: true, message: "Transaction created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message || error });
  }
};

module.exports = {
  getAllTransection,
  addTransection,
  editTransection,
  deleteTransection,
};
