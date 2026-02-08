const express = require("express");
const Expense = require("../models/Expense");
const Income = require("../models/Income");
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
    const { period } = req.query;
    const range = period ? getDateRange(period) : null;

    const expenseFilter = {
      user: req.user.id,
      ...(range ? { spentAt: { $gte: range.start, $lte: range.end } } : {}),
    };

    const incomeFilter = {
      user: req.user.id,
      ...(range ? { receivedAt: { $gte: range.start, $lte: range.end } } : {}),
    };

    const [expenses, income] = await Promise.all([
      Expense.find(expenseFilter),
      Income.find(incomeFilter),
    ]);

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

    const byCategory = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    return res.json({
      totalExpenses,
      totalIncome,
      savings: totalIncome - totalExpenses,
      byCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to build summary" });
  }
});

module.exports = router;
