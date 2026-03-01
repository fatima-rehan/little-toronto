import CNTower from './CNTower';
import { NEIGHBOURHOODS } from '../data/neighbourhoods';

export default function Drawer({ open, onClose, onSelect, active }) {
  return (
    <>
      {open && <div className="drawer-bg" onClick={onClose} />}
      <div
        className="drawer"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="drawer-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CNTower size={30} />
            <span
              style={{
                fontFamily: "'Playfair Display',serif",
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              Neighbourhoods
            </span>
          </div>
          <button onClick={onClose} className="drawer-close">
            ✕
          </button>
        </div>
        <div className="drawer-list">
          {NEIGHBOURHOODS.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onSelect(n.id);
                onClose();
              }}
              className="drawer-item"
              style={{
                borderLeftColor: active === n.id ? '#C0392B' : 'transparent',
                background:
                  active === n.id ? 'rgba(192,57,43,0.08)' : 'transparent',
                fontWeight: active === n.id ? 700 : 400,
              }}
            >
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{n.flag}</span>
              <span>{n.name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
