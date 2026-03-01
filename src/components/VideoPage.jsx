import { NEIGHBOURHOODS } from '../data/neighbourhoods';
import CNTower from './CNTower';

export default function VideoPage({ id, onBack }) {
  const n = NEIGHBOURHOODS.find((x) => x.id === id);
  if (!n) return null;
  return (
    <div className="video-page">
      <div className="vp-top">
        <span className="vp-title">
          <span style={{ fontSize: '1.5rem' }}>{n.flag}</span> {n.name}
        </span>
        <button className="vp-back" onClick={onBack}>
          ← Map
        </button>
      </div>
      <div className="vp-body">
        <div className="tv">
          <div className="tv-inner">
            <iframe
              src={`${n.video}?autoplay=1&rel=0`}
              title={n.name}
              allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </div>
          <div className="tv-scanlines" />
          <div className="tv-glare" />
        </div>
      </div>
      <div className="vp-bottom">
        <CNTower size={28} />
        <span className="vp-bname">
          Little <em>{n.name.replace('Little ', '')}</em>.
        </span>
      </div>
    </div>
  );
}
