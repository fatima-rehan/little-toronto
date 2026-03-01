import { useState, useCallback } from 'react';
import './App.css';
import Splash from './components/Splash';
import LoadingScreen from './components/LoadingScreen';
import Map from './components/Map';
import Drawer from './components/Drawer';
import VideoPage from './components/VideoPage';
import AboutModal from './components/AboutModal';
import AIChat from './components/AIChat';
import CNTower from './components/CNTower';

export default function App() {
  const [phase, setPhase] = useState('splash');
  const [active, setActive] = useState(null);
  const [menu, setMenu] = useState(false);
  const [about, setAbout] = useState(false);
  const [chat, setChat] = useState(false);

  const go = useCallback((id) => setActive(id), []);

  return (
    <>
      {phase === 'splash' && <Splash onEnter={() => setPhase('loading')} />}
      {phase === 'loading' && (
        <LoadingScreen onDone={() => setPhase('app')} />
      )}
      {phase === 'app' && (
        <>
          <div className="map-layer">
            <Map onSelect={go} />
          </div>

          <div className="topbar">
            <div className="tb-logo" onClick={() => setActive(null)}>
              <CNTower size={30} />
              <span>
                Little <b>Toronto.</b>
              </span>
            </div>
            <div className="tb-right">
              <button className="tb-ai" onClick={() => setChat((c) => !c)}>
                AI Guide
              </button>
              <button className="tb-q" onClick={() => setAbout(true)}>
                ?
              </button>
              <button className="tb-ham" onClick={() => setMenu(true)}>
                <div />
                <div />
                <div />
              </button>
            </div>
          </div>

          <Drawer
            open={menu}
            onClose={() => setMenu(false)}
            onSelect={go}
            active={active}
          />
          {active && (
            <VideoPage id={active} onBack={() => setActive(null)} />
          )}
          {chat && (
            <AIChat
              onClose={() => setChat(false)}
              onNav={(id) => {
                go(id);
                setChat(false);
              }}
            />
          )}
          {about && <AboutModal onClose={() => setAbout(false)} />}
        </>
      )}
    </>
  );
}
