import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Charts.css"; // Ensure this CSS file is present and styled
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";

const ChartsPage = () => {
    const [filter, setFilter] = useState("last15days");
    const [chartData, setChartData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [categoryStackedData, setCategoryStackedData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [dualLineData, setDualLineData] = useState([]);
    const [basicInsights, setBasicInsights] = useState([]);
    const [categoryInsights, setCategoryInsights] = useState([]);
    const [lineInsights, setLineInsights] = useState([]);
    const [categoryStackedInsights, setCategoryStackedInsights] = useState([]);
    const [dualLineInsights, setDualLineInsights] = useState([]);
    const [countData, setCountData] = useState([]);
    const [countInsights, setCountInsights] = useState([]);
    const [darkMode, setDarkMode] = useState(false);

    const navigate = useNavigate();

    const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF6666", "#AA66CC"];

    const filterTextMap = {
        last15days: "Last 15 Days",
        lastmonth: "Last Month",
        last6months: "Last 6 Months",
        lastyear: "Last Year",
        all: "All Time",
    };

    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await axios.get(
                    `https://localhost:7065/api/User/transactions?filter=${filter}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const sentTotal = res.data.sent.reduce((sum, t) => sum + t.amount, 0);
                const receivedTotal = res.data.received.reduce((sum, t) => sum + t.amount, 0);

                // Pie data
                setChartData([
                    { name: "Sent", value: sentTotal },
                    { name: "Received", value: receivedTotal },
                ]);

                // Basic insights
                const basic = [];
                const net = receivedTotal - sentTotal;
                const percentDiff = ((Math.abs(sentTotal - receivedTotal) / (sentTotal + receivedTotal || 1)) * 100).toFixed(1);

                if (sentTotal > receivedTotal) {
                    basic.push(
                        <div key="basic" className="insight-badge bg-red-100 text-red-600">
                            ⚠ Spending exceeded incoming transactions by PKR {net * -1}. (≈ {percentDiff}% more money sent than received)
                        </div>
                    );
                } else if (receivedTotal > sentTotal) {
                    basic.push(
                        <div key="basic" className="insight-badge bg-green-100 text-green-600">
                            ✅ Incoming Transactions exceeded spending by PKR {net}. (≈ {percentDiff}% more received than sent)
                        </div>
                    );
                } else {
                    basic.push(
                        <div key="basic" className="insight-badge bg-blue-100 text-blue-600">
                            ⏸ Balanced: Sent and received amounts were equal = PKR ({sentTotal})
                        </div>
                    );
                }
                setBasicInsights(basic);

                const allTx = [...res.data.sent, ...res.data.received];

                // Category Pie
                const categoryMap = {};
                allTx.forEach((tx) => {
                    const cat = tx.category || "Other";
                    categoryMap[cat] = (categoryMap[cat] || 0) + tx.amount;
                });
                const categoryArray = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
                setCategoryData(categoryArray);

                // Stacked Bar
                const stackedMap = {};
                res.data.sent.forEach((tx) => {
                    const cat = tx.category || "Other";
                    if (!stackedMap[cat]) stackedMap[cat] = { name: cat, sent: 0, received: 0 };
                    stackedMap[cat].sent += tx.amount;
                });
                res.data.received.forEach((tx) => {
                    const cat = tx.category || "Other";
                    if (!stackedMap[cat]) stackedMap[cat] = { name: cat, sent: 0, received: 0 };
                    stackedMap[cat].received += tx.amount;
                });
                setCategoryStackedData(Object.values(stackedMap));

                // Category insights
                const totalAmount = allTx.reduce((sum, t) => sum + t.amount, 0);
                const sortedCategories = categoryArray.sort((a, b) => b.value - a.value);
                const elaborative = [];
                if (sortedCategories.length > 0) {
                    const largest = sortedCategories[0];
                    const smallest = sortedCategories[sortedCategories.length - 1];
                    elaborative.push(
                        <p key="largest" className="text-red-500">
                            📊 <strong>{largest.name}</strong> represents your largest category, accounting for PKR {largest.value} or <strong>{((largest.value / totalAmount) * 100).toFixed(2)}%</strong> of all transactions.
                        </p>
                    );
                    elaborative.push(
                        <p key="smallest" className="text-green-500">
                            ✅ Your smallest category is <strong>{smallest.name}</strong>, with a total of PKR {smallest.value}, making up <strong>{((smallest.value / totalAmount) * 100).toFixed(2)}%</strong> of the total.
                        </p>
                    );
                }
                // Top 3
                elaborative.push(
                    <div className="font-semibold mt-4 mb-2">
                        Most active categories based on your transactions:
                    </div>
                );

                sortedCategories.slice(0, 3).forEach((cat, idx) => {
                    elaborative.push(
                        <div
                            key={`top-${cat.name}`}
                            className="insight-badge bg-green-100 text-green-700"
                        >
                            #{idx + 1} {cat.name}: PKR {cat.value} ({((cat.value / totalAmount) * 100).toFixed(1)}%)
                        </div>
                    );
                });

                // Bottom 3
                elaborative.push(
                    <div className="font-semibold mt-6 mb-2">
                        Least active categories based on your transactions:
                    </div>
                );

                sortedCategories
                    .slice(-3)
                    .reverse()
                    .forEach((cat, idx) => {
                        elaborative.push(
                            <div
                                key={`low-${cat.name}`}
                                className="insight-badge bg-red-100 text-red-700"
                            >
                                #{idx + 1} {cat.name}: PKR {cat.value} ({((cat.value / totalAmount) * 100).toFixed(1)}%)
                            </div>
                        );
                    });

                setCategoryInsights(elaborative);

                // Category Stacked insights
                const stackedValues = Object.values(stackedMap);
                const stackedInsights = [];

                if (stackedValues.length > 0) {
                    const sortedBySent = [...stackedValues].sort((a, b) => b.sent - a.sent);
                    const sortedByReceived = [...stackedValues].sort((a, b) => b.received - a.received);

                    stackedInsights.push(
                        <div key="sent-insights" className="mb-2">
                            <h3 className="font-semibold text-red-600">Sent</h3>
                            <p className="text-red-500">
                                Highest amount sent: "{sortedBySent[0].name}" ({sortedBySent[0].sent} PKR)
                            </p>
                            <p className="text-red-500">
                                Lowest amount sent: "{sortedBySent[sortedBySent.length - 1].name}" ({sortedBySent[sortedBySent.length - 1].sent} PKR)
                            </p>
                        </div>
                    );

                    stackedInsights.push(
                        <div key="received-insights" className="mb-2">
                            <h3 className="font-semibold text-green-600">Received</h3>
                            <p className="text-green-500">
                                Highest amount received: "{sortedByReceived[0].name}" ({sortedByReceived[0].received} PKR)
                            </p>
                            <p className="text-green-500">
                                Lowest amount received: "{sortedByReceived[sortedByReceived.length - 1].name}" ({sortedByReceived[sortedByReceived.length - 1].received} PKR)
                            </p>
                        </div>
                    );
                }

                setCategoryStackedInsights(stackedInsights);

                // Transactions by Count logic
                const categoryCounts = {};
                allTx.forEach((tx) => {
                    if (tx.category) {
                        categoryCounts[tx.category] = (categoryCounts[tx.category] || 0) + 1;
                    }
                });

                const countArray = Object.keys(categoryCounts).map((cat) => ({
                    name: cat,
                    count: categoryCounts[cat],
                }));
                setCountData(countArray);

                const sortedCounts = [...countArray].sort((a, b) => b.count - a.count);
                const totalTransactions = allTx.length;
                const countInsightsArray = [];

                if (sortedCounts.length > 0) {
                    const highestCategory = sortedCounts[0];
                    const lowestCategory = sortedCounts[sortedCounts.length - 1];

                    countInsightsArray.push(
                        <p key="high-count">
                            The category with the <b>highest number of transactions</b> is{" "}
                            <span className="text-green-700 font-bold">{highestCategory.name}</span> with{" "}
                            <b>{highestCategory.count}</b> transactions (
                            {((highestCategory.count / totalTransactions) * 100).toFixed(1)}% of all).
                        </p>
                    );
                    countInsightsArray.push(
                        <p key="low-count">
                            The category with the <b>lowest number of transactions</b> is{" "}
                            <span className="text-red-700 font-bold">{lowestCategory.name}</span> with{" "}
                            <b>{lowestCategory.count}</b> transactions (
                            {((lowestCategory.count / totalTransactions) * 100).toFixed(1)}% of all).
                        </p>
                    );
                    countInsightsArray.push(
                        <div key="top-3-count">
                            <p className="font-medium">🔝 Top 3 categories by count:</p>
                            {sortedCounts.slice(0, 3).map((cat, idx) => (
                                <div
                                    key={cat.name}
                                    className="insight-badge bg-blue-100 text-blue-700 rounded-lg px-2 py-1 inline-block m-1"
                                >
                                    #{idx + 1} {cat.name}: {cat.count} (
                                    {((cat.count / totalTransactions) * 100).toFixed(1)}%)
                                </div>
                            ))}
                        </div>
                    );
                    countInsightsArray.push(
                        <div key="bottom-3-count">
                            <p className="font-medium">🔻 Bottom 3 categories by count:</p>
                            {sortedCounts.slice(-3).map((cat, idx) => (
                                <div
                                    key={cat.name}
                                    className="insight-badge bg-gray-100 text-gray-700 rounded-lg px-2 py-1 inline-block m-1"
                                >
                                    {cat.name}: {cat.count} (
                                    {((cat.count / totalTransactions) * 100).toFixed(1)}%)
                                </div>
                            ))}
                        </div>
                    );
                }
                setCountInsights(countInsightsArray);

                // Line data
                const totalDateMap = {};
                allTx.forEach((tx) => {
                    const date = new Date(tx.date).toLocaleDateString();
                    if (!totalDateMap[date]) totalDateMap[date] = 0;
                    totalDateMap[date] += tx.amount;
                });
                const lineArray = Object.entries(totalDateMap)
                    .map(([date, value]) => ({ date, amount: value }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                setLineData(lineArray);

                // Dual Line data
                const dateMap = {};
                res.data.sent.forEach((tx) => {
                    const date = new Date(tx.date).toLocaleDateString();
                    if (!dateMap[date]) dateMap[date] = { date, sent: 0, received: 0 };
                    dateMap[date].sent += tx.amount;
                });
                res.data.received.forEach((tx) => {
                    const date = new Date(tx.date).toLocaleDateString();
                    if (!dateMap[date]) dateMap[date] = { date, sent: 0, received: 0 };
                    dateMap[date].received += tx.amount;
                });
                const dualLineArray = Object.values(dateMap).sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );
                setDualLineData(dualLineArray);

                // Dual Line Insights
                const insights = [];
                if (dualLineArray.length > 0) {
                    const totalSent = dualLineArray.reduce((sum, d) => sum + d.sent, 0);
                    const totalReceived = dualLineArray.reduce((sum, d) => sum + d.received, 0);

                    // 1. Net comparison
                    if (totalSent > totalReceived) {
                        insights.push(
                            <div key="net-sent" className="insight-badge bg-red-50 text-red-600">
                                ⚠ You spent more ( PKR {totalSent}) than you received ( PKR {totalReceived}).
                            </div>
                        );
                    } else if (totalReceived > totalSent) {
                        insights.push(
                            <div key="net-received" className="insight-badge bg-green-50 text-green-600">
                                ✅ You received more ( PKR {totalReceived}) than you spent ( PKR {totalSent}).
                            </div>
                        );
                    } else {
                        insights.push(
                            <div key="net-equal" className="insight-badge bg-blue-50 text-blue-600">
                                ⏸ Sent and received amounts were perfectly balanced.
                            </div>
                        );
                    }

                    // 2. Peak days
                    const maxSent = dualLineArray.reduce((a, b) => (a.sent > b.sent ? a : b));
                    const maxReceived = dualLineArray.reduce((a, b) => (a.received > b.received ? a : b));
                    insights.push(
                        <p key="max-sent" className="text-red-500">
                            🔺 Highest spending transaction was on {maxSent.date}: PKR {maxSent.sent}
                        </p>
                    );
                    insights.push(
                        <p key="max-received" className="text-green-500">
                            🟢 Highest incoming transaction was on {maxReceived.date}: PKR {maxReceived.received}
                        </p>
                    );

                    const first = dualLineArray[0];
                    const last = dualLineArray[dualLineArray.length - 1];

                    if (last.sent > first.sent) {
                        insights.push(
                            <p key="sent-trend" className="text-red-500">
                                📉 Your spending shows an <strong>upward trend</strong>, increasing from PKR {first.sent} on {first.date} to PKR {last.sent} on {last.date}.
                            </p>
                        );
                    } else if (last.sent < first.sent) {
                        insights.push(
                            <p key="sent-trend" className="text-green-500">
                                📉 Your spending shows a <strong>downward trend</strong>, decreasing from PKR {first.sent} on {first.date} to PKR {last.sent} on {last.date}.
                            </p>
                        );
                    } else {
                        insights.push(<p key="sent-trend" className="text-blue-500">⏸ Your spending remained stable.</p>);
                    }

                    if (last.received > first.received) {
                        insights.push(
                            <p key="received-trend" className="text-green-500">
                                💰 Your incoming transaction amount shows an <strong>upward trend</strong>, increasing from PKR {first.received} on {first.date} to PKR {last.received} on {last.date}.
                            </p>
                        );
                    } else if (last.received < first.received) {
                        insights.push(
                            <p key="received-trend" className="text-red-500">
                                💰 Your incoming transaction amount shows a <strong>downward trend</strong>, decreasing from PKR {first.received} on {first.date} to PKR {last.received} on {last.date}.
                            </p>
                        );
                    } else {
                        insights.push(
                            <p key="received-trend" className="text-blue-500">⏸ Your incoming transaction amount remained stable.</p>
                        );
                    }
                }
                setDualLineInsights(insights);

                // Line insights
                const lineText = [];
                if (lineArray.length > 0) {
                    const maxDay = lineArray.reduce((a, b) => (a.amount > b.amount ? a : b));
                    const minDay = lineArray.reduce((a, b) => (a.amount < b.amount ? a : b));
                    lineText.push(
                        <div key="trend-max" className="insight-badge bg-red-50 text-red-600">
                            📈 Highest transaction value on {maxDay.date}: {maxDay.amount}
                        </div>
                    );
                    lineText.push(
                        <div key="trend-min" className="insight-badge bg-green-50 text-green-600">
                            📉 Lowest transaction value on {minDay.date}: {minDay.amount}
                        </div>
                    );
                }
                if (lineArray.length > 1) {
                    const first = lineArray[0].amount;
                    const last = lineArray[lineArray.length - 1].amount;

                    if (last > first)
                        lineText.push(
                            <p key="trend" className="text-green-500">
                                Overall, total transaction value has increased in {filterTextMap[filter]}.
                            </p>
                        );
                    else if (last < first)
                        lineText.push(
                            <p key="trend" className="text-red-500">
                                Overall, your total transaction value has decreased in {filterTextMap[filter]}.
                            </p>
                        );
                    else
                        lineText.push(
                            <p key="trend" className="text-blue-500">
                                Total transaction value remained stable in {filterTextMap[filter]}.
                            </p>
                        );
                }
                setLineInsights(lineText);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            }
        };
        fetchTransactions();
    }, [filter]);

    return (
        <div className={`charts-page-wrapper ${darkMode ? "dark-mode" : "light-mode"}`}>
            <div className="charts-page-container">
                <nav className="navbar sticky">
                    <div className="logo-with-image">
                        <img src="assets/logo.png" alt="Bank Alfalah" className="bank-logo" />
                        <span className="bank-name">ALFALAH SMART PORTAL</span>
                    </div>
                    <div className="nav-buttons">
                        <button onClick={() => navigate("/dashboard")} className="nav-btn">
                            Dashboard
                        </button>
                        <button onClick={toggleDarkMode} className="nav-btn">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={handleLogout} className="nav-btn">
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </nav>
                <div className="charts-header">
                    <h2 className="page-title">Transaction Analytics and Insights</h2>
                    <h4 className="page-subtitle">Analyze your financial activity at a glance</h4>
                    <p className="page-description">
                        Explore your spending and income patterns, track category-wise transactions, identify trends over time, and gain actionable insights to make smarter financial decisions.
                    </p>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
                        <option value="last15days">Last 15 Days</option>
                        <option value="lastmonth">Last Month</option>
                        <option value="last6months">Last 6 Months</option>
                        <option value="lastyear">Last Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
                <div className="charts-grid">
                    {/* 1. High-Level Summary */}
                    <div className="chart-card">
                        <h3>Proportion of Sent vs. Received Transactions</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={100}
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `PKR ${value}`}
                                    contentStyle={{
                                        backgroundColor: darkMode ? "#333" : "#fff",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                    }}
                                />
                                <Legend
                                    wrapperStyle={{ fontSize: "14px", color: darkMode ? "#fff" : "#333" }}
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="insights-box">{basicInsights}</div>
                    </div>

                    {/* 2. Total Trend Over Time */}
                    <div className="chart-card wide">
                        <h3>Volume of Transactions Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="insights-box">{lineInsights}</div>
                    </div>

                    {/* 3. Detailed Trend Breakdown */}
                    <div className="chart-card pie-chart full-width-pie">
                        <h3>Financial Flow: Sent vs. Received Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dualLineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="sent" stroke="#FF8042" />
                                <Line type="monotone" dataKey="received" stroke="#00C49F" />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="insights-box">
                            {dualLineInsights.length > 0 ? dualLineInsights : "No insights yet"}
                        </div>
                    </div>

                    {/* 4. Category Breakdown (High-Level) */}
                    <div className="chart-card pie-chart full-width-pie">
                        <h3>Total Transactional Value by Category</h3>
                        <ResponsiveContainer width="100%" height={500}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    outerRadius={200}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="insights-box">{categoryInsights}</div>
                    </div>

                    {/* 5. Category Breakdown (Detailed) */}
                    <div className="chart-card">
                        <h4 className="sub-heading">Net Financial Position by Category</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryStackedData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#555" : "#ccc"} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12, fill: darkMode ? "#fff" : "#333" }}
                                    interval={0}
                                    angle={-10}
                                    textAnchor="end"
                                />
                                <YAxis tick={{ fontSize: 12, fill: darkMode ? "#fff" : "#333" }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: darkMode ? "#333" : "#fff",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                    formatter={(value) => `PKR ${value}`}
                                />
                                <Legend wrapperStyle={{ fontSize: "14px", color: darkMode ? "#fff" : "#333" }} />
                                <Bar dataKey="sent" stackId="a" fill="#FF8042" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="received" stackId="a" fill="#00C49F" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="insights-box">{categoryStackedInsights}</div>
                    </div>

                    {/* 6. Transactions by Count */}
                    <div className="chart-card">
                        <h3>Number of Transactions By Category</h3>
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={countData}>
                                <CartesianGrid strokeDasharray="5 5" />
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    angle={-8}
                                    textAnchor="end"
                                    height={50}
                                   
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#82ca9d" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="insights-box">{countInsights}</div>
                    </div>
                </div>

                <button onClick={() => navigate("/dashboard")} className="back-btn">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default ChartsPage;