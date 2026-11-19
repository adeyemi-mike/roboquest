import { useEffect, useRef } from 'react';

/* Mounts an engine view function (RQ.views[route]) into a React-managed
   container. The engine's views take (host, param, me) and render into the
   element they're given — the same contract the vanilla app used, so every
   screen (quests, missions, teacher dashboards, …) works unmodified.
   Effect deps: remount only when route/param/user actually change — an
   RQ.render() refresh updates the shell (HUD, nav) without destroying the
   in-game state of the current view. */
export default function ViewHost({ route, param, me, bare }){
  const RQ = window.RQ;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if(!el) return;
    el.innerHTML = '';
    const view = RQ.views[route];
    if(!view){
      el.innerHTML = '<div class="empty-state"><div class="ico">🛰️</div>Page not found. <a href="#/dash">Back to base</a></div>';
      return;
    }
    try{
      view(el, param, me);
    }catch(e){
      console.error(e);
      el.innerHTML = '<div class="empty-state"><div class="ico">⚠️</div>Something went wrong rendering this page.<br><span class="small dim">' + RQ.esc(e.message) + '</span></div>';
    }
    window.scrollTo({ top: 0 });
  }, [route, param, me && me.id, bare]);

  return bare
    ? <div ref={ref} />
    : <main className="wrap" id="view" ref={ref} />;
}
