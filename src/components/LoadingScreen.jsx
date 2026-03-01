import { useState, useEffect, useRef } from 'react';
import CNTower from './CNTower';

export default function LoadingScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => {
        if (!fired.current) {
          fired.current = true;
          onDone();
        }
      }, 500);
    }, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="loading-screen" style={{ opacity: leaving ? 0 : 1 }}>
      <div className="loading-spin">
        <CNTower size={110} />
      </div>
      <div className="loading-text">Exploring neighbourhoods...</div>
    </div>
  );
}
