import { useState } from 'react';

/* React port of engine.js shellHTML(): top bar with logo, track-aware nav,
   HUD chips, avatar and mobile drawer. Same CSS classes as the vanilla app,
   so style.css styles both this shell and the hosted views. */
export default function TopBar({ me, route }){
  const RQ = window.RQ;
  const [open, setOpen] = useState(false);
  const isT = me.role === 'teacher';
  const isK = !isT && RQ.isKidsUser(me);
  const p = isT ? null : RQ.DB.data.progress[me.id];

  const links = isT ? [
    ['t-dash','📊 Overview'],['t-classes','👥 Classes'],['t-assignments','📋 Assignments'],
    ['t-reports','📈 Reports'],['t-insights','🧠 Insights'],['t-content','🛠️ Content Studio'],['t-settings','⚙️ Settings']
  ] : isK ? [
    ['k-home','🗺️ My Adventure'],['k-robotics','🤖 Robotics Lab'],['k-studio','🎮 Game Studio'],
    ['k-detective','🔍 Detective'],['k-arena','🏟️ Arena'],['k-create','🎨 Create'],['achievements','🏅 Badges']
  ] : [
    ['dash','🏠 Dashboard'],['academy','📘 Academy'],['lab','🧪 Code Lab'],['missions','🗺️ Missions'],
    ['quiz','⚔️ Quiz Arena'],['achievements','🏅 Achievements'],
    ['leaderboard','🏆 Leaderboard'],['daily','⚡ Daily']
  ];

  const hl = r => route === r
    || (r === 'k-home' && ['quest','project'].includes(route))
    || (r === 'k-robotics' && route === 'mission')
    || (r === 'k-studio' && route === 'studio')
    || (r === 'k-detective' && route === 'case')
    || (r === 'academy' && route === 'lesson')
    || (r === 'missions' && route === 'mission');

  const kidsStars = isK ? RQ.Kids.totalStars(me) : 0;
  const levelOf = isT || isK ? null : RQ.Game.levelOf(p.stats.xp);
  const home = isT ? 't-dash' : 'dash'; // kids students get redirected to k-home by the router guard

  const logout = () => { setOpen(false); RQ.Auth.logout(); RQ.render(); };

  return (
    <>
      <header className="topbar">
        <div className="logo" onClick={() => RQ.go(home)}>
          <div className="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="7" width="14" height="10" rx="3"/><circle cx="9.5" cy="12" r="1.6" fill="#fff"/><circle cx="14.5" cy="12" r="1.6" fill="#fff"/><path d="M12 7V3M8 3h8"/></svg></div>
          <div><div className="logo-txt">ROBOQUEST</div><div className="logo-sub">CODE · THINK · BUILD · CONQUER</div></div>
        </div>
        <nav className="nav">
          {links.map(l => <a key={l[0]} href={'#/' + l[0]} className={hl(l[0]) ? 'on' : ''}>{l[1]}</a>)}
        </nav>
        <div className="hud">
          {isT ? (
            <span className="hud-chip lvl">🧑‍🏫 {RQ.esc(me.name)}</span>
          ) : isK ? (
            <>
              <span className="hud-chip xp hide-m">⭐ {kidsStars} stars</span>
              <span className="hud-chip lvl">{RQ.esc(RQ.KIDS_LEVELS[((RQ.Kids.P(me) && RQ.Kids.P(me).kids.level) || me.kidsLevel || 1)].name)}</span>
            </>
          ) : (
            <>
              <span className="hud-chip xp hide-m">⚡ {p.stats.xp} XP</span>
              <span className="hud-chip coin hide-m">🪙 {p.stats.coins}</span>
              <span className="hud-chip lvl">{levelOf.lvl}·{RQ.esc(levelOf.name)}</span>
            </>
          )}
          <button className="avatar-btn" title={RQ.esc(me.name)} onClick={() => RQ.go(isT ? 't-settings' : 'profile')}
            dangerouslySetInnerHTML={{ __html: RQ.avatarSVG(me.avatar, isT) }} />
          <button className="burger" onClick={() => setOpen(true)}>☰</button>
          <button className="btn ghost sm" onClick={logout}>Log out</button>
        </div>
      </header>

      <div className={'drawer' + (open ? ' open' : '')} id="drawer"
        onClick={e => { if(e.target === e.currentTarget || (e.target.classList && e.target.classList.contains('drawer-bg'))) setOpen(false); }}>
        <div className="drawer-bg" />
        <div className="drawer-panel">
          <div className="logo-sub" style={{ marginBottom: '10px' }}>MENU</div>
          {links.map(l => (
            <a key={l[0]} href={'#/' + l[0]} className={route === l[0] ? 'on' : ''} onClick={() => setOpen(false)}>{l[1]}</a>
          ))}
          <div className="divider" />
          <a href={'#/' + (isT ? 't-settings' : 'profile')} onClick={() => setOpen(false)}>👤 Profile</a>
          <a href={'#' + home} onClick={logout}>🚪 Log out</a>
          <div className="small dim mt">ROBOQUEST · Local Mode v1.0</div>
        </div>
      </div>
    </>
  );
}
