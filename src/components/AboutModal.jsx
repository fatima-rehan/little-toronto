export default function AboutModal({ onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>
          ✕
        </button>
        <h2>About Little Toronto.</h2>
        <p>
          Toronto is one of the most multicultural cities in the world.{' '}
          <strong>Little Toronto</strong> is an interactive guide to the city's
          vibrant cultural neighbourhoods! Each one a little world unto itself,
          with its own flavours, sounds, and stories.
        </p>
        <p>
          Click on any flag on the map or use the menu to explore a
          neighbourhood. Each features a short video exploration.
        </p>
        <p>
          Not sure where to start? Use the <strong>AI Guide</strong>! Tell it
          what you're in the mood for or where you're located, and it'll recommend the perfect
          neighbourhood.
        </p>
      </div>
    </div>
  );
}
