import { createRoot } from 'react-dom/client';
import './style.css';
// the full RQ engine (26 framework-agnostic files), embedded as source and
// executed as a CLASSIC script — identical semantics to the single-file build
import bundleSrc from './legacy/rq-bundle.js?raw';
import App from './App.jsx';

/* ---------- boot: run the engine exactly like roboquest.html's <script> did ---------- */
const s = document.createElement('script');
s.textContent = bundleSrc;
document.head.appendChild(s); // classic scripts execute synchronously
const RQ = window.RQ;

RQ.DB.load();
RQ.Auth.restore();
// seed a default demo teacher account so the teacher journey works out of the box
(async function seedTeacher(){
  const db = RQ.DB.data;
  if(!db.users.some(u => u.username === 'teacher' && u.role === 'teacher')){
    const salt = RQ.DB.uid('s');
    const passHash = await RQ.Auth.hash('robotics2026', salt);
    db.users.push({ id:'demo-teacher', role:'teacher', username:'teacher', name:'Ms. Circuit (Demo Teacher)',
      avatar:{ color:'#fbbf24' }, demo:false, salt, passHash, createdAt:Date.now() });
    RQ.DB.save();
  }
})();
if(!location.hash) location.hash = '#/welcome';

/* ---------- React bridge ----------
   The engine's render cycle (RQ.render / RQ.refreshHUD) used to rewrite #app's
   innerHTML. In React those calls become a single event the App component
   listens to — so every legacy view that calls RQ.render() after login,
   logout or profile changes refreshes the React shell instead of clobbering
   React's DOM. Navigation (RQ.go) already only sets location.hash, which the
   router hook picks up natively. */
RQ.render = () => window.dispatchEvent(new Event('rq:render'));
RQ.refreshHUD = () => window.dispatchEvent(new Event('rq:render'));

createRoot(document.getElementById('app')).render(<App />);
