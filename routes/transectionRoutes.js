const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  addTransection,
  getAllTransection,
  editTransection,
  deleteTransection,
} = require("../controllers/transectionCtrl");

const router = express.Router();

// legacy routes for existing client behavior
router.post("/add-transection", addTransection);
router.post("/edit-transection", editTransection);
router.post("/delete-transection", deleteTransection);
router.post("/get-transection", getAllTransection);

// RESTful routes with auth support
router.get("/", authMiddleware, getAllTransection);
router.post("/", authMiddleware, addTransection);
router.put("/:transactionId", authMiddleware, editTransection);
router.delete("/:transactionId", authMiddleware, deleteTransection);

module.exports = router;
