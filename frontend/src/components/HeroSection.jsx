import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────── BANNER DATA ─────────────────────────── */
const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=85&fit=crop",
    overlay: "linear-gradient(105deg,rgba(15,10,5,0.86)0%,rgba(15,10,5,0.55)55%,rgba(15,10,5,0.08)100%)",
    tag: "TODAY'S DEAL",
    tagColor: "#F85606",
    headline: ["Get 40% Off", "Your First Order"],
    accentWord: 1,
    accentColor: "#F85606",
    body: "Fresh meals from the best kitchens in your city — delivered hot to your door.",
    cta: "Order Now",
    sub: "Use code FIRST40 at checkout",
    badge: "🏍️  30 min delivery",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1400&q=85&fit=crop",
    overlay: "linear-gradient(105deg,rgba(8,18,10,0.88)0%,rgba(8,18,10,0.55)55%,rgba(8,18,10,0.05)100%)",
    tag: "FRESH & HEALTHY",
    tagColor: "#22c55e",
    headline: ["Pure Veg", "Specials Today"],
    accentWord: 0,
    accentColor: "#22c55e",
    body: "Hand-picked vegetarian dishes made with farm-fresh ingredients every morning.",
    cta: "Explore Menu",
    sub: "New items added daily",
    badge: "🌿  100% Vegetarian",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400&q=85&fit=crop",
    overlay: "linear-gradient(105deg,rgba(10,5,2,0.90)0%,rgba(10,5,2,0.62)55%,rgba(10,5,2,0.05)100%)",
    tag: "WEEKEND SPECIAL",
    tagColor: "#f59e0b",
    headline: ["Family Feast", "Starts at Rs.299"],
    accentWord: 1,
    accentColor: "#f59e0b",
    body: "Big portions, better savings. Feed the whole family without breaking the bank.",
    cta: "See Deals",
    sub: "Valid Sat & Sun only",
    badge: "👨‍👩‍👧  Family portions",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=85&fit=crop",
    overlay: "linear-gradient(105deg,rgba(5,8,20,0.90)0%,rgba(5,8,20,0.62)55%,rgba(5,8,20,0.05)100%)",
    tag: "TOP RATED",
    tagColor: "#a78bfa",
    headline: ["Discover The", "Best Restaurants"],
    accentWord: 0,
    accentColor: "#a78bfa",
    body: "Explore top-rated shops hand-picked by thousands of happy customers near you.",
    cta: "Browse Shops",
    sub: "Rated 4.5+ by real users",
    badge: "⭐  4.5+ rated only",
  },
];

const DURATION = 5000;

