import { useMemo } from 'react';

/* Native React port of views1.js RQ.views.welcome (public landing page). */
export default function Welcome(){
  const RQ = window.RQ;

  const stats = useMemo(() => ({
    totalLessons: RQ.YEARS.reduce((s, y) => s + RQ.lessonsFor(y).length, 0),
    totalQ: RQ.DATA.QUESTIONS.length
  }), []);

  return (
    <>
      <div className="hero">
        <div className="hero-badge">⚡ SECONDARY SCHOOL CODING & ROBOTICS PLATFORM · YEARS 8–11</div>
        <svg className="hero-robot" viewBox="0 0 120 120">
          <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#26d9f2"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
          <circle cx="60" cy="64" r="44" fill="none" stroke="url(#hg)" strokeWidth="2" strokeDasharray="4 6" opacity=".5">
            <animateTransform attributeName="transform" type="rotate" from="0 60 64" to="360 60 64" dur="14s" repeatCount="indefinite"/></circle>
          <rect x="34" y="42" width="52" height="40" rx="12" fill="url(#hg)"/>
          <rect x="44" y="50" width="32" height="14" rx="5" fill="#04101f"/>
          <circle cx="52" cy="57" r="4" fill="#26d9f2"><animate attributeName="opacity" values="1;.3;1" dur="2s" repeatCount="indefinite"/></circle>
          <circle cx="68" cy="57" r="4" fill="#a78bfa"><animate attributeName="opacity" values=".3;1;.3" dur="2s" repeatCount="indefinite"/></circle>
          <rect x="52" y="70" width="16" height="6" rx="3" fill="#04101f"/>
          <path d="M60 42v-10M52 32h16" stroke="url(#hg)" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="60" cy="29" r="4" fill="#fbbf24"><animate attributeName="r" values="3;4.5;3" dur="1.6s" repeatCount="indefinite"/></circle>
          <rect x="40" y="86" width="9" height="14" rx="4" fill="#4f7cff"/><rect x="71" y="86" width="9" height="14" rx="4" fill="#4f7cff"/>
        </svg>
        <h1>ROBOQUEST</h1>
        <div className="tag">CODE · THINK · BUILD · CONQUER</div>
        <p className="muted" style={{ maxWidth: '640px', lineHeight: 1.7 }}>An adventure-game platform for learning to code and mastering robotics. Study real programming lessons, build Scratch, block and Python programs, command robots through sensor-driven missions, and battle unit bosses — while your teacher tracks every step of your progress.</p>
        <div className="row mt" style={{ justifyContent: 'center' }}>
          <button className="btn primary big" onClick={() => RQ.go('register')}>🚀 Start your quest</button>
          <button className="btn ghost big" onClick={() => RQ.go('login')}>Log in</button>
        </div>
        <div className="row mt-s dim small" style={{ justifyContent: 'center' }}>
          <span className="chip cy">{stats.totalLessons} lessons</span><span className="chip">{stats.totalQ}+ quiz questions</span>
          <span className="chip gr">24 robot missions</span><span className="chip pu">4 year pathways</span>
        </div>
      </div>
      <div className="wrap" style={{ paddingTop: 0 }}>
        <div className="grid g4 mt">
          {RQ.YEARS.map(y => {
            const m = RQ.YEAR_META[y];
            return (
              <div key={y} className="card hover">
                <div className="icon-tile" style={{ color: m.color }}>Year {y}</div>
                <h3>{m.name}</h3><p>{m.tag}</p>
                <div className="small dim mt-s">{RQ.lessonsFor(y).length} lessons · {RQ.missionsFor(y).length} missions + boss</div>
              </div>
            );
          })}
        </div>
        <div className="grid g3 mt">
          <div className="card"><div className="icon-tile">📘</div><h3>Coding Academy</h3><p>Learn programming step by step: learn, understand, see it work, predict, practise, then test your knowledge.</p></div>
          <div className="card"><div className="icon-tile">🤖</div><h3>Robot Simulator</h3><p>Program a real 2D robot with sensors, obstacles, doors and delivery pads. Obstacles affect behaviour — sensors drive decisions.</p></div>
          <div className="card"><div className="icon-tile">🧪</div><h3>Code Lab</h3><p>Build block programs, write structured pseudocode, and run Python in a safe guided simulator.</p></div>
        </div>
        <div className="card mt center">
          <p className="dim small">Local Mode: ROBOQUEST stores all accounts and progress in your browser (no server needed).
          Teachers get a separate management dashboard. Demo teacher login: <b className="mono">teacher</b> / <b className="mono">robotics2026</b></p>
        </div>
      </div>
    </>
  );
}
