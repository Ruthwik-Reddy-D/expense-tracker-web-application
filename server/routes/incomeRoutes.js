const express = require("express");
const Income = require("../models/Income");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id }).sort({ receivedAt: -1 });
    return res.json(income);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch income" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { source, amount, receivedAt, notes } = req.body;
    if (!source || !amount) {
      return res.status(400).json({ message: "Source and amount are required" });
    }

    const income = await Income.create({
      user: req.user.id,
      source,
      amount,
      receivedAt: receivedAt ? new Date(receivedAt) : undefined,
      notes,
    });

    return res.status(201).json(income);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create income" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!income) {
      return res.status(404).json({ message: "Income entry not found" });
    }
    return res.json({ message: "Income removed" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete income" });
  }
});

module.exports = router;
