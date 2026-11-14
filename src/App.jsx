import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { calendarUrl, coupleNames, wedding } from "./wedding";

const InviteOpenContext = createContext(false);

function useInView() {
  const opened = useContext(InviteOpenContext);
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!opened || !node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [opened]);

  return [ref, shown];
}

function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const [ref, shown] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <i>◆</i>
      <span />
    </div>
  );
}

function Petals({ burst = false }) {
  const petals = useMemo(
    () =>
      Array.from({ length: burst ? 18 : 26 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * (burst ? 0.4 : 14),
        duration: (burst ? 3.2 : 11) + Math.random() * (burst ? 2 : 9),
        size: 9 + Math.random() * 13,
        sway: 18 + Math.random() * 46,
        spin: Math.random() * 360,
        tone: Math.random(),
      })),
    [burst]
  );

  return (
    <div className={`petals ${burst ? "is-burst" : ""}`} aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className={`petal tone-${petal.tone > 0.66 ? "gold" : petal.tone > 0.33 ? "marigold" : "rose"}`}
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            width: petal.size,
            height: petal.size * 1.4,
            "--sway": `${petal.sway}px`,
            "--spin": `${petal.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}

function Mandala() {
  return (
    <div className="mandala-spin" aria-hidden="true">
    <svg className="mandala" viewBox="0 0 200 200">
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <circle cx="100" cy="100" r="92" />
        <circle cx="100" cy="100" r="74" />
        <circle cx="100" cy="100" r="48" />
        <circle cx="100" cy="100" r="18" />
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="52"
            rx="10"
            ry="26"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={`p-${i}`}
            d="M100 28 C108 46 108 58 100 70 C92 58 92 46 100 28 Z"
            transform={`rotate(${i * 45} 100 100)`}
          />
        ))}
      </g>
    </svg>
    </div>
  );
}

function Diya() {
  return (
    <div className="diya" aria-hidden="true">
      <span className="flame" />
      <span className="lamp" />
    </div>
  );
}

function getRemaining(target) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: false,
  };
}

function Countdown() {
  const [time, setTime] = useState(() => getRemaining(wedding.countdownTo));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getRemaining(wedding.countdownTo));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Minutes", time.minutes],
    ["Seconds", time.seconds],
  ];

  return (
    <div className="countdown" aria-live="polite">
      {units.map(([label, value]) => (
        <div className="flip" key={label}>
          <div className="flip-face">
            <strong key={value}>{String(value).padStart(2, "0")}</strong>
          </div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Gate({ phase, onOpen }) {
  const names = coupleNames();
  return (
    <div
      className={`gate ${phase !== "closed" ? "is-opening" : ""} ${phase === "open" ? "is-open" : ""}`}
    >
      <div className="gate-copy">
        <p className="eyebrow gold-shimmer">{wedding.dateLabel}</p>
        <h2>
          {wedding.groom.first} <em>&</em> {wedding.bride.first}
        </h2>
        <p className="city">{wedding.city}</p>
      </div>
      <button
        className="envelope-button"
        onClick={onOpen}
        disabled={phase !== "closed"}
        aria-label={`Open the wedding invitation of ${names}`}
      >
        <div className="envelope">
          <div className="letter">
            <span>With love</span>
            <strong>{names}</strong>
            <small>{wedding.city}</small>
          </div>
          <div className="flap" />
          <div className="pocket" />
          <div className="seal">
            <span>ॐ</span>
          </div>
        </div>
        <p className="tap">Tap to open</p>
      </button>
    </div>
  );
}

function EventIcon({ name }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    "aria-hidden": true,
  };
  if (name === "mehendi") {
    return (
      <svg {...common}>
        <path d="M24 8c2 6-2 8-2 14 6-2 10 2 10 8-8 2-14-2-16-8 4 0 6-4 8-14z" />
        <path d="M18 34h12M20 38h8" />
      </svg>
    );
  }
  if (name === "haldi") {
    return (
      <svg {...common}>
        <circle cx="24" cy="24" r="8" />
        <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11 11l4 4M33 33l4 4M37 11l-4 4M15 33l-4 4" />
      </svg>
    );
  }
  if (name === "sangeet") {
    return (
      <svg {...common}>
        <path d="M18 34V16l16-4v18" />
        <circle cx="14" cy="34" r="4" />
        <circle cx="30" cy="30" r="4" />
      </svg>
    );
  }
  if (name === "wedding") {
    return (
      <svg {...common}>
        <circle cx="18" cy="26" r="7" />
        <circle cx="30" cy="26" r="7" />
        <path d="M24 12l1.4 3.2L29 16l-2.6 2.2.8 3.4L24 19.8 20.8 21.6l.8-3.4L19 16l3.6-.8z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M16 18h16v16a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V18z" />
      <path d="M16 20c0-6 16-6 16 0" />
    </svg>
  );
}

const emptyRsvp = {
  name: "",
  side: "Both families",
  guests: "1",
  attending: "yes",
  note: "",
};

export default function App() {
  const [phase, setPhase] = useState("closed");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState(emptyRsvp);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(null);
  const [burst, setBurst] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("invite-locked", phase !== "open");
  }, [phase]);

  useEffect(() => {
    if (phase === "open") titleRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wedding-rsvp");
      if (stored) setSaved(JSON.parse(stored));
    } catch {
      setSaved(null);
    }
  }, []);

  const openInvite = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setPhase("open"), 1680);
  };

  const shareInvite = async () => {
    const text = `${coupleNames()} are getting married on ${wedding.dateLabel} in ${wedding.city}.`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: coupleNames(), text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setToast("Invitation link copied");
      window.setTimeout(() => setToast(""), 2400);
    } catch {
      setToast("Copy the address from the browser bar to share");
      window.setTimeout(() => setToast(""), 2400);
    }
  };

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setError("");
  };

  const submitRsvp = (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Please add your name so we know who is responding.");
      return;
    }
    const entry = { ...form, name: form.name.trim(), at: new Date().toISOString() };
    setSaved(entry);
    setBurst(true);
    try {
      localStorage.setItem("wedding-rsvp", JSON.stringify(entry));
    } catch {
      /* The thank-you still shows if storage is blocked. */
    }
    window.setTimeout(() => setBurst(false), 2800);
  };

  const names = coupleNames();

  return (
    <InviteOpenContext.Provider value={phase === "open"}>
      <Petals />
      <Gate phase={phase} onOpen={openInvite} />
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
      {burst && <Petals burst />}

      <header className={`topbar ${phase === "open" ? "is-ready" : ""}`}>
        <a className="brand" href="#invitation">
          {names}
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
        <nav className={menuOpen ? "is-open" : ""}>
          <a href="#blessing" onClick={() => setMenuOpen(false)}>Blessing</a>
          <a href="#celebrations" onClick={() => setMenuOpen(false)}>Celebrations</a>
          <a href="#venue" onClick={() => setMenuOpen(false)}>Venue</a>
          <a href="#rsvp" onClick={() => setMenuOpen(false)}>RSVP</a>
        </nav>
      </header>

      <main className={phase === "open" ? "is-visible" : ""}>
        <section className="hero" id="blessing">
          <Mandala />
          <div className="diya-row" aria-hidden="true">
            <Diya />
            <Diya />
          </div>
          <Reveal>
            <p className="eyebrow">Shri Ganeshaya Namah</p>
            <p className="shloka">
              वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।
              <br />
              निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
            </p>
            <p className="translation">
              O Lord of the curved trunk, radiant as a million suns — keep every
              step of this union free from obstacles.
            </p>
          </Reveal>
        </section>

        <section className="invite" id="invitation">
          <Reveal>
            <p className="eyebrow">The invitation</p>
            <h1 ref={titleRef} tabIndex={-1}>
              Wedding invitation of {wedding.groom.first} and {wedding.bride.first}
            </h1>
            <Ornament />
            <p className="lede">
              With the blessings of our elders, we joyfully invite you to celebrate
              the wedding of
            </p>
          </Reveal>

          <div className="couple">
            <Reveal className="person from-left">
              <p className="role">The groom</p>
              <h2>{wedding.groom.first}</h2>
              <p className="surname">{wedding.groom.last}</p>
              <p className="parents">
                {wedding.groom.relation} {wedding.groom.parents}
              </p>
            </Reveal>
            <Reveal className="ampersand" delay={120}>
              <span>&</span>
            </Reveal>
            <Reveal className="person from-right" delay={80}>
              <p className="role">The bride</p>
              <h2>{wedding.bride.first}</h2>
              <p className="surname">{wedding.bride.last}</p>
              <p className="parents">
                {wedding.bride.relation} {wedding.bride.parents}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="save-date" id="date">
          <Reveal>
            <p className="eyebrow">Save the dates</p>
            <h2>{wedding.dateLabel}</h2>
            <p className="place">
              {wedding.venue.name}, {wedding.city}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Countdown />
          </Reveal>
          <Reveal delay={160}>
            <a className="button" href={calendarUrl()} target="_blank" rel="noreferrer">
              Add to calendar
            </a>
          </Reveal>
        </section>

        <section className="events" id="celebrations">
          <Reveal>
            <p className="eyebrow">Join us for</p>
            <h2>The celebrations</h2>
            <Ornament />
          </Reveal>
          <ol className="event-list">
            {wedding.events.map((item, index) => (
              <Reveal
                as="li"
                key={item.key}
                className={index % 2 ? "from-right" : "from-left"}
                delay={index * 70}
              >
                <article className="event-card">
                  <div className="event-icon">
                    <EventIcon name={item.key} />
                  </div>
                  <div>
                    <p className="event-name">{item.name}</p>
                    <h3>{item.title}</h3>
                    <p>
                      <span>When</span>
                      {item.when}
                    </p>
                    <p>
                      <span>Dress code</span>
                      {item.dress}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="venue" id="venue">
          <Reveal>
            <p className="eyebrow">Where</p>
            <h2>Reception Venue & travel</h2>
            <h3>{wedding.venue.name}</h3>
            <p>{wedding.venue.area}</p>
            <a className="button" href={wedding.venue.maps} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
          </Reveal>
          <Reveal className="map-frame" delay={100}>
            <iframe
              title={`Map of ${wedding.venue.name}`}
              src={wedding.venue.mapEmbed}
              loading="lazy"
            />
          </Reveal>
          <ul className="travel">
            {wedding.travel.map((item) => (
              <Reveal as="li" key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="closing">
          <Mandala />
          <Reveal>
            <p className="eyebrow">Closing</p>
            <h2>We look forward to celebrating with you</h2>
            <p className="hashtag">{wedding.hashtag}</p>
            <button className="button" type="button" onClick={shareInvite}>
              Share this invite
            </button>
            <p className="signoff">
              {names} · {wedding.city} · 2026
            </p>
          </Reveal>
        </section>

        {/* <section className="rsvp" id="rsvp">
          <Reveal>
            <p className="eyebrow">Kindly respond</p>
            <h2>RSVP</h2>
            <p>Please reply by {wedding.rsvpBy}. We have saved a seat in the celebration for you.</p>
          </Reveal>

          {saved ? (
            <Reveal className="thanks">
              <Diya />
              <h3>
                {saved.attending === "yes"
                  ? `We cannot wait to celebrate with you, ${saved.name}.`
                  : `You will be missed, ${saved.name}. Thank you for letting us know.`}
              </h3>
              <p>
                {saved.attending === "yes"
                  ? `${saved.guests} guest${saved.guests === "1" ? "" : "s"} · ${saved.side}`
                  : "Your blessing still means the world to both families."}
              </p>
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setSaved(null);
                  localStorage.removeItem("wedding-rsvp");
                }}
              >
                Edit response
              </button>
            </Reveal>
          ) : (
            <form className="rsvp-form" onSubmit={submitRsvp}>
              <label>
                Your name
                <input value={form.name} onChange={update("name")} placeholder="Full name" />
              </label>
              <label>
                You are with
                <select value={form.side} onChange={update("side")}>
                  <option>Both families</option>
                  <option>Groom&apos;s family</option>
                  <option>Bride&apos;s family</option>
                  <option>Friends</option>
                </select>
              </label>
              <label>
                Will you attend?
                <select value={form.attending} onChange={update("attending")}>
                  <option value="yes">Yes, with joy</option>
                  <option value="no">Sending blessings from afar</option>
                </select>
              </label>
              <label>
                Number of guests
                <select value={form.guests} onChange={update("guests")}>
                  {["1", "2", "3", "4", "5", "6"].map((count) => (
                    <option key={count}>{count}</option>
                  ))}
                </select>
              </label>
              <label className="wide">
                A note for the couple
                <textarea
                  value={form.note}
                  onChange={update("note")}
                  rows="3"
                  placeholder="A wish, a song request, a dietary note…"
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="button" type="submit">
                Send RSVP
              </button>
            </form>
          )}
        </section> */}
      </main>

      <footer>
        <p>
          {names} · {wedding.dateLabel}
        </p>
      </footer>
      {toast && <div className="toast">{toast}</div>}
    </InviteOpenContext.Provider>
  );
}
