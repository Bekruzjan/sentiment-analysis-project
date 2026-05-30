import { motion } from "framer-motion";

function StatsCards({ stats }) {

  const cards = [

    {
      title: "Total Reviews",
      value: stats.total,
      icon: "📊",
      className: "total-card"
    },

    {
      title: "Positive",
      value: stats.positive,
      icon: "🟢",
      className: "positive-card"
    },

    {
      title: "Negative",
      value: stats.negative,
      icon: "🔴",
      className: "negative-card"
    },

    {
      title: "Neutral",
      value: stats.neutral,
      icon: "🟡",
      className: "neutral-card"
    }

  ];

  return (

    <div className="stats-grid">

      {cards.map((card, index) => (

        <motion.div
          key={index}
          whileHover={{
            scale: 1.05,
            y: -10
          }}
          transition={{
            duration: 0.3
          }}
          className={`stat-card ${card.className}`}
        >

          <div className="stat-icon">
            {card.icon}
          </div>

          <h3 className="stat-title">
            {card.title}
          </h3>

          <h1 className="stat-number">
            {card.value}
          </h1>

        </motion.div>

      ))}

    </div>

  );
}

export default StatsCards;