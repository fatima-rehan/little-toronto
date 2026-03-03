import { useState, useEffect, useRef } from 'react';
import { NEIGHBOURHOODS } from '../data/neighbourhoods';

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${key}`;

function localRecommend(query) {
  const ql = query.toLowerCase();
  const kw = {
    kensington: ['kensington', 'market', 'vintage', 'bodega', 'start', 'streetcar'],
    'little-italy': ['italian', 'pasta', 'pizza', 'gelato', 'espresso', 'cafe', 'patio', 'wine'],
    'little-india': ['indian', 'streetfood', 'spicy', 'bollywood', 'samosa', 'biryani'],
    'little-tokyo': ['japanese', 'ramen', 'sushi', 'anime', 'japan', 'izakaya', 'matcha'],
    'little-portugal': ['portuguese', 'pastry', 'nata', 'sardine', 'mural'],
    'little-poland': ['polish', 'pierogi', 'kielbasa', 'bakery', 'roncesvalles'],
    'little-malta': ['maltese', 'malta', 'pastizzi', 'junction'],
    'little-jamaica': ['jamaican', 'caribbean', 'jerk', 'reggae', 'patty'],
    'little-ukraine': ['ukrainian', 'ukraine', 'bloor west'],
    chinatown: ['chinese', 'hotpot', 'dumpling', 'noodle', 'asian', 'bubble tea'],
    koreatown: ['korean', 'bbq', 'karaoke', 'kpop', 'kimchi'],
    greektown: ['greek', 'souvlaki', 'mediterranean', 'baklava', 'gyro', 'danforth'],
  };
  const hits = [];
  for (const [id, ws] of Object.entries(kw)) {
    if (ws.some((w) => ql.includes(w))) hits.push(NEIGHBOURHOODS.find((n) => n.id === id));
  }
  if (!hits.length) {
    if (ql.match(/food|hungry|eat|lunch|dinner/)) hits.push(NEIGHBOURHOODS[0], NEIGHBOURHOODS[10], NEIGHBOURHOODS[2]);
    else if (ql.match(/culture|explore|walk|vibe/)) hits.push(NEIGHBOURHOODS[0], NEIGHBOURHOODS[10], NEIGHBOURHOODS[8]);
    else if (ql.match(/night|party|fun|drink|bar/)) hits.push(NEIGHBOURHOODS[0], NEIGHBOURHOODS[11], NEIGHBOURHOODS[1]);
    else if (ql.match(/coffee|chill|relax|cozy/)) hits.push(NEIGHBOURHOODS[1], NEIGHBOURHOODS[0], NEIGHBOURHOODS[12]);
  }
  if (!hits.length) {
    return "Great question! I'd suggest starting at Kensington Market, or Chinatown for food. Tell me more!";
  }
  const uniq = [...new Set(hits.filter(Boolean))].slice(0, 3);
  return (
    "I'd recommend:\n\n" +
    uniq.map((n) => `${n.flag} ${n.name} — ${n.desc}`).join('\n\n') +
    "\n\nTap a neighbourhood below to explore!"
  );
}

const SYSTEM_PROMPT = `You are a friendly Toronto neighbourhood guide. Use ONLY the neighbourhoods from this list. Be conversational and warm.

- If the user says hi, hello, or is just chatting: greet them back and invite them to tell you what they're in the mood for (food, culture, a walk) or where they are (e.g. "I'm near Spadina", "by Kensington").
- If they mention a location (Spadina, Kensington, Danforth, Bloor, etc.): suggest 1–3 neighbourhoods from the list that are near or match that area. Spadina = Kensington Market, Chinatown. Danforth = Greektown. Bloor = Koreatown, Little Ukraine. etc.
- If they mention mood, food, or interests: recommend 1–3 neighbourhoods from the list. Be concise, 1–2 sentences per pick. Use the exact names below.

Neighbourhoods (use only these names):
${NEIGHBOURHOODS.map((n) => `${n.flag} ${n.name}: ${n.desc}`).join('\n')}`;

function buildGeminiContents(msgs) {
  return msgs.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));
}

export default function AIChat({ onClose, onNav }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [msgs, setMsgs] = useState([
    {
      role: 'assistant',
      text: "Hey! 👋 Tell me what you're looking for: food, culture, a walk — and I'll find your perfect neighbourhood!",
    },
  ]);
  const [inp, setInp] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, busy]);

  const send = async () => {
    if (!inp.trim() || busy) return;
    const txt = inp.trim();
    setInp('');
    const updated = [...msgs, { role: 'user', text: txt }];
    setMsgs(updated);
    setBusy(true);
    let reply = '';
    if (apiKey) {
      try {
        const res = await fetch(GEMINI_URL(apiKey), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Some Gemini REST variants reject `systemInstruction` on /v1.
            // To keep compatibility, we prepend our system prompt as the first message.
            contents: [
              { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
              ...buildGeminiContents(updated),
            ],
            generationConfig: {
              maxOutputTokens: 512,
              temperature: 0.7,
            },
          }),
        });
        const data = await res.json();
        const part = data?.candidates?.[0]?.content?.parts?.[0];
        if (part?.text) {
          reply = part.text.trim();
        } else if (data?.error) {
          console.warn('Gemini API error:', data.error.message || data.error);
        } else if (data?.candidates?.[0]?.finishReason === 'SAFETY') {
          console.warn('Gemini blocked response (safety)');
        } else {
          console.warn('Gemini no text in response:', data);
        }
      } catch (e) {
        console.warn('Gemini request failed', e);
      }
    } else {
      console.warn('No VITE_GEMINI_API_KEY — add it to .env and restart dev server');
    }
    if (!reply) reply = localRecommend(txt);
    setMsgs((p) => [...p, { role: 'assistant', text: reply }]);
    setBusy(false);
  };

  const mentioned = (t) =>
    NEIGHBOURHOODS.filter((n) => t.toLowerCase().includes(n.name.toLowerCase()));

  return (
    <div className="ai-chat">
      <div className="ai-head">
        <span>🗼 AI Neighbourhood Guide</span>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="ai-msgs" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role === 'user' ? 'u' : 'a'}`}>
            {m.text}
            {m.role === 'assistant' && mentioned(m.text).length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {mentioned(m.text).map((n) => (
                  <span
                    key={n.id}
                    onClick={() => onNav(n.id)}
                    className="ai-tag"
                  >
                    {n.flag} {n.name} →
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="ai-msg a">
            <div className="ai-dots">
              {[0, 1, 2].map((i) => (
                <div key={i} className="ai-dot" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="ai-input">
        <input
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              send();
            }
          }}
          placeholder="I'm craving spicy food..."
        />
        <button onClick={send} disabled={!inp.trim() || busy}>
          Send
        </button>
      </div>
    </div>
  );
}
