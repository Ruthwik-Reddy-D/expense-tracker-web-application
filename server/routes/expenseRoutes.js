const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

const getDateRange = (period) => {
  const now = new Date();
  const start = new Date(now);
  if (period === "weekly") {
    start.setDate(now.getDate() - 6);
  } else if (period === "monthly") {
    start.setMonth(now.getMonth() - 1);
  } else {
    start.setHours(0, 0, 0, 0);
  }
  return { start, end: now };
};

router.get("/", auth, async (req, res) => {
  try {
    const { period, start, end } = req.query;
    let dateFilter = {};
    if (start && end) {
      dateFilter = { $gte: new Date(start), $lte: new Date(end) };
    } else if (period) {
      const range = getDateRange(period);
      dateFilter = { $gte: range.start, $lte: range.end };
    }

    const expenses = await Expense.find({
      user: req.user.id,
      ...(Object.keys(dateFilter).length ? { spentAt: dateFilter } : {}),
    }).sort({ spentAt: -1 });

    return res.json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch expenses" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, amount, category, spentAt, notes } = req.body;
    if (!title || !amount || !category) {
      return res.status(400).json({ message: "Title, amount, and category are required" });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category,
      spentAt: spentAt ? new Date(spentAt) : undefined,
      notes,
    });

    return res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({ message: "Unable to create expense" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    return res.json({ message: "Expense removed" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete expense" });
  }
});

module.exports = router;
