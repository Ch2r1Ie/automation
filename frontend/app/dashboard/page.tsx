"use client";

import { useState, useEffect, type ReactElement } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const RED    = "#FF2D20";
const BLUE   = "#0066FF";
const YELLOW = "#FFD60A";
const DARK   = "#0a0a0a";

// ─── Types ────────────────────────────────────────────────────────────────────
type Platform   = "X.com" | "TikTok";
type NavSection = "accounts" | "trends" | "feed" | "analytics";

interface PlatformMeta {
  color: string; bg: string; border: string; handle: string; role: string;
}

const PLATFORM_META: Record<Platform, PlatformMeta> = {
  "X.com":  { color: "#000000", bg: "rgba(0,0,0,0.05)",    border: "rgba(0,0,0,0.14)",    handle: "@you_x",       role: "Scrape local trends"   },
  TikTok:   { color: "#FF0050", bg: "rgba(255,0,80,0.06)", border: "rgba(255,0,80,0.2)",  handle: "@you_tiktok",  role: "Auto-post daily"        },
};

const ALL_PLATFORMS: Platform[] = ["X.com", "TikTok"];

interface Stat { views: number; likes: number; comments: number; shares: number }

interface Post {
  id: string;
  content: string;
  xSource: string;
  timestamp: string;
  status: "Posted";
  stats: Stat;
}

// ─── Mock X trends ────────────────────────────────────────────────────────────
const MOCK_TRENDS = [
  {
    id: "t1",
    xPost: "This local night market just went from 50 customers to fully booked every night after one tweet thread 🧵",
    views: "2.1M",
    region: "Local · Trending now",
    script: "POV: A local night market blew up overnight because of one X thread — and I went to check if it's actually worth it 👀 #fyp #localfood #trending",
    tags: ["#localfood", "#fyp", "#trending"],
  },
  {
    id: "t2",
    xPost: "Nobody is talking about how this hidden café in the city has been serving the same recipe for 40 years and the queue never stops",
    views: "890K",
    region: "Local · Rising fast",
    script: "There's a café in my city that's been using the same recipe for 40 years. I finally went. Here's what happened 🫶 #localcafe #hiddengem #fyp",
    tags: ["#localcafe", "#hiddengem", "#fyp"],
  },
  {
    id: "t3",
    xPost: "Local bus driver has been giving free rides to students for 3 years. No one noticed until today.",
    views: "3.4M",
    region: "Local · Viral",
    script: "A local bus driver has been giving free rides to students for 3 years. Nobody noticed — until X. Here's the full story 🙏 #localheroes #viral #fyp",
    tags: ["#localheroes", "#viral", "#fyp"],
  },
];

// ─── Persistence ──────────────────────────────────────────────────────────────
function loadConnected(): Platform[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("cc_connected") ?? "[]") as Platform[]; }
  catch { return []; }
}
function saveConnected(c: Platform[]) {
  localStorage.setItem("cc_connected", JSON.stringify(c));
}
function loadPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("cc_posts") ?? "[]") as Post[]; }
  catch { return []; }
}
function savePosts(p: Post[]) {
  localStorage.setItem("cc_posts", JSON.stringify(p));
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function genStat(): Stat {
  const views = Math.floor(Math.random() * 200_000 + 5_000);
  return {
    views,
    likes:    Math.floor(views * (0.04  + Math.random() * 0.08)),
    comments: Math.floor(views * (0.005 + Math.random() * 0.015)),
    shares:   Math.floor(views * (0.01  + Math.random() * 0.03)),
  };
}
function fmt(n: number) { return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n); }

