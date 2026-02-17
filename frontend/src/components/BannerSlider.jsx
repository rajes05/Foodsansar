import React, { useState, useEffect, useRef, useCallback } from 'react';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(15,10,5,0.82) 0%, rgba(15,10,5,0.55) 55%, rgba(15,10,5,0.1) 100%)',
    tag: "TODAY'S DEAL",
    tagColor: '#F85606',
    headline: ['Get 40% Off', 'Your First Order'],
    accentWord: 1,
    accentColor: '#F85606',
    body: 'Fresh meals from the best kitchens in your city — delivered hot to your door.',
    cta: 'Order Now',
    sub: 'Use code FIRST40 at checkout',
    badge: '🏍️  30 min delivery',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(8,18,10,0.85) 0%, rgba(8,18,10,0.55) 55%, rgba(8,18,10,0.05) 100%)',
    tag: 'FRESH & HEALTHY',
    tagColor: '#22c55e',
    headline: ['Pure Veg', 'Specials Today'],
    accentWord: 0,
    accentColor: '#22c55e',
    body: 'Hand-picked vegetarian dishes made with farm-fresh ingredients every morning.',
    cta: 'Explore Menu',
    sub: 'New items added daily',
    badge: '🌿  100% Vegetarian',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(10,5,2,0.88) 0%, rgba(10,5,2,0.6) 55%, rgba(10,5,2,0.05) 100%)',
    tag: 'WEEKEND SPECIAL',
    tagColor: '#f59e0b',
    headline: ['Family Feast', 'Starts at Rs.299'],
    accentWord: 1,
    accentColor: '#f59e0b',
    body: 'Big portions, better savings. Feed the whole family without breaking the bank.',
    cta: 'See Deals',
    sub: 'Valid Sat & Sun only',
    badge: '👨‍👩‍👧  Family portions',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=85&fit=crop',
    overlay: 'linear-gradient(105deg, rgba(5,8,20,0.88) 0%, rgba(5,8,20,0.6) 55%, rgba(5,8,20,0.05) 100%)',
    tag: 'TOP RATED',
    tagColor: '#a78bfa',
    headline: ['Discover The', 'Best Restaurants'],
    accentWord: 0,
    accentColor: '#a78bfa',
    body: 'Explore top-rated shops hand-picked by thousands of happy customers near you.',
    cta: 'Browse Shops',
    sub: 'Rated 4.5+ by real users',
    badge: '⭐  4.5+ rated only',
  },
];

const DURATION = 5000;

