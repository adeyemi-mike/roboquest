import { useState } from 'react';

/* Native React port of views1.js RQ.views.login — controlled form, React state,
   same engine calls (RQ.Auth.login) and same post-login routing. */
export default function Login(){
  const RQ = window.RQ;
  const [mode, setMode] = useState('student');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');

  const doLogin = async (u, p) => {
    setErr('');
    try{
      const loggedIn = await RQ.Auth.login(u.trim(), p);
      if(loggedIn.role === 'teacher'){ RQ.toast('Welcome back, ' + loggedIn.name); RQ.go('t-dash'); }
      else {
        const cls = RQ.Auth.studentClass(loggedIn.id);
        RQ.toast('Welcome back, ' + loggedIn.name + (cls ? ' (' + cls.name + ')' : ''));
        RQ.go('dash'); // kids-track students are redirected to their adventure map by the router guard
      }
    }catch(e){
      setErr(e.message);
    }
  };

  const demoTeacher = () => doLogin('teacher', 'robotics2026');
  const teacherRegister = e => { e.preventDefault(); RQ.teacherRegister(); };

  return (
    <div className="wrap" style={{ maxWidth: '480px' }}>
      <div className="center mb">
        <div className="logo" style={{ justifyContent: 'center', display: 'flex' }} onClick={() => RQ.go('welcome')}>
          <div className="logo-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="5" y="7" width="14" height="10" rx="3"/><circle cx="9.5" cy="12" r="1.6" fill="#fff"/><circle cx="14.5" cy="12" r="1.6" fill="#fff"/><path d="M12 7V3M8 3h8"/></svg></div>
          <div className="logo-txt">ROBOQUEST</div>
        </div>
        <div className="tag" style={{ fontSize: '.7rem', letterSpacing: '3px', marginTop: '8px' }}>CODE · THINK · BUILD · CONQUER</div>
      </div>
      <div className="tabs" style={{ justifyContent: 'center' }}>
        <div className={'tab' + (mode === 'student' ? ' on' : '')} onClick={() => setMode('student')}>🎓 Student</div>
        <div className={'tab' + (mode === 'teacher' ? ' on' : '')} onClick={() => setMode('teacher')}>🧑‍🏫 Teacher</div>
      </div>
      <div className="card">
        {err && <div className="err-msg">{err}</div>}
        <div className="field"><label>Username</label>
          <input value={user} autoComplete="username" onChange={e => setUser(e.target.value)} /></div>
        <div className="field"><label>Password</label>
          <div className="pw-wrap">
            <input value={pass} type={showPw ? 'text' : 'password'} autoComplete="current-password"
              onChange={e => setPass(e.target.value)} onKeyDown={e => { if(e.key === 'Enter') doLogin(user, pass); }} />
            <button type="button" className="pw-eye" onClick={() => setShowPw(s => !s)}>{showPw ? '🙈 Hide' : '👁 Show'}</button>
          </div>
        </div>
        <button className="btn primary block" onClick={() => doLogin(user, pass)}>
          Enter {mode === 'student' ? 'the quest' : 'the staff room'} →
        </button>
        {mode === 'teacher'
          ? <p className="small dim mt">New teacher? Register with your school invite code: <a href="#/login" onClick={teacherRegister}>Create teacher account</a></p>
          : <p className="small dim mt center">New student? <a href="#/register">Create your account</a></p>}
      </div>
      <div className="card mt center">
        <p className="dim small">Demo accounts — student: <b className="mono">demo_novabyte</b> (any password? no — use the demo button) · teacher: <b className="mono">teacher</b> / <b className="mono">robotics2026</b></p>
        <button className="btn ghost sm mt-s" onClick={demoTeacher}>Log in as demo teacher</button>
        <p className="small dim mt-s">👨‍👩‍👧 Parent? <a href="#/parent">See your child's progress</a> (code on their profile page)</p>
      </div>
    </div>
  );
}
