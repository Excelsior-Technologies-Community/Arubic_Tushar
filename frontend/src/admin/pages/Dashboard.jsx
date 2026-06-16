const cards = [
  { title: "Services", value: 12 },
  { title: "Blogs", value: 18 },
  { title: "Team", value: 6 },
  { title: "Messages", value: 43 },
];

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.title} className="stat-card">
            <h2>{card.value}</h2>
            <p>{card.title}</p>
          </div>
        ))}
      </div>

      <div className="recent-box">
        <h3>Recent Activity</h3>

        <ul>
          <li>New blog added</li>
          <li>Service updated</li>
          <li>New contact message</li>
        </ul>
      </div>
    </>
  );
}