import { useEffect, useState } from "react";
import axios from "axios";

import PieChart from "../components/PieChart";
import StatsCards from "../components/StatsCards";

function Dashboard() {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/stats"
      );

      setStats(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  if (!stats) {

    return (
      <div className="dashboard-loading">
        <h1>Loading Dashboard...</h1>
      </div>
    );
  }

  return (

    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>
          <h1 className="dashboard-title">
            Analytics Dashboard
          </h1>

          <p className="dashboard-subtitle">
            AI Powered Sentiment Analysis Platform
          </p>
        </div>

      </div>

      <div className="dashboard-main">

        <div className="dashboard-chart-card">

          <h2>
            Sentiment Distribution
          </h2>

          <PieChart stats={stats} />

        </div>

        <div className="dashboard-stats">

          <StatsCards stats={stats} />

        </div>

      </div>

      <div className="dashboard-summary">

        <div className="summary-card">

          <h3>Total Reviews</h3>

          <span>{stats.total}</span>

        </div>

        <div className="summary-card">

          <h3>Positive Rate</h3>

          <span>
            {stats.total > 0
              ? Math.round(
                  (stats.positive / stats.total) * 100
                )
              : 0}
            %
          </span>

        </div>

        <div className="summary-card">

          <h3>Negative Rate</h3>

          <span>
            {stats.total > 0
              ? Math.round(
                  (stats.negative / stats.total) * 100
                )
              : 0}
            %
          </span>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;