/* ─────────────────────────── BANNER SLIDER ─────────────────────────── */
function BannerSlider() {
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState("next");
  const [prevIdx, setPrevIdx] = useState(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(Date.now());

  const go = useCallback(
    (next, direction = "next") => {
      if (animating || next === cur) return;
      setDir(direction);
      setPrevIdx(cur);
      setAnimating(true);
      setCur(next);
      setProgress(0);
      startRef.current = Date.now();
      setTimeout(() => { setPrevIdx(null); setAnimating(false); }, 600);
    },
    [animating, cur]
  );

  const next = useCallback(() => go((cur + 1) % banners.length, "next"), [cur, go]);
  const prev = useCallback(() => go((cur - 1 + banners.length) % banners.length, "prev"), [cur, go]);

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
    <div className="banner-wrap">
      <div
        className="banner-track"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const d = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 40) d > 0 ? next() : prev();
          touchX.current = null;
        }}
      >
        {prevIdx !== null && (
          <div key={`x${prevIdx}`} className={`b-slide ${dir === "next" ? "exit-next" : "exit-prev"}`}>
            <img className="b-img" src={banners[prevIdx].image} alt="" />
            <div className="b-ov" style={{ background: banners[prevIdx].overlay }} />
          </div>
        )}

        <div key={`c${cur}`} className={`b-slide${animating ? ` ${dir === "next" ? "enter-next" : "enter-prev"}` : ""}`}>
          <img className="b-img" src={b.image} alt={b.headline.join(" ")} />
          <div className="b-ov" style={{ background: b.overlay }} />
          <div className="b-content" key={`t${cur}`}>
            <div className="b-tag" style={{ background: `${b.tagColor}22`, color: b.tagColor, border: `1px solid ${b.tagColor}44` }}>
              {b.tag}
            </div>
            <h2 className="b-headline">
              {b.headline.map((line, i) => (
                <span key={i} style={i === b.accentWord ? { color: b.accentColor } : {}}>
                  {line}
                </span>
              ))}
            </h2>
            <p className="b-body">{b.body}</p>
            <div className="b-row">
              <a href="#shop-by-city" className="b-btn" style={{ background: b.tagColor, boxShadow: `0 4px 18px ${b.tagColor}55` }}>
                {b.cta} →
              </a>
              <div className="b-chip">{b.badge}</div>
            </div>
            <p className="b-sub">{b.sub}</p>
          </div>
        </div>

        <div className="b-counter">{cur + 1} / {banners.length}</div>
        <div className="b-progress">
          <div className="b-progress-fill" style={{ width: `${progress}%`, background: b.tagColor }} />
        </div>

        <button className="b-arrow b-al" onClick={prev} aria-label="Previous">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="b-arrow b-ar" onClick={next} aria-label="Next">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      <div className="b-dots">
        {banners.map((bn, i) => (
          <button
            key={i}
            className={`b-dot ${i === cur ? "on" : "off"}`}
            style={i === cur ? { background: bn.tagColor } : {}}
            onClick={() => go(i, i > cur ? "next" : "prev")}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── HERO SECTION ─────────────────────────── */
export default function HeroSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .hero {
          background: #fff;
          padding: 0 24px;
          height: calc(100vh - 80px);
          margin-top: 80px;
          display: flex;
          align-items: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .hero-inner {
          max-width: 1240px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr 1.15fr;
          gap: 56px; align-items: center;
        }

        /* LEFT */
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff2ec; color: #F85606;
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; padding: 6px 14px; border-radius: 20px;
          margin-bottom: 22px;
        }
        .hero-eyebrow-dot {
          width: 6px; height: 6px; background: #F85606;
          border-radius: 50%; flex-shrink: 0;
        }
        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 900; line-height: 1.1;
          color: #1a1a1a; margin-bottom: 18px;
          letter-spacing: -1px;
        }
        .hero-h1 em { color: #F85606; font-style: normal; }
        .hero-desc {
          font-size: 16px; color: #6b7280;
          line-height: 1.8; max-width: 420px;
          margin-bottom: 36px;
        }

        /* CTA buttons */
        .hero-ctas {
          display: flex; align-items: center; gap: 14px;
          flex-wrap: wrap; margin-bottom: 40px;
        }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #F85606; color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 13px 28px; border-radius: 10px;
          border: none; cursor: pointer;
          box-shadow: 0 4px 20px rgba(248,86,6,0.35);
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          text-decoration: none;
        }
        .hero-btn-primary:hover {
          background: #d44500;
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(248,86,6,0.45);
        }
        .hero-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #1a1a1a;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          padding: 12px 24px; border-radius: 10px;
          border: 1.5px solid #e5e7eb; cursor: pointer;
          transition: border-color 0.18s, background 0.18s, color 0.18s;
          text-decoration: none;
        }
        .hero-btn-ghost:hover {
          border-color: #F85606; background: #fff2ec; color: #F85606;
        }

        /* Stats */
        .hero-stats {
          display: flex; align-items: center; gap: 0; flex-wrap: wrap;
        }
        .stat-item { padding: 0 28px 0 0; }
        .stat-item:first-child { padding-left: 0; }
        .stat-num {
          font-size: 24px; font-weight: 800; color: #1a1a1a;
          line-height: 1; display: block;
        }
        .stat-label { font-size: 12px; color: #9ca3af; font-weight: 500; margin-top: 3px; display: block; }
        .stat-divider {
          width: 1px; height: 36px; background: #e5e7eb;
          flex-shrink: 0; margin-right: 28px;
        }

        /* BANNER SLIDER */
        .banner-wrap { width: 100%; }
        .banner-track {
          position: relative; width: 100%; border-radius: 18px; overflow: hidden;
          aspect-ratio: 16/10; min-height: 220px; max-height: 400px;
          background: #111;
          box-shadow: 0 8px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
        }
        .b-slide { position: absolute; inset: 0; }
        .b-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
        .b-ov { position: absolute; inset: 0; }

        .enter-next { animation: bEnN 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }
        .enter-prev { animation: bEnP 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }
        .exit-next  { animation: bExN 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }
        .exit-prev  { animation: bExP 0.62s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes bEnN { from { transform:translateX(5%) scale(1.03); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes bEnP { from { transform:translateX(-5%) scale(1.03); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes bExN { from { transform:none; opacity:1; } to { transform:translateX(-3%) scale(0.99); opacity:0; } }
        @keyframes bExP { from { transform:none; opacity:1; } to { transform:translateX(3%) scale(0.99); opacity:0; } }

        .b-content {
          position: absolute; inset: 0; z-index: 3;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 28px 32px 24px;
        }
        .b-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          padding: 4px 10px; border-radius: 4px; display: inline-block; width: fit-content;
          margin-bottom: 8px; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .b-headline {
          font-family: 'Playfair Display', serif; font-weight: 900;
          font-size: clamp(20px, 2.8vw, 38px); line-height: 1.12;
          color: #fff; margin: 0 0 8px;
        }
        .b-headline span { display: block; }
        .b-body {
          font-size: clamp(11px, 1vw, 13px); color: rgba(255,255,255,0.65);
          margin: 0 0 16px; max-width: 300px; line-height: 1.65;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .b-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .b-btn {
          padding: 9px 20px; border-radius: 7px; font-size: 13px; font-weight: 700;
          border: none; cursor: pointer; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif;
          text-decoration: none; display: inline-block;
          transition: filter 0.18s, transform 0.15s; white-space: nowrap;
        }
        .b-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .b-chip {
          font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(6px); padding: 7px 12px; border-radius: 6px;
          white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .b-sub { font-size: 11px; color: rgba(255,255,255,0.32); margin: 8px 0 0; }
        .b-counter {
          position: absolute; top: 12px; right: 12px; z-index: 9;
          font-size: 11px; font-weight: 600; letter-spacing: 1px;
          color: rgba(255,255,255,0.55); background: rgba(0,0,0,0.3);
          backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.1);
          padding: 3px 9px; border-radius: 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .b-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.1); z-index: 10; }
        .b-progress-fill { height: 100%; transition: width 0.1s linear; }
        .b-arrow {
          position: absolute; top: 50%; z-index: 9; transform: translateY(-50%);
          width: 34px; height: 34px; background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; opacity: 0;
          transition: opacity 0.22s, background 0.2s, transform 0.2s;
        }
        .banner-track:hover .b-arrow { opacity: 1; }
        .b-arrow:hover { background: rgba(0,0,0,0.55); transform: translateY(-50%) scale(1.1); }
        .b-al { left: 10px; }
        .b-ar { right: 10px; }
        .b-dots { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; }
        .b-dot { height: 3px; border-radius: 2px; border: none; cursor: pointer; padding: 0; transition: width 0.3s, background 0.3s; }
        .b-dot.on { width: 24px; }
        .b-dot.off { width: 8px; background: #d1d5db; }
        .b-dot.off:hover { background: #9ca3af; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; gap: 28px; }
          .hero { height: auto; min-height: calc(100vh - 80px); padding: 40px 20px; }
        }
        @media (max-width: 600px) {
          .banner-track { aspect-ratio: 4/3; border-radius: 12px; }
          .b-body { display: none; }
          .b-chip { display: none; }
          .b-arrow { opacity: 1; width: 28px; height: 28px; }
          .stat-item { padding-right: 20px; }
          .stat-divider { margin-right: 20px; }
        }
      `}</style>

      <section className="hero">
        <div className="hero-inner">

          {/* ── LEFT ── */}
          <div>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Now delivering across Nepal
            </div>

            <h1 className="hero-h1">
              Food You Love,<br />
              <em>Delivered Fast.</em>
            </h1>

            <p className="hero-desc">
              Order from hundreds of restaurants near you. Fresh meals, great deals, and 30-minute delivery — right to your door.
            </p>

            <div className="hero-ctas">
              <a href="#restaurants" className="hero-btn-primary">
                Order Now
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#how-it-works" className="hero-btn-ghost">
                How it works
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">500+</span>
                <span className="stat-label">Restaurants</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">30 min</span>
                <span className="stat-label">Avg. delivery</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">4.8★</span>
                <span className="stat-label">User rating</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT — Banner Slider ── */}
          <BannerSlider />

        </div>
      </section>
    </>
  );
}


