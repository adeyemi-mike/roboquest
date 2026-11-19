import { useEffect, useReducer } from 'react';
import TopBar from './components/TopBar.jsx';
import ViewHost from './components/ViewHost.jsx';
import Welcome from './components/Welcome.jsx';
import Login from './components/Login.jsx';

/* Router + guards — a faithful React port of engine.js RQ.render().
   Navigation is hash-based: RQ.go() only sets location.hash, so the engine,
   hosted views and React all share one URL state. */

function useForceUpdate(){
  const [, force] = useReducer(x => x + 1, 0);
  return force;
}

export default function App(){
  const RQ = window.RQ;
  const force = useForceUpdate();

  // ALL hooks before any early return (Rules of Hooks)
  useEffect(() => {
    const on = () => force();
    window.addEventListener('hashchange', on);   // RQ.go() navigation
    window.addEventListener('rq:render', on);    // engine's RQ.render() / refreshHUD()
    return () => { window.removeEventListener('hashchange', on); window.removeEventListener('rq:render', on); };
  }, [force]);

  const { route, param } = RQ.parseHash();
  const pub = ['welcome', 'register', 'login', 'parent'];

  let u = RQ.Auth.user();
  if(!u && !pub.includes(route)){ RQ.Auth.restore(); }
  const me = RQ.Auth.user();

  // age-adaptive presentation: bigger targets & text for the youngest learners
  // (runs on every render — same timing as the vanilla RQ.render)
  useEffect(() => {
    if(me && RQ.isKidsUser(me)){
      const lvl = (RQ.Kids.P(me) && RQ.Kids.P(me).kids.level) || me.kidsLevel || 1;
      document.body.className = 'kids kids-l' + lvl;
    } else if(document.body.className.includes('kids')){
      document.body.className = '';
    }
  });

  // ---- guards (mirroring RQ.render) ----
  if(!me && !pub.includes(route)){ location.hash = '#/login'; return null; }
  if(me && pub.includes(route) && route !== 'welcome'){
    RQ.go(me.role === 'teacher' ? 't-dash' : (RQ.isKidsUser(me) ? 'k-home' : 'dash'));
    return null;
  }
  // track routing: kids students live on the adventure map, academy students on the dashboard
  if(me && me.role === 'student'){
    const kidsArea = ['k-home','quest','k-robotics','k-studio','studio','k-detective','case','k-arena','k-create','project'];
    if(RQ.isKidsUser(me) && route === 'dash'){ RQ.go('k-home'); return null; }
    if(!RQ.isKidsUser(me) && kidsArea.includes(route)){ RQ.go('dash'); return null; }
  }

  const storeNote = RQ.store.mode === 'memory'
    ? <div className="store-note">⚠️ Sandboxed preview: browser storage is blocked here, so progress will NOT be saved after you leave. Download <b>roboquest.html</b> and open it directly in a browser tab for full persistence.</div>
    : null;

  // ---- public screens: no shell, full-bleed (same as RQ.render's isPub path) ----
  if(!me && pub.includes(route)){
    if(route === 'welcome') return <Welcome />;
    if(route === 'login') return <Login />;
    return <ViewHost route={route} param={param} me={me} bare />;
  }

  // ---- logged-in screens: shell (top bar + drawer) around the hosted view ----
  return (
    <>
      {storeNote}
      <TopBar me={me} route={route} />
      <ViewHost route={route} param={param} me={me} />
      <footer className="site">ROBOQUEST — CODE. THINK. BUILD. CONQUER. · Learning platform for ages 7–16</footer>
    </>
  );
}
