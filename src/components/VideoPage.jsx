import { useState } from 'react';
import { NEIGHBOURHOODS } from '../data/neighbourhoods';

export default function VideoPage({ id, onBack }) {
  const n = NEIGHBOURHOODS.find((x) => x.id === id);
  if (!n) return null;

  const hasVideo = n.video && n.video.trim().length > 0;
  const [playing, setPlaying] = useState(!!hasVideo);

  const isKensington = n.id === 'kensington';
  const titleName = isKensington ? 'Kensington Market' : n.name;
  const hasLittle = titleName.startsWith('Little ');
  const littlePart = hasLittle ? 'Little ' : (isKensington ? 'Kensington ' : '');
  const countryPart = hasLittle ? titleName.slice(7) : (isKensington ? 'Market' : titleName);

  return (
    <div className="video-page">
      <div className="vp-top">
        <span className="vp-title">
          <span style={{ fontSize: '1.5rem' }}>{n.flag}</span>{' '}
          <span className="vp-title-name--plain">{littlePart}</span>
          <span className="vp-title-name">{countryPart}</span>
        </span>
        <button className="vp-back" onClick={onBack}>
          ← Map
        </button>
      </div>
      <div className="vp-body">
        <div className="tv">
          <div className="tv-inner">
            {hasVideo ? (
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
            ) : (
              <div className="vp-under-construction">
                <span className="vp-uc-icon">🚧</span>
                <p>Under construction</p>
                <p className="vp-uc-desc">Video coming soon.</p>
              </div>
            )}
          </div>
          <div className="tv-scanlines" />
          <div className="tv-glare" />
        </div>
      </div>
      <div className="vp-bottom vp-controls">
        <button
          type="button"
          className="vp-ctrl-btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause' : 'Play'}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