export default function BannerSlider() {
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState('next');
  const [prevIdx, setPrevIdx] = useState(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(Date.now());

  const go = useCallback((next, direction = 'next') => {
    if (animating || next === cur) return;
    setDir(direction);
    setPrevIdx(cur);
    setAnimating(true);
    setCur(next);
    setProgress(0);
    startRef.current = Date.now();
    setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 600);
  }, [animating, cur]);

  const next = useCallback(() => go((cur + 1) % banners.length, 'next'), [cur, go]);
  const prev = useCallback(() => go((cur - 1 + banners.length) % banners.length, 'prev'), [cur, go]);

  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(next, DURATION);
    return () => clearInterval(timerRef.current);
  }, [next, paused]);

  useEffect(() => {
    if (paused) { cancelAnimationFrame(rafRef.current); return; }
    startRef.current = Date.now();
    const tick = () => {
      const p = Math.min(((Date.now() - startRef.current) / DURATION) * 100, 100);
      setProgress(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cur, paused]);

  const b = banners[cur];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .fs-wrap { width: 100%; font-family: 'DM Sans', sans-serif; }

        .fs-track {
          position: relative;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 21/7;
          min-height: 180px;
          max-height: 360px;
          background: #111;
          box-shadow: 0 2px 32px rgba(0,0,0,0.22);
        }
        @media (max-width: 640px) {
          .fs-track { aspect-ratio: 4/3; max-height: 280px; border-radius: 12px; }
        }
        @media (max-width: 400px) {
          .fs-track { aspect-ratio: 1/1; }
        }

        .fs-slide { position: absolute; inset: 0; }
        .fs-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
        }
        .fs-ov { position: absolute; inset: 0; }

        .fs-enter-next { animation: fsEnN 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }
        .fs-enter-prev { animation: fsEnP 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }
        .fs-exit-next  { animation: fsExN 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }
        .fs-exit-prev  { animation: fsExP 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }

        @keyframes fsEnN { from { transform:translateX(5%) scale(1.03); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes fsEnP { from { transform:translateX(-5%) scale(1.03); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes fsExN { from { transform:none; opacity:1; } to { transform:translateX(-3%) scale(0.99); opacity:0; } }
        @keyframes fsExP { from { transform:none; opacity:1; } to { transform:translateX(3%) scale(0.99); opacity:0; } }

        .fs-content {
          position: absolute; inset: 0; z-index: 3;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 32px 40px 28px;
        }
        @media (max-width: 640px) { .fs-content { padding: 16px 18px 20px; } }

        .fs-tag {
          font-size: 10px; font-weight: 600;
          letter-spacing: 2.5px; text-transform: uppercase;
          padding: 4px 10px; border-radius: 4px;
          display: inline-block; width: fit-content;
          margin-bottom: 10px;
          animation: fsUp 0.45s 0.05s both;
        }

        .fs-headline {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(20px, 3.6vw, 50px);
          line-height: 1.12;
          color: #fff;
          margin: 0 0 10px;
          max-width: 500px;
          animation: fsUp 0.45s 0.12s both;
        }
        .fs-headline span { display: block; }

        .fs-body {
          font-size: clamp(11px, 1.15vw, 14px);
          color: rgba(255,255,255,0.68);
          margin: 0 0 20px;
          max-width: 380px;
          line-height: 1.65;
          animation: fsUp 0.45s 0.18s both;
        }
        @media (max-width: 500px) { .fs-body { display: none; } }

        .fs-row {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
          animation: fsUp 0.45s 0.24s both;
        }

        .fs-btn {
          padding: 10px 24px; border-radius: 6px;
          font-size: 13px; font-weight: 600;
          border: none; cursor: pointer; color: #fff;
          font-family: 'DM Sans', sans-serif;
          text-decoration: none; display: inline-block;
          transition: filter 0.18s, transform 0.15s;
          white-space: nowrap; letter-spacing: 0.2px;
        }
        .fs-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .fs-btn:active { transform: scale(0.97); }

        .fs-chip {
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.78);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(6px);
          padding: 8px 13px; border-radius: 6px;
          white-space: nowrap;
        }
        @media (max-width: 430px) { .fs-chip { display: none; } }

        .fs-sub {
          font-size: 11px; color: rgba(255,255,255,0.35);
          margin: 9px 0 0; letter-spacing: 0.2px;
          animation: fsUp 0.45s 0.3s both;
        }

        /* progress */
        .fs-progress {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: rgba(255,255,255,0.12); z-index: 10;
        }
        .fs-progress-fill { height: 100%; transition: width 0.1s linear; }

        /* counter */
        .fs-counter {
          position: absolute; top: 14px; right: 14px; z-index: 9;
          font-size: 11px; font-weight: 600; letter-spacing: 1.2px;
          color: rgba(255,255,255,0.6);
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px; border-radius: 20px;
        }

        /* arrows — hidden until hover on desktop */
        .fs-arrow {
          position: absolute; top: 50%; z-index: 9;
          transform: translateY(-50%);
          width: 36px; height: 36px;
          background: rgba(0,0,0,0.38);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(8px);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff;
          opacity: 0;
          transition: opacity 0.22s, background 0.2s, transform 0.2s;
        }
        .fs-track:hover .fs-arrow { opacity: 1; }
        .fs-arrow:hover { background: rgba(0,0,0,0.6); transform: translateY(-50%) scale(1.1); }
        .fs-al { left: 12px; }
        .fs-ar { right: 12px; }
        @media (max-width: 600px) {
          .fs-arrow { opacity: 1; width: 28px; height: 28px; }
          .fs-al { left: 7px; }
          .fs-ar { right: 7px; }
        }

        /* dots */
        .fs-dots {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-top: 12px;
        }
        .fs-dot {
          height: 3px; border-radius: 2px;
          border: none; cursor: pointer; padding: 0;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .fs-dot.on  { width: 26px; }
        .fs-dot.off { width: 8px; background: #ccc; }
        .fs-dot.off:hover { background: #aaa; }

        @keyframes fsUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="fs-wrap">
        <div
          className="fs-track"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchX.current === null) return;
            const d = touchX.current - e.changedTouches[0].clientX;
            if (Math.abs(d) > 40) d > 0 ? next() : prev();
            touchX.current = null;
          }}
        >
          {/* Exiting slide */}
          {prevIdx !== null && (
            <div key={`x${prevIdx}`} className={`fs-slide ${dir === 'next' ? 'fs-exit-next' : 'fs-exit-prev'}`}>
              <img className="fs-img" src={banners[prevIdx].image} alt="" />
              <div className="fs-ov" style={{ background: banners[prevIdx].overlay }} />
            </div>
          )}

          {/* Current slide */}
          <div key={`c${cur}`} className={`fs-slide${animating ? ` ${dir === 'next' ? 'fs-enter-next' : 'fs-enter-prev'}` : ''}`}>
            <img className="fs-img" src={b.image} alt={b.headline.join(' ')} />
            <div className="fs-ov" style={{ background: b.overlay }} />

            <div className="fs-content" key={`t${cur}`}>
              {/* Tag */}
              <div
                className="fs-tag"
                style={{ background: `${b.tagColor}20`, color: b.tagColor, border: `1px solid ${b.tagColor}40` }}
              >
                {b.tag}
              </div>

              {/* Headline */}
              <h2 className="fs-headline">
                {b.headline.map((line, i) => (
                  <span key={i} style={i === b.accentWord ? { color: b.accentColor } : {}}>
                    {line}
                  </span>
                ))}
              </h2>

              {/* Body */}
              <p className="fs-body">{b.body}</p>

              {/* CTA row */}
              <div className="fs-row">
                <a
                  href="#shop-by-city"
                  className="fs-btn"
                  style={{ background: b.tagColor, boxShadow: `0 4px 16px ${b.tagColor}50` }}
                >
                  {b.cta} →
                </a>
                <div className="fs-chip">{b.badge}</div>
              </div>

              {/* Sub note */}
              <p className="fs-sub">{b.sub}</p>
            </div>
          </div>

          {/* Counter */}
          <div className="fs-counter">{cur + 1} / {banners.length}</div>

          {/* Progress */}
          <div className="fs-progress">
            <div className="fs-progress-fill" style={{ width: `${progress}%`, background: b.tagColor }} />
          </div>

          {/* Arrows */}
          <button className="fs-arrow fs-al" onClick={prev} aria-label="Previous">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="fs-arrow fs-ar" onClick={next} aria-label="Next">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="fs-dots">
          {banners.map((bn, i) => (
            <button
              key={i}
              className={`fs-dot ${i === cur ? 'on' : 'off'}`}
              style={i === cur ? { background: bn.tagColor } : {}}
              onClick={() => go(i, i > cur ? 'next' : 'prev')}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}