// ─── Icons ────────────────────────────────────────────────────────────────────
function IcoTikTok({ s = 20 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      <path fill="#69C9D0" d="M20.09 6.19a5.33 5.33 0 01-4.17-4.7V.5h-3.82v15.14a3.2 3.2 0 01-3.19 2.77 3.2 3.2 0 01-3.2-3.2 3.2 3.2 0 013.2-3.19c.3 0 .6.04.87.11V8.29a7.02 7.02 0 00-.87-.06 7.02 7.02 0 00-7.01 7.01 7.02 7.02 0 007.01 7.01 7.02 7.02 0 007-7.01V9.62a9.06 9.06 0 005.3 1.68V7.48a5.36 5.36 0 01-1.12-.08l-.01-.01z" opacity=".5"/>
      <path fill="#FF0050" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" opacity=".7"/>
      <path fill="#010101" d="M18.59 5.69a4.83 4.83 0 01-3.77-4.25V1h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V8.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V7.69a8.18 8.18 0 004.78 1.52V5.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  );
}
function IcoX({ s = 20 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="#000">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

const PLATFORM_ICONS: Record<Platform, ReactElement> = {
  "X.com":  <IcoX />,
  TikTok:   <IcoTikTok />,
};

// ─── UI icons ─────────────────────────────────────────────────────────────────
const Ico = {
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Trend: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Feed: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Bar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l2.5 2.5L10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Up: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Spark: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  ),
};

// ─── OAuth Connect Modal ──────────────────────────────────────────────────────
function OAuthModal({ platform, onDone }: { platform: Platform; onDone: () => void }) {
  const [phase, setPhase] = useState<"connecting" | "success">("connecting");
  const [barW,  setBarW]  = useState(0);
  const m = PLATFORM_META[platform];

  useEffect(() => {
    const t1 = setTimeout(() => setBarW(100), 80);
    const t2 = setTimeout(() => setPhase("success"), 2000);
    const t3 = setTimeout(onDone, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-xs rounded-3xl p-8 flex flex-col items-center gap-5 text-center"
        style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.24)" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: m.bg, border: `2px solid ${m.border}` }}>
          {platform === "TikTok" ? <IcoTikTok s={32} /> : <IcoX s={32} />}
        </div>
        {phase === "connecting" ? (
          <>
            <div>
              <p className="text-base font-bold" style={{ color: DARK }}>Connecting to {platform}</p>
              <p className="text-sm mt-1" style={{ color: `${DARK}55` }}>Authorizing your account…</p>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
              <div style={{ height: "100%", width: `${barW}%`, background: m.color, borderRadius: 99, transition: "width 1.85s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
            <p className="text-xs" style={{ color: `${DARK}35` }}>Secure OAuth 2.0 · Do not close this window</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "rgba(48,209,88,0.12)", border: "2px solid rgba(48,209,88,0.4)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#30D158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: DARK }}>Connected!</p>
              <p className="text-sm mt-1 font-medium" style={{ color: `${DARK}55` }}>{m.handle}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, connected }: {
  active: NavSection; setActive: (s: NavSection) => void; connected: Platform[];
}) {
  const nav: { id: NavSection; label: string; icon: ReactElement }[] = [
    { id: "accounts", label: "Accounts", icon: <Ico.Grid /> },
    { id: "trends",   label: "Trends",   icon: <Ico.Trend /> },
    { id: "feed",     label: "Feed",     icon: <Ico.Feed /> },
    { id: "analytics",label: "Analytics",icon: <Ico.Bar />  },
  ];
  return (
    <aside className="hidden md:flex flex-col gap-1 shrink-0 overflow-y-auto"
      style={{ width: 220, background: "rgba(255,255,255,0.95)", borderRight: "1.5px solid rgba(0,0,0,0.07)", padding: "24px 14px" }}>
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: RED }}>✦</div>
        <span className="font-bold text-base" style={{ color: DARK }}>ContentClaw</span>
      </div>
      {nav.map(item => {
        const on = active === item.id;
        return (
          <button key={item.id} onClick={() => setActive(item.id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all"
            style={{ background: on ? `${RED}12` : "transparent", color: on ? RED : `${DARK}70`, border: on ? `1px solid ${RED}25` : "1px solid transparent" }}>
            <span style={{ color: on ? RED : `${DARK}50` }}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
      {connected.length > 0 && (
        <div className="mt-auto pt-5" style={{ borderTop: "1.5px dashed rgba(0,0,0,0.07)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest px-2 mb-3" style={{ color: `${DARK}40` }}>Connected</p>
          <div className="flex flex-col gap-1.5">
            {connected.map(p => {
              const m = PLATFORM_META[p];
              return (
                <div key={p} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                  style={{ background: m.bg, border: `1px solid ${m.border}` }}>
                  {PLATFORM_ICONS[p]}
                  <span className="text-xs font-semibold truncate" style={{ color: m.color }}>{p}</span>
                  <span className="ml-auto w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#30D158", color: "white" }}><Ico.Check /></span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Mobile tabs ──────────────────────────────────────────────────────────────
function MobileTabs({ active, setActive }: { active: NavSection; setActive: (s: NavSection) => void }) {
  const tabs: { id: NavSection; label: string; icon: ReactElement }[] = [
    { id: "accounts", label: "Accounts", icon: <Ico.Grid />  },
    { id: "trends",   label: "Trends",   icon: <Ico.Trend /> },
    { id: "feed",     label: "Feed",     icon: <Ico.Feed />  },
    { id: "analytics",label: "Stats",    icon: <Ico.Bar />   },
  ];
  return (
    <nav className="flex md:hidden items-center justify-around shrink-0"
      style={{ borderTop: "1.5px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", paddingTop: 8, paddingBottom: "max(8px, env(safe-area-inset-bottom))" }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => setActive(t.id)}
            className="flex flex-col items-center gap-1 flex-1 transition-all"
            style={{ color: on ? RED : `${DARK}45` }}>
            <span className="flex items-center justify-center w-9 h-7 rounded-xl"
              style={{ background: on ? `${RED}12` : "transparent" }}>{t.icon}</span>
            <span className="text-[10px] font-semibold">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Section: Accounts ────────────────────────────────────────────────────────
function AccountsSection({ connected, onConnect, onDisconnect }: {
  connected: Platform[];
  onConnect: (p: Platform) => void;
  onDisconnect: (p: Platform) => void;
}) {
  const [confirm, setConfirm] = useState<Platform | null>(null);

  const handleDisconnect = (p: Platform) => {
    if (confirm === p) { onDisconnect(p); setConfirm(null); }
    else { setConfirm(p); setTimeout(() => setConfirm(null), 3000); }
  };

  const isReady = connected.includes("X.com") && connected.includes("TikTok");

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-1" style={{ color: DARK }}>Connected Accounts</h2>
        <p className="text-sm" style={{ color: `${DARK}55` }}>
          Connect X.com to scrape local trends, and TikTok to auto-post daily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {ALL_PLATFORMS.map(p => {
          const m = PLATFORM_META[p];
          const isOn = connected.includes(p);
          const isConfirm = confirm === p;
          return (
            <div key={p} className="flex flex-col gap-4 rounded-3xl p-6"
              style={{
                background: isOn ? m.bg : "rgba(255,255,255,0.9)",
                border: `1.5px solid ${isOn ? m.border : "rgba(0,0,0,0.07)"}`,
                boxShadow: isOn ? `0 4px 24px ${m.color}12` : "0 2px 12px rgba(0,0,0,0.04)",
              }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: isOn ? "rgba(255,255,255,0.7)" : m.bg, border: `1.5px solid ${m.border}` }}>
                    {p === "TikTok" ? <IcoTikTok s={24} /> : <IcoX s={24} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold" style={{ color: DARK }}>{p}</p>
                    <p className="text-xs" style={{ color: `${DARK}50` }}>{m.role}</p>
                  </div>
                </div>
                {isOn ? (
                  <button onClick={() => handleDisconnect(p)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all shrink-0"
                    style={isConfirm
                      ? { background: "#FF3B3015", color: "#FF3B30", border: "1px solid #FF3B3035" }
                      : { background: "rgba(0,0,0,0.06)", color: `${DARK}80`, border: "1px solid rgba(0,0,0,0.1)" }}>
                    <span className="w-3 h-3 rounded-full flex items-center justify-center"
                      style={{ background: "#30D158", color: "white" }}><Ico.Check /></span>
                    {isConfirm ? "Confirm?" : "Connected"}
                  </button>
                ) : (
                  <button onClick={() => onConnect(p)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl shrink-0"
                    style={{ background: m.color, color: "white", boxShadow: `0 4px 12px ${m.color}35` }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                    </svg>
                    Connect
                  </button>
                )}
              </div>
              {isOn && (
                <p className="text-xs font-semibold" style={{ color: m.color }}>{m.handle}</p>
              )}
              <p className="text-xs leading-relaxed" style={{ color: `${DARK}45` }}>
                {p === "X.com"
                  ? "ContentClaw reads your local X feed daily and picks the top-viewed posts to convert into TikTok scripts."
                  : "ContentClaw posts one AI-generated TikTok video per day at your audience's peak engagement hour."}
              </p>
            </div>
          );
        })}
      </div>

      {isReady ? (
        <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3"
          style={{ background: "rgba(48,209,88,0.08)", border: "1.5px solid rgba(48,209,88,0.3)" }}>
          <span className="text-base shrink-0 mt-0.5">✅</span>
          <p className="text-sm" style={{ color: "#1a7a36" }}>
            Both accounts connected. Go to <span className="font-semibold">Trends</span> to see today&apos;s scraped X content and your AI-generated TikTok script.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl px-4 py-3.5 flex items-start gap-3"
          style={{ background: `${YELLOW}18`, border: `1.5px solid ${YELLOW}55` }}>
          <span className="text-base shrink-0 mt-0.5">💡</span>
          <p className="text-sm" style={{ color: "#8B6F00" }}>
            Connect both X.com and TikTok to activate the daily auto-post pipeline.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Section: Trends ──────────────────────────────────────────────────────────
function TrendsSection({ connected, onPost }: {
  connected: Platform[];
  onPost: (content: string, xSource: string) => void;
}) {
  const [selected,  setSelected]  = useState<string | null>(null);
  const [posting,   setPosting]   = useState<string | null>(null);
  const [posted,    setPosted]    = useState<string | null>(null);

  const isReady = connected.includes("X.com") && connected.includes("TikTok");

  const handlePost = (trend: typeof MOCK_TRENDS[0]) => {
    if (!isReady || posting) return;
    setPosting(trend.id);
    setTimeout(() => {
      onPost(trend.script, trend.xPost);
      setPosting(null);
      setPosted(trend.id);
      setTimeout(() => setPosted(null), 4000);
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: DARK }}>Today&apos;s X Trends</h2>
          <p className="text-sm mt-0.5" style={{ color: `${DARK}55` }}>
            Local top-viewed X posts scraped this morning. AI script ready to post.
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
          style={{ background: isReady ? "rgba(48,209,88,0.1)" : `${YELLOW}20`, color: isReady ? "#1a7a36" : "#8B6F00", border: `1px solid ${isReady ? "rgba(48,209,88,0.3)" : `${YELLOW}60`}` }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
            style={{ background: isReady ? "#30D158" : YELLOW }} />
          {isReady ? "Auto-post active" : "Connect accounts first"}
        </span>
      </div>

      {!isReady && (
        <div className="rounded-2xl px-4 py-3.5 mb-5 flex items-start gap-3"
          style={{ background: `${YELLOW}18`, border: `1.5px solid ${YELLOW}55` }}>
          <span className="text-base shrink-0 mt-0.5">💡</span>
          <p className="text-sm" style={{ color: "#8B6F00" }}>
            Connect both X.com and TikTok in <span className="font-semibold">Accounts</span> to enable auto-posting.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_TRENDS.map(trend => {
          const isPosting = posting === trend.id;
          const isDone    = posted  === trend.id;

          return (
            <div key={trend.id} className="rounded-3xl overflow-hidden flex flex-col"
              style={{ background: "rgba(255,255,255,0.95)", border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

              {/* X source */}
              <div className="px-5 pt-5 pb-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.12)" }}>
                  <IcoX s={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: `${DARK}45` }}>{trend.region}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${RED}10`, color: RED }}>{trend.views} views</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: `${DARK}80` }}>{trend.xPost}</p>
                </div>
              </div>

              {/* AI Script */}
              <div className="flex-1 flex flex-col px-5 pb-5" style={{ borderTop: "1.5px solid rgba(0,0,0,0.06)" }}>
                <div className="pt-4 flex-1 flex flex-col">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 self-start"
                    style={{ background: `${YELLOW}25`, color: "#8B6F00" }}>
                    <Ico.Spark /> AI TikTok Script
                  </span>

                  <div className="rounded-2xl p-4 mb-4 flex-1"
                    style={{ background: "rgba(255,0,80,0.04)", border: "1.5px solid rgba(255,0,80,0.12)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <IcoTikTok s={16} />
                      <span className="text-xs font-bold" style={{ color: "#FF0050" }}>TikTok Caption</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: `${DARK}85` }}>{trend.script}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {trend.tags.map(t => (
                        <span key={t} className="text-xs font-medium" style={{ color: "#FF0050" }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => handlePost(trend)} disabled={!isReady || !!posting}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                    style={{
                      background: isDone ? "rgba(48,209,88,0.12)" : isReady ? RED : "rgba(0,0,0,0.06)",
                      color: isDone ? "#1a7a36" : isReady ? "white" : `${DARK}35`,
                      boxShadow: isReady && !isDone ? `0 4px 16px ${RED}35` : "none",
                      cursor: isReady && !posting ? "pointer" : "not-allowed",
                    }}>
                    {isDone ? (
                      <><Ico.Check /> Posted to TikTok!</>
                    ) : isPosting ? (
                      <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Posting…</>
                    ) : isReady ? (
                      <>Post to TikTok <Ico.Arrow /></>
                    ) : (
                      <>Connect accounts to post</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-4" style={{ color: `${DARK}35` }}>
        Trends are refreshed daily at 6 AM from your local X feed. Auto-post runs at your audience&apos;s peak hour.
      </p>
    </div>
  );
}

// ─── Section: Feed ────────────────────────────────────────────────────────────
function FeedSection({ posts }: { posts: Post[] }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-1" style={{ color: DARK }}>TikTok Feed</h2>
        <p className="text-sm" style={{ color: `${DARK}55` }}>
          {posts.length} post{posts.length !== 1 ? "s" : ""} published to TikTok.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center rounded-3xl"
          style={{ background: "rgba(255,255,255,0.9)", border: "1.5px dashed rgba(0,0,0,0.1)" }}>
          <div className="text-center py-14 px-8">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold" style={{ color: DARK }}>No posts yet</p>
            <p className="text-sm mt-1" style={{ color: `${DARK}50` }}>Go to Trends and post your first AI-generated TikTok.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="rounded-2xl p-4 flex flex-col"
              style={{ background: "rgba(255,255,255,0.95)", border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

              {/* Source X post */}
              <div className="flex items-start gap-2 mb-3 p-3 rounded-xl"
                style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <IcoX s={14} />
                <p className="text-xs leading-relaxed" style={{ color: `${DARK}60` }}>{post.xSource}</p>
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <IcoTikTok s={16} />
                  <span className="text-xs font-bold" style={{ color: "#FF0050" }}>TikTok</span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: "rgba(48,209,88,0.12)", color: "#1a7a36" }}>
                  Posted
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-2.5" style={{ color: `${DARK}80` }}>{post.content}</p>

              <div className="flex flex-wrap items-center justify-between gap-1.5 mt-auto pt-2">
                <span className="text-xs" style={{ color: `${DARK}40` }}>{post.timestamp}</span>
                {post.stats.views > 0 && (
                  <div className="flex gap-3">
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: "#FF0050" }}>
                      <Ico.Up /> {fmt(post.stats.views)} views
                    </span>
                    <span className="text-xs" style={{ color: `${DARK}45` }}>
                      {fmt(post.stats.likes)} likes
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Analytics ───────────────────────────────────────────────────────
function AnalyticsSection({ posts }: { posts: Post[] }) {
  const totalViews    = posts.reduce((a, p) => a + p.stats.views,    0);
  const totalLikes    = posts.reduce((a, p) => a + p.stats.likes,    0);
  const totalComments = posts.reduce((a, p) => a + p.stats.comments, 0);
  const totalShares   = posts.reduce((a, p) => a + p.stats.shares,   0);
  const engRate = totalViews > 0
    ? (((totalLikes + totalComments + totalShares) / totalViews) * 100).toFixed(1)
    : "0.0";

  const summary = [
    { label: "Total Views",    value: fmt(totalViews),    accent: RED    },
    { label: "Engagement",     value: `${engRate}%`,      accent: BLUE   },
    { label: "Total Shares",   value: fmt(totalShares),   accent: YELLOW },
    { label: "Posts",          value: String(posts.length), accent: RED  },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold mb-1" style={{ color: DARK }}>TikTok Analytics</h2>
        <p className="text-sm" style={{ color: `${DARK}55` }}>Performance of all AI-generated posts from local X trends.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {summary.map(m => (
          <div key={m.label} className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.9)", border: `1.5px solid ${m.accent}18`, boxShadow: `0 2px 12px ${m.accent}08` }}>
            <p className="text-[11px] font-medium mb-1.5" style={{ color: `${DARK}45` }}>{m.label}</p>
            <p className="text-xl sm:text-2xl font-extrabold" style={{ color: DARK }}>{m.value}</p>
            <div className="flex items-center gap-1 mt-1" style={{ color: m.accent }}>
              <Ico.Up /><span className="text-[10px] font-semibold">All time</span>
            </div>
          </div>
        ))}
      </div>

      {posts.length > 0 ? (
        <div className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.95)", border: "1.5px solid rgba(0,0,0,0.07)", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1.5px solid rgba(0,0,0,0.06)", background: "rgba(0,0,0,0.015)" }}>
            <p className="text-sm font-bold" style={{ color: DARK }}>Post Performance</p>
          </div>
          <div className="flex flex-col">
            {posts.map((post, i) => {
              const eng = post.stats.views > 0
                ? (((post.stats.likes + post.stats.comments) / post.stats.views) * 100).toFixed(1)
                : "0.0";
              return (
                <div key={post.id} className="px-5 py-4 flex items-start gap-3"
                  style={{ borderBottom: i < posts.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1 truncate" style={{ color: DARK }}>{post.content}</p>
                    <span className="text-[11px]" style={{ color: `${DARK}35` }}>{post.timestamp}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold" style={{ color: DARK }}>{fmt(post.stats.views)}</p>
                    <p className="text-[10px]" style={{ color: `${DARK}40` }}>views</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: parseFloat(eng) > 5 ? "#1a7a36" : BLUE }}>{eng}% eng.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl px-8 py-12 text-center"
          style={{ background: "rgba(255,255,255,0.9)", border: "1.5px dashed rgba(0,0,0,0.1)" }}>
          <div className="text-4xl mb-3">📊</div>
          <p className="font-semibold" style={{ color: DARK }}>No analytics yet</p>
          <p className="text-sm mt-1" style={{ color: `${DARK}50` }}>Post some TikToks from Trends to start seeing data.</p>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<NavSection>("accounts");
  const [connected,     setConnected]     = useState<Platform[]>([]);
  const [posts,         setPosts]         = useState<Post[]>([]);
  const [oauthPlatform, setOAuthPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    setConnected(loadConnected());
    setPosts(loadPosts());
  }, []);

  const handleConnect    = (p: Platform) => setOAuthPlatform(p);
  const handleOAuthDone  = () => {
    if (!oauthPlatform) return;
    const next = connected.includes(oauthPlatform) ? connected : [...connected, oauthPlatform];
    setConnected(next); saveConnected(next); setOAuthPlatform(null);
  };
  const handleDisconnect = (p: Platform) => {
    const next = connected.filter(c => c !== p);
    setConnected(next); saveConnected(next);
  };
  const handlePost = (content: string, xSource: string) => {
    const now = new Date();
    const ts  = now.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              + " · "
              + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const newPost: Post = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      content, xSource, timestamp: ts, status: "Posted", stats: genStat(),
    };
    const next = [newPost, ...posts];
    setPosts(next); savePosts(next);
    setActiveSection("feed");
  };

  return (
    <div className="flex flex-col"
      style={{ fontFamily: "var(--font-jakarta), -apple-system, sans-serif", background: "#f7f7f8", height: "100dvh", minHeight: "100vh" }}>

      {oauthPlatform && <OAuthModal platform={oauthPlatform} onDone={handleOAuthDone} />}

      <header className="flex items-center justify-between px-4 sm:px-6 shrink-0"
        style={{ height: 52, background: "rgba(255,255,255,0.97)", borderBottom: "1.5px solid rgba(0,0,0,0.07)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2 md:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: RED }}>✦</div>
            <span className="font-bold text-sm" style={{ color: DARK }}>ContentClaw</span>
          </a>
          <span className="hidden md:inline-block text-sm font-semibold" style={{ color: `${DARK}60` }}>Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: connected.length === 2 ? "rgba(48,209,88,0.1)" : `${YELLOW}18`,
              color:      connected.length === 2 ? "#1a7a36" : "#8B6F00",
              border:     `1px solid ${connected.length === 2 ? "rgba(48,209,88,0.35)" : `${YELLOW}50`}`,
            }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
              style={{ background: connected.length === 2 ? "#30D158" : YELLOW }} />
            <span className="hidden sm:inline">
              {connected.length === 2 ? "Auto-post active" : `${connected.length}/2 connected`}
            </span>
            <span className="sm:hidden">{connected.length}/2</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: RED }}>U</div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar active={activeSection} setActive={setActiveSection} connected={connected} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {activeSection === "accounts"  && <AccountsSection connected={connected} onConnect={handleConnect} onDisconnect={handleDisconnect} />}
          {activeSection === "trends"    && <TrendsSection   connected={connected} onPost={handlePost} />}
          {activeSection === "feed"      && <FeedSection     posts={posts} />}
          {activeSection === "analytics" && <AnalyticsSection posts={posts} />}
        </main>
      </div>

      <MobileTabs active={activeSection} setActive={setActiveSection} />
    </div>
  );
}
