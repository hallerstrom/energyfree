export default function GoalProgress({ startDate, costPerDay, goalAmount, goalDays }) {
  const diff = new Date() - startDate;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const saved = days * costPerDay;

  const dayPct = Math.min((days / goalDays) * 100, 100);
  const moneyPct = Math.min((saved / goalAmount) * 100, 100);

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Dina Mål</h3>
      
      {/* Tids-stapel */}
      <div className="progress-section" style={{ marginBottom: '20px' }}>
        <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Tid: {days} / {goalDays} dagar</span>
          <span style={{ fontWeight: 'bold' }}>{Math.round(dayPct)}%</span>
        </div>
        <div className="bar-bg" style={{ width: '100%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div className="bar-fill" style={{ width: `${dayPct}%`, backgroundColor: '#3b82f6', height: '100%', borderRadius: '10px', transition: 'width 0.8s ease-out' }} />
        </div>
      </div>

      {/* Penga-stapel */}
      <div className="progress-section">
        <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>Sparat: {saved} / {goalAmount} kr</span>
          <span style={{ fontWeight: 'bold' }}>{Math.round(moneyPct)}%</span>
        </div>
        <div className="bar-bg" style={{ width: '100%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div className="bar-fill" style={{ width: `${moneyPct}%`, backgroundColor: '#10b981', height: '100%', borderRadius: '10px', transition: 'width 0.8s ease-out' }} />
        </div>
      </div>
    </div>
  );
}