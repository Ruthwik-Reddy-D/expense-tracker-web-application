const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/";
}

const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
const periodFilter = document.getElementById("period-filter");
const expenseList = document.getElementById("expense-list");
const incomeList = document.getElementById("income-list");
const expenseForm = document.getElementById("expense-form");
const incomeForm = document.getElementById("income-form");
const logoutButton = document.getElementById("logout");

let categoryChart;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);

const renderList = (container, items, amountKey, titleKey, dateKey) => {
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = "<p class='muted'>No entries yet.</p>";
    return;
  }

  items.forEach((item) => {
    const element = document.createElement("div");
    element.className = "list-item";
    element.innerHTML = `
      <div>
        <strong>${item[titleKey]}</strong>
        <span>${new Date(item[dateKey]).toLocaleDateString()}</span>
      </div>
      <div>${formatCurrency(item[amountKey])}</div>
    `;
    container.appendChild(element);
  });
};

const updateChart = (categoryData) => {
  const labels = Object.keys(categoryData);
  const values = Object.values(categoryData);

  const ctx = document.getElementById("categoryChart").getContext("2d");
  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#3f52ff", "#f97316", "#10b981", "#38bdf8", "#a855f7"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
};

const loadSummary = async () => {
  const period = periodFilter.value;
  const response = await fetch(`/api/summary?period=${period}`, { headers });
  const data = await response.json();

  document.getElementById("total-expenses").textContent = formatCurrency(data.totalExpenses);
  document.getElementById("total-income").textContent = formatCurrency(data.totalIncome);
  document.getElementById("total-savings").textContent = formatCurrency(data.savings);
  updateChart(data.byCategory || {});
};

const loadExpenses = async () => {
  const period = periodFilter.value;
  const response = await fetch(`/api/expenses?period=${period}`, { headers });
  const data = await response.json();
  renderList(expenseList, data, "amount", "title", "spentAt");
};

const loadIncome = async () => {
  const response = await fetch("/api/income", { headers });
  const data = await response.json();
  renderList(incomeList, data, "amount", "source", "receivedAt");
};

periodFilter.addEventListener("change", async () => {
  await Promise.all([loadSummary(), loadExpenses()]);
});

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(expenseForm);
  const payload = Object.fromEntries(formData.entries());
  payload.amount = Number(payload.amount);

  const response = await fetch("/api/expenses", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    expenseForm.reset();
    await Promise.all([loadSummary(), loadExpenses()]);
  }
});

incomeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(incomeForm);
  const payload = Object.fromEntries(formData.entries());
  payload.amount = Number(payload.amount);

  const response = await fetch("/api/income", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    incomeForm.reset();
    await Promise.all([loadSummary(), loadIncome()]);
  }
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
});

Promise.all([loadSummary(), loadExpenses(), loadIncome()]);
