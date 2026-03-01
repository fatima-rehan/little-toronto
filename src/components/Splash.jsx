import { useState } from 'react';

export default function Splash({ onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const go = () => {
    if (!leaving) {
      setLeaving(true);
      setTimeout(onEnter, 700);
    }
  };
  return (
    <div
      onClick={go}
      className="splash"
      style={{
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.06)' : 'scale(1)',
      }}
    >
      <div className="splash-little">little</div>
      <div className="splash-toronto">TORONTO.</div>
      <button
        className="splash-btn"
        onClick={(e) => {
          e.stopPropagation();
          go();
        }}
      >
        Visit
      </button>
    </div>
  );
}
