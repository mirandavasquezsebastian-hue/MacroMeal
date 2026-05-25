import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronRight, ChevronLeft, Activity, Flame, Beef, Wheat, Droplet,
  Zap, Sparkles, Plus, Minus, Check, Clock, MapPin, Bike, ChefHat,
  Package, TrendingUp, Calendar, Award, BarChart3, User, ArrowRight,
  Star, Play, Menu, X, ArrowUpRight, Dumbbell, Target, Cpu, Layers,
  ArrowDown, Quote, ChevronDown
} from "lucide-react";

/* ============================================================
   MacroMeal — precision nutrition, delivered
   Aesthetic: graphite + lime, monospace data, lab-instrument feel
   ============================================================ */

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700;800;900&display=swap');
`;

const TOKENS = {
  bg: "#0A0A0B",
  surface: "#101012",
  surface2: "#16161A",
  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.12)",
  text: "#FAFAFA",
  textDim: "#8B8B92",
  textMute: "#555560",
  lime: "#C7F73E",
  limeDim: "#9BC42D",
  neon: "#E4FF52",
  protein: "#C7F73E",
  carbs: "#F5A623",
  fats: "#FF6B6B",
};

// ---------- shared atoms ----------

const Mono = ({ children, className = "", ...p }) => (
  <span className={`font-mono tracking-tight ${className}`} {...p}>{children}</span>
);

const Tag = ({ children, tone = "default", className = "" }) => {
  const tones = {
    default: "border-white/10 text-white/60 bg-white/[0.02]",
    lime: "border-lime-400/30 text-lime-300 bg-lime-400/10",
    warn: "border-orange-400/30 text-orange-300 bg-orange-400/10",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
};

const Btn = ({ children, variant = "primary", className = "", ...p }) => {
  const styles = {
    primary: "bg-lime-300 text-black hover:bg-lime-200 active:scale-[0.98]",
    ghost: "border border-white/10 text-white hover:bg-white/5 active:scale-[0.98]",
    dark: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
  };
  return (
    <button
      className={`relative rounded-full px-5 py-3 font-medium text-sm transition-all duration-200 ${styles[variant]} ${className}`}
      {...p}
    >
      {children}
    </button>
  );
};

// Animated progress ring
const Ring = ({ value, max, color, size = 120, stroke = 8, label, unit, sub }) => {
  const pct = Math.min(value / max, 1);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(offset), 100);
    return () => clearTimeout(t);
  }, [offset]);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={animated}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)", filter: `drop-shadow(0 0 8px ${color}55)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">{label}</div>
        <div className="font-semibold text-2xl text-white mt-0.5 tabular-nums">{value}<span className="text-white/30 text-sm">/{max}{unit}</span></div>
        {sub && <div className="font-mono text-[10px] text-white/30 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
};

// Macro bar
const MacroBar = ({ label, value, target, color, unit = "g" }) => {
  const pct = Math.min((value / target) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className="text-xs uppercase tracking-wider text-white/60 font-medium">{label}</span>
        </div>
        <Mono className="text-sm text-white tabular-nums">
          {value}<span className="text-white/30">/{target}{unit}</span>
        </Mono>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 12px ${color}66` }}
        />
      </div>
    </div>
  );
};

// Phone frame
const Phone = ({ children, title }) => (
  <div className="relative mx-auto" style={{ width: 380 }}>
    <div className="absolute -inset-3 bg-gradient-to-br from-lime-300/10 via-transparent to-orange-400/5 rounded-[3rem] blur-2xl opacity-60" />
    <div className="relative rounded-[2.5rem] bg-gradient-to-b from-zinc-900 to-black p-2 border border-white/10 shadow-2xl">
      <div className="rounded-[2.1rem] bg-[#0A0A0B] overflow-hidden border border-white/5" style={{ height: 780 }}>
        <div className="h-full overflow-y-auto scrollbar-hide flex flex-col">
          {/* status bar */}
          <div className="flex items-center justify-between px-7 pt-3.5 pb-2 text-[11px] font-mono text-white/80">
            <span className="tabular-nums">9:41</span>
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-6 bg-black rounded-full" />
            <div className="flex items-center gap-1">
              <div className="w-3 h-1.5 border border-white/60 rounded-sm relative">
                <div className="absolute inset-0.5 bg-white/80 rounded-[1px]" />
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
    {title && (
      <div className="mt-6 text-center">
        <Mono className="text-[10px] uppercase tracking-[0.2em] text-white/30">{title}</Mono>
      </div>
    )}
  </div>
);

// ---------- SCREEN 1: ONBOARDING ----------

function Onboarding() {
  const [step, setStep] = useState(0);
  const [weight, setWeight] = useState(72);
  const [height, setHeight] = useState(178);
  const [goal, setGoal] = useState("cut");
  const [cals, setCals] = useState(2400);
  const [protein, setProtein] = useState(180);
  const [carbs, setCarbs] = useState(240);
  const [fats, setFats] = useState(75);

  const steps = ["Body", "Goal", "Calories", "Macros"];
  const goals = [
    { id: "cut", label: "Cut", desc: "Lose fat, keep muscle", icon: Flame },
    { id: "maintain", label: "Maintain", desc: "Hold current physique", icon: Activity },
    { id: "bulk", label: "Bulk", desc: "Build lean mass", icon: Dumbbell },
  ];

  return (
    <Phone title="01 — onboarding">
      <div className="px-6 pt-2 pb-4">
        {/* progress stepper */}
        <div className="flex items-center gap-1.5 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-0.5 rounded-full transition-all duration-500 ${i <= step ? "bg-lime-300" : "bg-white/10"}`} />
              <div className={`mt-2 text-[10px] font-mono uppercase tracking-wider transition-colors ${i === step ? "text-lime-300" : i < step ? "text-white/60" : "text-white/30"}`}>
                {String(i+1).padStart(2,"0")} {s}
              </div>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-7 animate-in fade-in duration-500">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300/70 mb-2">step.01</div>
              <h2 className="text-3xl font-medium text-white leading-tight" style={{fontFamily:"Geist"}}>Your <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>baseline</span>.</h2>
              <p className="text-sm text-white/50 mt-2">Two measurements. We&apos;ll do the rest.</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xs uppercase tracking-wider text-white/50">Weight</span>
                  <Mono className="text-2xl text-white tabular-nums">{weight}<span className="text-white/30 text-sm ml-1">kg</span></Mono>
                </div>
                <input type="range" min="40" max="140" value={weight} onChange={e=>setWeight(+e.target.value)} className="mm-slider" />
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xs uppercase tracking-wider text-white/50">Height</span>
                  <Mono className="text-2xl text-white tabular-nums">{height}<span className="text-white/30 text-sm ml-1">cm</span></Mono>
                </div>
                <input type="range" min="140" max="210" value={height} onChange={e=>setHeight(+e.target.value)} className="mm-slider" />
              </div>
            </div>

            {/* readout */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-white/40">BMI calculated</div>
                <Mono className="text-xl text-white mt-0.5">{(weight / Math.pow(height/100, 2)).toFixed(1)}</Mono>
              </div>
              <Tag tone="lime">athletic range</Tag>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-500">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300/70 mb-2">step.02</div>
              <h2 className="text-3xl font-medium text-white leading-tight" style={{fontFamily:"Geist"}}>What are you <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>chasing</span>?</h2>
            </div>
            <div className="space-y-3">
              {goals.map(g => {
                const Icon = g.icon;
                const active = goal === g.id;
                return (
                  <button key={g.id} onClick={()=>setGoal(g.id)}
                    className={`w-full text-left rounded-2xl border p-4 flex items-center gap-4 transition-all ${active ? "border-lime-300/50 bg-lime-300/5" : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active ? "bg-lime-300 text-black" : "bg-white/5 text-white/70"}`}>
                      <Icon size={20} strokeWidth={2}/>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{g.label}</div>
                      <div className="text-xs text-white/40">{g.desc}</div>
                    </div>
                    {active && <Check size={18} className="text-lime-300"/>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-7 animate-in fade-in duration-500">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300/70 mb-2">step.03</div>
              <h2 className="text-3xl font-medium text-white leading-tight" style={{fontFamily:"Geist"}}>Daily <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>energy</span>.</h2>
              <p className="text-sm text-white/50 mt-2">Recommended for your goal: <Mono className="text-lime-300">2,380 kcal</Mono></p>
            </div>
            <div className="flex items-baseline justify-center gap-2 py-6">
              <Mono className="text-7xl text-white tabular-nums font-medium">{cals}</Mono>
              <Mono className="text-white/40 text-lg">kcal</Mono>
            </div>
            <input type="range" min="1500" max="3500" step="50" value={cals} onChange={e=>setCals(+e.target.value)} className="mm-slider" />
            <div className="grid grid-cols-3 gap-2">
              {[2000, 2400, 2800].map(v => (
                <button key={v} onClick={()=>setCals(v)} className={`rounded-xl py-2.5 font-mono text-xs border transition-all ${cals===v?"border-lime-300/50 bg-lime-300/10 text-lime-300":"border-white/8 text-white/60 hover:bg-white/5"}`}>{v}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-500">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300/70 mb-2">step.04</div>
              <h2 className="text-3xl font-medium text-white leading-tight" style={{fontFamily:"Geist"}}>Split your <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>macros</span>.</h2>
            </div>

            <div className="space-y-5">
              {[
                {label:"Protein", value:protein, set:setProtein, max:300, color:TOKENS.protein, kcal:protein*4},
                {label:"Carbs", value:carbs, set:setCarbs, max:500, color:TOKENS.carbs, kcal:carbs*4},
                {label:"Fats", value:fats, set:setFats, max:150, color:TOKENS.fats, kcal:fats*9},
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{background:m.color}}/>
                      <span className="text-xs uppercase tracking-wider text-white/60 font-medium">{m.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <Mono className="text-lg text-white tabular-nums">{m.value}g</Mono>
                      <Mono className="text-[10px] text-white/30">≈ {m.kcal} kcal</Mono>
                    </div>
                  </div>
                  <input type="range" min="20" max={m.max} value={m.value} onChange={e=>m.set(+e.target.value)} className="mm-slider"
                    style={{"--accent": m.color}}/>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-lime-300/20 bg-gradient-to-br from-lime-300/[0.08] to-transparent p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={12} className="text-lime-300"/>
                <Mono className="text-[10px] uppercase tracking-wider text-lime-300">profile complete</Mono>
              </div>
              <div className="text-sm text-white/80">Total: <Mono className="text-white">{protein*4 + carbs*4 + fats*9}</Mono> kcal · <Mono>{Math.round(protein*4/cals*100)}P</Mono>/<Mono>{Math.round(carbs*4/cals*100)}C</Mono>/<Mono>{Math.round(fats*9/cals*100)}F</Mono></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto px-6 pb-8 pt-4 flex gap-3 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B] to-transparent">
        {step > 0 && (
          <Btn variant="ghost" onClick={()=>setStep(step-1)} className="!px-4">
            <ChevronLeft size={18}/>
          </Btn>
        )}
        <Btn className="flex-1 flex items-center justify-center gap-2" onClick={()=>setStep(Math.min(3, step+1))}>
          {step === 3 ? "Enter MacroMeal" : "Continue"} <ArrowRight size={16}/>
        </Btn>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 2: HOME DASHBOARD ----------

function Dashboard() {
  const data = {
    cals: { v: 1620, t: 2400 },
    p: { v: 142, t: 180 },
    c: { v: 188, t: 240 },
    f: { v: 48, t: 75 },
  };

  return (
    <Phone title="02 — home dashboard">
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Mono className="text-[10px] uppercase tracking-[0.2em] text-white/40">tue · 14:22</Mono>
              <div className="w-1 h-1 rounded-full bg-lime-300 animate-pulse"/>
              <Mono className="text-[10px] uppercase tracking-[0.2em] text-lime-300">live</Mono>
            </div>
            <h1 className="text-2xl font-medium text-white mt-1" style={{fontFamily:"Geist"}}>
              Hola, <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>Sebastian</span>
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-300 to-orange-300 p-[2px]">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs font-mono text-white">SK</div>
          </div>
        </div>

        {/* hero ring — calories */}
        <div className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] via-white/[0.01] to-transparent p-6 mb-4 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-lime-300/10 rounded-full blur-3xl"/>
          <div className="flex items-center gap-5">
            <Ring value={data.cals.v} max={data.cals.t} color={TOKENS.lime} size={130} stroke={9} label="kcal" sub={`${data.cals.t - data.cals.v} left`}/>
            <div className="flex-1 space-y-1">
              <Mono className="text-[10px] uppercase tracking-wider text-white/40">today.budget</Mono>
              <div className="text-3xl font-medium text-white tabular-nums" style={{fontFamily:"Geist"}}>{data.cals.t - data.cals.v}</div>
              <div className="text-xs text-white/50">kcal remaining</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-lime-300">
                <TrendingUp size={11}/> <Mono>+12% vs avg</Mono>
              </div>
            </div>
          </div>
        </div>

        {/* macro bars */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-5 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <Mono className="text-[10px] uppercase tracking-wider text-white/40">macro.split</Mono>
            <Tag>real-time</Tag>
          </div>
          <MacroBar label="Protein" value={data.p.v} target={data.p.t} color={TOKENS.protein}/>
          <MacroBar label="Carbs" value={data.c.v} target={data.c.t} color={TOKENS.carbs}/>
          <MacroBar label="Fats" value={data.f.v} target={data.f.t} color={TOKENS.fats}/>
        </div>

        {/* smart recommendation card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-lime-300/15 via-lime-300/5 to-transparent border border-lime-300/20 p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime-300/20 rounded-full blur-3xl"/>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-lime-300 flex items-center justify-center">
                <Cpu size={12} className="text-black"/>
              </div>
              <Mono className="text-[10px] uppercase tracking-wider text-lime-300">macromeal.ai</Mono>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-lime-300 animate-pulse"/>
                <Mono className="text-[9px] text-lime-300/70">analyzing</Mono>
              </div>
            </div>
            <p className="text-white text-[15px] leading-snug mb-1">
              You still need <Mono className="text-lime-300">38g protein</Mono> and <Mono className="text-lime-300">52g carbs</Mono> today.
            </p>
            <p className="text-xs text-white/40 mb-4">Best window: next 2h post-workout.</p>
            <Btn className="w-full flex items-center justify-center gap-2">
              <Sparkles size={14}/> Complete my macros
            </Btn>
          </div>
        </div>

        {/* mini stats */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            { l: "Streak", v: "14", u: "days", c: TOKENS.lime },
            { l: "Adherence", v: "94", u: "%", c: TOKENS.protein },
            { l: "Orders", v: "3", u: "today", c: TOKENS.carbs },
          ].map(s => (
            <div key={s.l} className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
              <Mono className="text-[9px] uppercase tracking-wider text-white/40">{s.l}</Mono>
              <div className="mt-1 flex items-baseline gap-1">
                <Mono className="text-xl text-white tabular-nums" style={{color:s.c}}>{s.v}</Mono>
                <Mono className="text-[10px] text-white/40">{s.u}</Mono>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bottom nav */}
      <div className="mt-auto sticky bottom-0 px-6 pb-5 pt-3 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/95 to-transparent">
        <div className="flex items-center justify-around rounded-full border border-white/10 bg-white/5 backdrop-blur-xl py-2.5 px-3">
          {[Activity, Sparkles, ChefHat, BarChart3, User].map((Icon, i) => (
            <button key={i} className={`p-2.5 rounded-full transition-all ${i===0 ? "bg-lime-300 text-black" : "text-white/40 hover:text-white"}`}>
              <Icon size={18}/>
            </button>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 3: SMART AUTO MODE ----------

function SmartAuto() {
  const need = { p: 40, c: 50, f: 10 };
  const meals = [
    {
      name: "Grilled Chicken · Jasmine Rice",
      tag: "Optimized for your goals today",
      tagTone: "lime",
      p: 42, c: 52, f: 9,
      kcal: 457, price: 18.40,
      confidence: 98,
      best: "Best post-workout",
    },
    {
      name: "Lomo Saltado · Quinoa Bowl",
      tag: "Highest protein density",
      p: 38, c: 48, f: 12,
      kcal: 452, price: 21.20,
      confidence: 91,
    },
  ];

  return (
    <Phone title="03 — smart auto">
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-5">
          <button className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70">
            <ChevronLeft size={18}/>
          </button>
          <Mono className="text-[10px] uppercase tracking-[0.2em] text-white/40">auto.mode</Mono>
          <div className="w-9"/>
        </div>

        {/* hero */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-300/30 bg-lime-300/5 mb-4">
            <Cpu size={11} className="text-lime-300"/>
            <Mono className="text-[10px] uppercase tracking-wider text-lime-300">AI · analyzing your gap</Mono>
          </div>
          <h2 className="text-2xl font-medium text-white leading-tight" style={{fontFamily:"Geist"}}>
            Meals that <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>complete</span> your day.
          </h2>
        </div>

        {/* gap analysis */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <Mono className="text-[10px] uppercase tracking-wider text-white/40">remaining.macros</Mono>
            <Mono className="text-[10px] text-white/40">target.match</Mono>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { k:"Protein", v:need.p, c:TOKENS.protein},
              { k:"Carbs", v:need.c, c:TOKENS.carbs},
              { k:"Fats", v:need.f, c:TOKENS.fats},
            ].map(x => (
              <div key={x.k} className="rounded-2xl border border-white/5 bg-black/40 p-3 text-center">
                <Mono className="text-[9px] uppercase tracking-wider text-white/40">{x.k}</Mono>
                <div className="mt-1 flex items-baseline justify-center gap-0.5">
                  <Mono className="text-2xl tabular-nums" style={{color:x.c}}>{x.v}</Mono>
                  <Mono className="text-[10px] text-white/30">g</Mono>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* meal cards */}
        <div className="space-y-3">
          {meals.map((m, i) => (
            <div key={i} className={`relative rounded-3xl overflow-hidden border transition-all ${i===0 ? "border-lime-300/30 bg-gradient-to-br from-lime-300/[0.08] to-transparent" : "border-white/8 bg-white/[0.02]"}`}>
              {i === 0 && (
                <div className="absolute top-0 right-0 w-40 h-40 bg-lime-300/15 rounded-full blur-3xl"/>
              )}
              <div className="relative p-5">
                <div className="flex items-start justify-between mb-3">
                  <Tag tone={i===0 ? "lime" : "default"}>
                    {i===0 && <Sparkles size={10}/>}
                    {m.tag}
                  </Tag>
                  <div className="flex flex-col items-end">
                    <Mono className="text-[9px] uppercase tracking-wider text-white/40">match</Mono>
                    <Mono className="text-xs text-lime-300">{m.confidence}%</Mono>
                  </div>
                </div>

                <h3 className="text-white font-medium text-[15px] leading-tight mb-1">{m.name}</h3>
                {m.best && (
                  <div className="text-[11px] text-lime-300/80 flex items-center gap-1 mb-3">
                    <Zap size={10}/> {m.best}
                  </div>
                )}

                {/* macro breakdown */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    {l:"P", v:m.p, c:TOKENS.protein, u:"g"},
                    {l:"C", v:m.c, c:TOKENS.carbs, u:"g"},
                    {l:"F", v:m.f, c:TOKENS.fats, u:"g"},
                    {l:"kcal", v:m.kcal, c:"#FFF", u:""},
                  ].map(x => (
                    <div key={x.l} className="rounded-xl border border-white/5 bg-black/30 p-2 text-center">
                      <Mono className="text-[9px] text-white/40">{x.l}</Mono>
                      <Mono className="block text-sm font-medium tabular-nums" style={{color:x.c}}>{x.v}{x.u}</Mono>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div>
                    <Mono className="text-[9px] uppercase tracking-wider text-white/40">dynamic.price</Mono>
                    <div className="flex items-baseline gap-1">
                      <Mono className="text-xl text-white tabular-nums">S/{m.price.toFixed(2)}</Mono>
                    </div>
                  </div>
                  <Btn variant={i===0 ? "primary" : "ghost"} className="!py-2.5 !px-4 text-xs">
                    Order <ArrowRight size={14} className="inline ml-1"/>
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full text-center text-xs text-white/40 hover:text-white py-2 font-mono">
          regenerate suggestions ↻
        </button>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 4: BUILD YOUR OWN ----------

function Builder() {
  const ingredients = {
    protein: [
      { id: "ch", name: "Chicken breast", p: 31, c: 0, f: 3.6, kcal: 165, price: 0.18, unit: 100 },
      { id: "sa", name: "Salmon", p: 22, c: 0, f: 13, kcal: 208, price: 0.32, unit: 100 },
      { id: "tof", name: "Tofu", p: 8, c: 2, f: 4, kcal: 76, price: 0.10, unit: 100 },
    ],
    carbs: [
      { id: "ri", name: "Jasmine rice", p: 2.7, c: 28, f: 0.3, kcal: 130, price: 0.04, unit: 100 },
      { id: "qu", name: "Quinoa", p: 4.4, c: 21, f: 1.9, kcal: 120, price: 0.09, unit: 100 },
      { id: "sw", name: "Sweet potato", p: 1.6, c: 20, f: 0.1, kcal: 86, price: 0.05, unit: 100 },
    ],
    fats: [
      { id: "av", name: "Avocado", p: 2, c: 9, f: 15, kcal: 160, price: 0.12, unit: 100 },
      { id: "ol", name: "Olive oil", p: 0, c: 0, f: 14, kcal: 119, price: 0.06, unit: 15 },
    ],
  };

  const [sel, setSel] = useState({ ch: 150, ri: 200, av: 50 });
  const [tab, setTab] = useState("protein");

  const all = [...ingredients.protein, ...ingredients.carbs, ...ingredients.fats];
  const tot = useMemo(() => {
    let p=0,c=0,f=0,k=0,price=0;
    Object.entries(sel).forEach(([id, g]) => {
      const ing = all.find(a=>a.id===id);
      if (!ing) return;
      const m = g / ing.unit;
      p += ing.p * m;
      c += ing.c * m;
      f += ing.f * m;
      k += ing.kcal * m;
      price += ing.price * g;
    });
    return { p, c, f, k, price };
  }, [sel]);

  const update = (id, delta) => {
    setSel(s => {
      const cur = s[id] || 0;
      const next = Math.max(0, cur + delta);
      const out = { ...s };
      if (next === 0) delete out[id]; else out[id] = next;
      return out;
    });
  };

  return (
    <Phone title="04 — build your own">
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-5">
          <button className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70">
            <ChevronLeft size={18}/>
          </button>
          <Mono className="text-[10px] uppercase tracking-[0.2em] text-white/40">build.mode</Mono>
          <div className="w-9"/>
        </div>

        <h2 className="text-2xl font-medium text-white leading-tight mb-1" style={{fontFamily:"Geist"}}>
          Compose your <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>plate</span>.
        </h2>
        <p className="text-xs text-white/40 mb-5">Live macros · Live price · Per gram.</p>

        {/* tabs */}
        <div className="flex gap-1 p-1 rounded-full border border-white/8 bg-white/[0.02] mb-4">
          {[
            {k:"protein", l:"Protein", icon:Beef},
            {k:"carbs", l:"Carbs", icon:Wheat},
            {k:"fats", l:"Fats", icon:Droplet},
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.k} onClick={()=>setTab(t.k)} className={`flex-1 py-2 rounded-full flex items-center justify-center gap-1.5 text-xs font-medium transition-all ${tab===t.k ? "bg-lime-300 text-black" : "text-white/60"}`}>
                <Icon size={12}/> {t.l}
              </button>
            );
          })}
        </div>

        {/* ingredients */}
        <div className="space-y-2 mb-4">
          {ingredients[tab].map(ing => {
            const qty = sel[ing.id] || 0;
            const active = qty > 0;
            return (
              <div key={ing.id} className={`rounded-2xl border p-3 transition-all ${active ? "border-lime-300/30 bg-lime-300/[0.04]" : "border-white/8 bg-white/[0.02]"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium">{ing.name}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-white/40 font-mono">
                      <span>{ing.p}P</span>·<span>{ing.c}C</span>·<span>{ing.f}F</span>·<span className="text-lime-300/80">S/{ing.price.toFixed(2)}/g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button onClick={()=>update(ing.id, -25)} className="w-7 h-7 rounded-full border border-white/10 text-white/70 flex items-center justify-center hover:bg-white/5">
                      <Minus size={12}/>
                    </button>
                    <Mono className="w-12 text-center text-sm text-white tabular-nums">{qty}g</Mono>
                    <button onClick={()=>update(ing.id, 25)} className="w-7 h-7 rounded-full bg-lime-300 text-black flex items-center justify-center">
                      <Plus size={12}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* sticky summary */}
      <div className="mt-auto sticky bottom-0 px-5 pb-5 pt-4">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 to-black p-5 shadow-2xl">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              {l:"P", v:tot.p.toFixed(0), c:TOKENS.protein, u:"g"},
              {l:"C", v:tot.c.toFixed(0), c:TOKENS.carbs, u:"g"},
              {l:"F", v:tot.f.toFixed(0), c:TOKENS.fats, u:"g"},
              {l:"kcal", v:tot.k.toFixed(0), c:"#FFF", u:""},
            ].map(x => (
              <div key={x.l} className="text-center">
                <Mono className="text-[9px] text-white/40">{x.l}</Mono>
                <div className="mt-0.5 tabular-nums" style={{color:x.c, fontFamily:"JetBrains Mono"}}>
                  <span className="text-base font-medium">{x.v}</span><span className="text-[10px] opacity-50 ml-0.5">{x.u}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Mono className="text-[9px] uppercase tracking-wider text-white/40">total.dynamic</Mono>
              <div className="flex items-baseline gap-1">
                <Mono className="text-2xl text-white tabular-nums">S/{tot.price.toFixed(2)}</Mono>
              </div>
            </div>
            <Btn className="flex items-center gap-2">
              Add to order <ArrowRight size={14}/>
            </Btn>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 5: PRICING ENGINE ----------

function Pricing() {
  const [p, setP] = useState(40);
  const [c, setC] = useState(60);
  const [f, setF] = useState(15);
  const rates = { p: 0.18, c: 0.04, f: 0.22 };
  const total = p*rates.p + c*rates.c + f*rates.f;
  const kcal = p*4 + c*4 + f*9;

  return (
    <Phone title="05 — pricing engine">
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-5">
          <button className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70">
            <ChevronLeft size={18}/>
          </button>
          <Mono className="text-[10px] uppercase tracking-[0.2em] text-white/40">pricing.engine</Mono>
          <div className="w-9"/>
        </div>

        <div className="mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime-300/70 mb-2">how it works</div>
          <h2 className="text-2xl font-medium text-white leading-tight" style={{fontFamily:"Geist"}}>
            You pay <span style={{fontFamily:"Instrument Serif",fontStyle:"italic"}}>per gram</span>.<br/>Not per plate.
          </h2>
        </div>

        {/* per-gram rate cards */}
        <div className="space-y-2 mb-5">
          {[
            { l: "Protein", v: rates.p, c: TOKENS.protein, src:"chicken · fish · tofu · whey"},
            { l: "Carbs", v: rates.c, c: TOKENS.carbs, src:"rice · quinoa · oats · sweet potato"},
            { l: "Fats", v: rates.f, c: TOKENS.fats, src:"avocado · olive oil · nuts"},
          ].map(r => (
            <div key={r.l} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:`${r.c}22`, border:`1px solid ${r.c}55`}}>
                  <Mono className="text-xs font-bold" style={{color:r.c}}>{r.l[0]}</Mono>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{r.l}</div>
                  <div className="text-[10px] text-white/40">{r.src}</div>
                </div>
              </div>
              <div className="text-right">
                <Mono className="text-base text-white tabular-nums">S/{r.v.toFixed(2)}</Mono>
                <Mono className="block text-[9px] text-white/40 -mt-0.5">per gram</Mono>
              </div>
            </div>
          ))}
        </div>

        {/* interactive calculator */}
        <div className="rounded-3xl border border-lime-300/20 bg-gradient-to-br from-lime-300/[0.06] to-transparent p-5">
          <div className="flex items-center justify-between mb-4">
            <Mono className="text-[10px] uppercase tracking-wider text-lime-300">live.calculator</Mono>
            <Tag tone="lime">drag to test</Tag>
          </div>

          <div className="space-y-4 mb-5">
            {[
              {l:"Protein (g)", v:p, set:setP, max:80, c:TOKENS.protein, r:rates.p},
              {l:"Carbs (g)", v:c, set:setC, max:120, c:TOKENS.carbs, r:rates.c},
              {l:"Fats (g)", v:f, set:setF, max:40, c:TOKENS.fats, r:rates.f},
            ].map(m => (
              <div key={m.l}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[11px] text-white/60">{m.l}</span>
                  <Mono className="text-xs tabular-nums" style={{color:m.c}}>
                    {m.v}g × S/{m.r} = <span className="text-white">S/{(m.v*m.r).toFixed(2)}</span>
                  </Mono>
                </div>
                <input type="range" min="0" max={m.max} value={m.v} onChange={e=>m.set(+e.target.value)} className="mm-slider" style={{"--accent":m.c}}/>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4 flex items-end justify-between">
            <div>
              <Mono className="text-[10px] uppercase tracking-wider text-white/40">total · {kcal}kcal</Mono>
              <Mono className="block text-4xl text-lime-300 tabular-nums mt-1">S/{total.toFixed(2)}</Mono>
            </div>
            <div className="text-right">
              <Mono className="text-[10px] uppercase tracking-wider text-white/40">/ kcal</Mono>
              <Mono className="block text-sm text-white/70 tabular-nums">S/{(total/kcal).toFixed(3)}</Mono>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[11px] text-white/40 leading-relaxed">
          <Mono className="text-white/60">No markup on meals.</Mono> You pay the exact macro composition you ordered. Transparent. Auditable.
        </div>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 6: ORDER TRACKING ----------

function Tracking() {
  const [stage, setStage] = useState(2);
  useEffect(() => {
    const t = setTimeout(() => setStage(s => Math.min(3, s+1)), 3500);
    return () => clearTimeout(t);
  }, [stage]);

  const stages = [
    { k:"cooking", l:"Cooking", icon:ChefHat },
    { k:"prep", l:"Preparing", icon:Package },
    { k:"way", l:"On the way", icon:Bike },
    { k:"done", l:"Delivered", icon:Check },
  ];

  return (
    <Phone title="06 — order tracking">
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-5">
          <button className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70">
            <ChevronLeft size={18}/>
          </button>
          <Mono className="text-[10px] uppercase tracking-[0.2em] text-white/40">order · #MM-2847</Mono>
          <div className="w-9"/>
        </div>

        {/* ETA hero */}
        <div className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6 mb-4 overflow-hidden">
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-lime-300/15 rounded-full blur-3xl"/>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse"/>
              <Mono className="text-[10px] uppercase tracking-wider text-lime-300">on.the.way</Mono>
            </div>
            <Mono className="text-[10px] uppercase tracking-wider text-white/40">eta</Mono>
            <div className="flex items-baseline gap-2 mt-0.5">
              <Mono className="text-5xl text-white tabular-nums font-medium">12</Mono>
              <Mono className="text-white/40">min</Mono>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-white/50">
              <MapPin size={12}/> Av. La Mar 1232, Miraflores
            </div>
          </div>
        </div>

        {/* stage stepper */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="space-y-4">
            {stages.map((s, i) => {
              const Icon = s.icon;
              const done = i < stage;
              const active = i === stage;
              return (
                <div key={s.k} className="flex items-center gap-3 relative">
                  {i < stages.length-1 && (
                    <div className={`absolute left-[19px] top-10 w-px h-6 ${done ? "bg-lime-300" : "bg-white/10"}`}/>
                  )}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${done ? "bg-lime-300 text-black" : active ? "bg-lime-300/20 text-lime-300 ring-2 ring-lime-300" : "bg-white/5 text-white/30"}`}>
                    {active && <div className="absolute inset-0 rounded-full bg-lime-300/30 animate-ping"/>}
                    <Icon size={16} className="relative"/>
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${done || active ? "text-white" : "text-white/30"}`}>{s.l}</div>
                    <Mono className={`text-[10px] ${active ? "text-lime-300" : "text-white/30"}`}>
                      {done ? "✓ complete" : active ? "in progress" : "pending"}
                    </Mono>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* courier */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4 flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-lime-300 p-[2px]">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs font-mono text-white">DC</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-white font-medium">Diego C.</div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono">
              <Bike size={11}/> Courier · ★ 4.97
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-lime-300 text-black flex items-center justify-center text-xs font-bold">
            ☎
          </button>
        </div>

        {/* macro summary */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <Mono className="text-[10px] uppercase tracking-wider text-white/40">order.macros</Mono>
            <Mono className="text-xs text-white/60">S/ 24.80</Mono>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              {l:"P", v:"42", c:TOKENS.protein},
              {l:"C", v:"58", c:TOKENS.carbs},
              {l:"F", v:"12", c:TOKENS.fats},
              {l:"kcal", v:"508", c:"#FFF"},
            ].map(x => (
              <div key={x.l} className="rounded-xl border border-white/5 bg-black/30 p-2 text-center">
                <Mono className="text-[9px] text-white/40">{x.l}</Mono>
                <Mono className="block text-sm font-medium tabular-nums" style={{color:x.c}}>{x.v}</Mono>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ---------- SCREEN 7: PROFILE & ANALYTICS ----------

function Analytics() {
  // weekly bars
  const weekly = [
    { d:"M", p:92, c:88 },
    { d:"T", p:96, c:91 },
    { d:"W", p:78, c:82 },
    { d:"T", p:88, c:90 },
    { d:"F", p:94, c:87 },
    { d:"S", p:71, c:74 },
    { d:"S", p:85, c:80 },
  ];

  // 5x7 heatmap (last 5 weeks)
  const heat = Array.from({length:35}, () => Math.random());

  return (
    <Phone title="07 — analytics">
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <Mono className="text-[10px] uppercase tracking-[0.2em] text-white/40">profile</Mono>
            <h2 className="text-xl font-medium text-white" style={{fontFamily:"Geist"}}>
              Sebastian <span style={{fontFamily:"Instrument Serif",fontStyle:"italic", color:TOKENS.lime}}>Kim</span>
            </h2>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-lime-300 to-orange-300 p-[2px]">
            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs font-mono text-white">SK</div>
          </div>
        </div>

        {/* top KPIs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-1">
              <Mono className="text-[10px] uppercase tracking-wider text-white/40">best.streak</Mono>
              <Award size={12} className="text-lime-300"/>
            </div>
            <Mono className="text-3xl text-white tabular-nums">23<span className="text-white/30 text-sm ml-1">d</span></Mono>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between mb-1">
              <Mono className="text-[10px] uppercase tracking-wider text-white/40">adherence</Mono>
              <Target size={12} className="text-lime-300"/>
            </div>
            <Mono className="text-3xl tabular-nums" style={{color:TOKENS.lime}}>94<span className="text-white/30 text-sm ml-1">%</span></Mono>
          </div>
        </div>

        {/* weekly chart */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <Mono className="text-[10px] uppercase tracking-wider text-white/40">weekly.consistency</Mono>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{background:TOKENS.protein}}/><span className="text-white/60">P</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{background:TOKENS.carbs}}/><span className="text-white/60">C</span></div>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekly.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end h-24">
                  <div className="flex-1 rounded-sm transition-all" style={{ height:`${w.p}%`, background:TOKENS.protein, opacity: 0.85 }}/>
                  <div className="flex-1 rounded-sm transition-all" style={{ height:`${w.c}%`, background:TOKENS.carbs, opacity: 0.85 }}/>
                </div>
                <Mono className="text-[9px] text-white/40">{w.d}</Mono>
              </div>
            ))}
          </div>
        </div>

        {/* heatmap */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <Mono className="text-[10px] uppercase tracking-wider text-white/40">calorie.adherence · 5w</Mono>
            <Mono className="text-[10px] text-white/40">less ─ more</Mono>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {heat.map((v, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{
                background: v > 0.7 ? TOKENS.lime : v > 0.4 ? `${TOKENS.lime}66` : v > 0.2 ? `${TOKENS.lime}22` : "rgba(255,255,255,0.04)"
              }}/>
            ))}
          </div>
        </div>

        {/* body progress */}
        <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-3">
            <Mono className="text-[10px] uppercase tracking-wider text-white/40">body.progress · 8w</Mono>
            <div className="flex items-center gap-1 text-[11px] text-lime-300">
              <TrendingUp size={11}/> <Mono>−2.1kg</Mono>
            </div>
          </div>
          <svg viewBox="0 0 300 80" className="w-full h-20">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TOKENS.lime} stopOpacity="0.4"/>
                <stop offset="100%" stopColor={TOKENS.lime} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 0,30 L 40,28 L 80,35 L 120,32 L 160,40 L 200,45 L 240,52 L 300,60 L 300,80 L 0,80 Z" fill="url(#g1)"/>
            <path d="M 0,30 L 40,28 L 80,35 L 120,32 L 160,40 L 200,45 L 240,52 L 300,60" fill="none" stroke={TOKENS.lime} strokeWidth="2"/>
            {[[0,30],[40,28],[80,35],[120,32],[160,40],[200,45],[240,52],[300,60]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r="2.5" fill={TOKENS.bg} stroke={TOKENS.lime} strokeWidth="1.5"/>
            ))}
          </svg>
          <div className="flex justify-between mt-2 text-[10px] text-white/40 font-mono">
            <span>74.1kg</span><span>now · 72.0kg</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ---------- LANDING PAGE ----------

function Landing() {
  return (
    <div className="bg-[#0A0A0B] text-white">
      {/* nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-lime-300 flex items-center justify-center">
              <Activity size={15} className="text-black" strokeWidth={2.5}/>
            </div>
            <Mono className="text-sm font-semibold tracking-tight">macromeal<span className="text-lime-300">.</span></Mono>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <Mono className="text-xs">/EN ES</Mono>
          </div>
          <Btn className="!py-2 !px-4 text-xs">Get the app</Btn>
        </div>
      </nav>

      {/* hero */}
      <section className="relative overflow-hidden">
        {/* grid bg */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}/>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-lime-300/10 rounded-full blur-[120px]"/>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-300 animate-pulse"/>
              <Mono className="text-[11px] uppercase tracking-wider text-white/70">Now delivering · Lima</Mono>
              <ChevronRight size={12} className="text-white/40"/>
            </div>
            <h1 className="text-6xl md:text-8xl font-medium leading-[0.95] tracking-tight" style={{fontFamily:"Geist"}}>
              Your macros,<br/>
              <span style={{fontFamily:"Instrument Serif", fontStyle:"italic", color:TOKENS.lime}}>delivered.</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
              Stop calculating macros manually. Pay by the gram. Complete your day in three taps.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Btn className="flex items-center gap-2 !px-6">
                Start eating with precision <ArrowRight size={16}/>
              </Btn>
              <Btn variant="ghost" className="flex items-center gap-2 !px-6">
                <Play size={14}/> Watch the 60s demo
              </Btn>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-[11px] uppercase tracking-wider text-white/30 font-mono">
              <span>✓ no meal plans</span>
              <span>✓ macros guaranteed</span>
              <span>✓ live pricing</span>
            </div>
          </div>

          {/* floating phone mockups */}
          <div className="mt-20 relative h-[520px] hidden md:block">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20">
              <MiniPhoneHero variant="dashboard"/>
            </div>
            <div className="absolute left-[15%] top-12 z-10 -rotate-[8deg] opacity-90">
              <MiniPhoneHero variant="auto"/>
            </div>
            <div className="absolute right-[15%] top-12 z-10 rotate-[8deg] opacity-90">
              <MiniPhoneHero variant="build"/>
            </div>
          </div>
        </div>
      </section>

      {/* stat strip */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "±2g", l: "macro accuracy" },
            { v: "3 taps", l: "to complete your day" },
            { v: "S/0.18", l: "per gram of protein" },
            { v: "12 min", l: "median delivery" },
          ].map((s, i) => (
            <div key={i}>
              <Mono className="text-3xl md:text-4xl text-white tabular-nums">{s.v}</Mono>
              <Mono className="block text-[10px] uppercase tracking-[0.15em] text-white/40 mt-1">{s.l}</Mono>
            </div>
          ))}
        </div>
      </section>

      {/* problem section */}
      <section className="py-24" id="features">
        <div className="max-w-5xl mx-auto px-6">
          <Mono className="text-[10px] uppercase tracking-[0.2em] text-lime-300 mb-3">the problem</Mono>
          <h2 className="text-4xl md:text-6xl font-medium leading-[1.05] tracking-tight max-w-3xl" style={{fontFamily:"Geist"}}>
            Counting macros works.<br/>
            <span className="text-white/40">Until it doesn&apos;t.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mt-16">
            {[
              { n:"01", t:"Mentally exhausting", d:"Logging every meal, weighing every gram, recalculating after every craving." },
              { n:"02", t:"Cooking takes hours", d:"Meal-prep Sunday. Same five recipes. Burnout by week three." },
              { n:"03", t:"Healthy delivery isn't healthy", d:"Apps lie about calories. No one breaks down per gram. You're guessing." },
            ].map(p => (
              <div key={p.n} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
                <Mono className="text-[10px] text-lime-300">{p.n}</Mono>
                <h3 className="text-lg font-medium mt-3">{p.t}</h3>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* feature: smart recommendation demo */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Mono className="text-[10px] uppercase tracking-[0.2em] text-lime-300 mb-3">the solution · 01</Mono>
            <h2 className="text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight" style={{fontFamily:"Geist"}}>
              Smart Auto Mode <span style={{fontFamily:"Instrument Serif", fontStyle:"italic"}}>completes</span> your macros for you.
            </h2>
            <p className="mt-6 text-lg text-white/50 leading-relaxed">
              The app reads what you&apos;ve eaten, calculates the gap, and recommends a meal that fits exactly.
              No menu scrolling. No guessing.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Real-time macro gap analysis",
                "Per-meal confidence score",
                "Post-workout window detection",
                "Re-rolls if you don't like it",
              ].map(f => (
                <div key={f} className="flex items-center gap-3 text-sm text-white/80">
                  <div className="w-5 h-5 rounded-full bg-lime-300/20 border border-lime-300/40 flex items-center justify-center">
                    <Check size={11} className="text-lime-300"/>
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-lime-300/10 rounded-3xl blur-3xl"/>
            <div className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-lime-300 flex items-center justify-center">
                  <Cpu size={12} className="text-black"/>
                </div>
                <Mono className="text-[10px] uppercase tracking-wider text-lime-300">macromeal.ai</Mono>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-lime-300 animate-pulse"/>
                  <Mono className="text-[9px] text-lime-300/70">analyzing</Mono>
                </div>
              </div>

              <Mono className="text-xs text-white/40">{"// gap detected"}</Mono>
              <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
                {[{l:"P",v:38,c:TOKENS.protein},{l:"C",v:52,c:TOKENS.carbs},{l:"F",v:8,c:TOKENS.fats}].map(x=>(
                  <div key={x.l} className="rounded-xl border border-white/5 bg-black/40 p-3 text-center">
                    <Mono className="text-[9px] text-white/40">{x.l}</Mono>
                    <Mono className="block text-xl tabular-nums" style={{color:x.c}}>{x.v}g</Mono>
                  </div>
                ))}
              </div>

              <Mono className="text-xs text-white/40">{"// recommending"}</Mono>
              <div className="mt-2 rounded-2xl border border-lime-300/30 bg-lime-300/[0.08] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium">Pollo · Arroz Jazmín</div>
                    <Mono className="text-[10px] text-lime-300 mt-1">match · 98%</Mono>
                  </div>
                  <Mono className="text-lg text-white tabular-nums">S/18.40</Mono>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* dynamic pricing explanation */}
      <section className="py-24 border-t border-white/5" id="pricing">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center">
            <Mono className="text-[10px] uppercase tracking-[0.2em] text-lime-300 mb-3">the solution · 02</Mono>
            <h2 className="text-4xl md:text-6xl font-medium leading-[1.05] tracking-tight" style={{fontFamily:"Geist"}}>
              You pay <span style={{fontFamily:"Instrument Serif", fontStyle:"italic", color:TOKENS.lime}}>per gram</span>.<br/>
              Not per plate.
            </h2>
            <p className="mt-6 text-lg text-white/50 max-w-xl mx-auto">
              Transparent pricing. No padded meal plans. The total is just your macros, multiplied.
            </p>
          </div>

          <div className="mt-16 rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {l:"Protein", v:"S/0.18", u:"per gram", c:TOKENS.protein, src:"chicken · fish · whey"},
                {l:"Carbs", v:"S/0.04", u:"per gram", c:TOKENS.carbs, src:"rice · quinoa · oats"},
                {l:"Fats", v:"S/0.22", u:"per gram", c:TOKENS.fats, src:"avocado · oil · nuts"},
              ].map(r => (
                <div key={r.l} className="rounded-2xl border border-white/8 bg-black/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Mono className="text-xs uppercase tracking-wider" style={{color:r.c}}>{r.l}</Mono>
                    <div className="w-2 h-2 rounded-full" style={{background:r.c, boxShadow:`0 0 8px ${r.c}`}}/>
                  </div>
                  <Mono className="text-4xl text-white tabular-nums">{r.v}</Mono>
                  <Mono className="block text-[10px] text-white/40 mt-1">{r.u}</Mono>
                  <div className="mt-4 pt-4 border-t border-white/5 text-[11px] text-white/40">{r.src}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/8 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <Mono className="text-[10px] uppercase tracking-wider text-white/40 mb-2">example · 40P / 60C / 15F</Mono>
                <Mono className="text-3xl text-white tabular-nums">
                  S/0.18×40 + S/0.04×60 + S/0.22×15
                </Mono>
              </div>
              <div className="text-right">
                <Mono className="text-[10px] uppercase tracking-wider text-white/40">total</Mono>
                <Mono className="text-5xl tabular-nums" style={{color:TOKENS.lime}}>S/12.90</Mono>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* dashboard preview */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Mono className="text-[10px] uppercase tracking-[0.2em] text-lime-300 mb-3">your dashboard</Mono>
            <h2 className="text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight" style={{fontFamily:"Geist"}}>
              Every gram, <span style={{fontFamily:"Instrument Serif", fontStyle:"italic"}}>tracked</span>.
            </h2>
          </div>

          <div className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-lime-300/10 rounded-full blur-3xl"/>
            <div className="relative grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/8 bg-black/40 p-5">
                  <Mono className="text-[10px] uppercase tracking-wider text-white/40">today · kcal</Mono>
                  <Mono className="block text-4xl text-white tabular-nums mt-1">1,620<span className="text-white/30 text-lg ml-1">/2,400</span></Mono>
                  <div className="h-1 mt-3 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-lime-300 rounded-full" style={{width:"67%", boxShadow:`0 0 8px ${TOKENS.lime}`}}/>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/40 p-5 space-y-3">
                  <MacroBar label="Protein" value={142} target={180} color={TOKENS.protein}/>
                  <MacroBar label="Carbs" value={188} target={240} color={TOKENS.carbs}/>
                  <MacroBar label="Fats" value={48} target={75} color={TOKENS.fats}/>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <Ring value={142} max={180} color={TOKENS.protein} size={220} stroke={14} label="protein" unit="g"/>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-lime-300/20 bg-lime-300/[0.05] p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={12} className="text-lime-300"/>
                    <Mono className="text-[10px] uppercase tracking-wider text-lime-300">ai · suggestion</Mono>
                  </div>
                  <p className="text-sm text-white/80 leading-snug">
                    You still need <Mono className="text-lime-300">38g protein</Mono> · <Mono className="text-lime-300">52g carbs</Mono>.
                  </p>
                  <Btn className="w-full mt-3 !py-2 text-xs">Complete my macros</Btn>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{l:"streak", v:"14d"},{l:"adherence", v:"94%"}].map(x=>(
                    <div key={x.l} className="rounded-xl border border-white/8 bg-black/40 p-3 text-center">
                      <Mono className="text-[9px] text-white/40 uppercase">{x.l}</Mono>
                      <Mono className="block text-xl text-lime-300 tabular-nums">{x.v}</Mono>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Mono className="text-[10px] uppercase tracking-[0.2em] text-lime-300 mb-3">backed by athletes</Mono>
            <h2 className="text-4xl md:text-5xl font-medium" style={{fontFamily:"Geist"}}>
              People who <span style={{fontFamily:"Instrument Serif", fontStyle:"italic"}}>actually train</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { q: "I used to spend 4 hours every Sunday meal-prepping. Now I just open the app.", a: "Camila R.", r: "CrossFit coach · Lima" },
              { q: "Pricing per gram changed how I think about food. It's honest math.", a: "Mateo L.", r: "Powerlifter · 110kg class" },
              { q: "The 'complete my macros' button is genuinely magic. Hit my numbers 38 days straight.", a: "Daniela P.", r: "Physique competitor" },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 flex flex-col">
                <Quote size={20} className="text-lime-300/40 mb-4"/>
                <p className="text-white/80 leading-relaxed text-[15px] flex-1">{t.q}</p>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="text-sm text-white font-medium">{t.a}</div>
                  <Mono className="text-[10px] text-white/40">{t.r}</Mono>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection/>

      {/* final CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-300/30 bg-lime-300/5 mb-8">
            <Sparkles size={11} className="text-lime-300"/>
            <Mono className="text-[10px] uppercase tracking-wider text-lime-300">starting at S/12.90</Mono>
          </div>
          <h2 className="text-5xl md:text-7xl font-medium leading-[0.95] tracking-tight" style={{fontFamily:"Geist"}}>
            Complete your macros<br/>
            <span style={{fontFamily:"Instrument Serif", fontStyle:"italic", color:TOKENS.lime}}>without thinking</span>.
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Btn className="flex items-center gap-2 !px-6">Get the app <ArrowRight size={16}/></Btn>
            <Btn variant="ghost" className="!px-6">Talk to founder</Btn>
          </div>
          <Mono className="block mt-8 text-[10px] uppercase tracking-wider text-white/30">free for your first 3 meals</Mono>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-lime-300 flex items-center justify-center">
                <Activity size={15} className="text-black" strokeWidth={2.5}/>
              </div>
              <Mono className="text-sm font-semibold">macromeal<span className="text-lime-300">.</span></Mono>
            </div>
            <p className="text-sm text-white/40 max-w-sm leading-relaxed">
              Precision nutrition for people who train. Built in Lima, Peru.
            </p>
          </div>
          <div>
            <Mono className="text-[10px] uppercase tracking-wider text-white/40 mb-3">product</Mono>
            <div className="space-y-2 text-sm text-white/60">
              <div>Smart Auto</div><div>Build Your Own</div><div>Pricing</div>
            </div>
          </div>
          <div>
            <Mono className="text-[10px] uppercase tracking-wider text-white/40 mb-3">company</Mono>
            <div className="space-y-2 text-sm text-white/60">
              <div>About</div><div>Press</div><div>Careers</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <Mono className="text-[10px] uppercase tracking-wider text-white/30">© 2026 macromeal s.a.c · lima, pe</Mono>
          <Mono className="text-[10px] uppercase tracking-wider text-white/30">v.0.4.2 · status · all systems normal</Mono>
        </div>
      </footer>
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q: "How accurate are the macros?", a: "Within ±2 grams per macro per meal. Every ingredient is weighed before plating and re-verified at dispatch. We publish our weighing logs on request." },
    { q: "What's the minimum order?", a: "There isn't one. You can order a single 80g chicken breast at S/14.40 if that's what closes your day. Most users place 1-2 orders daily." },
    { q: "Do I have to follow a meal plan?", a: "No. MacroMeal works backwards from your daily macro target. You can use Smart Auto, build your own, or both — the app just makes sure your numbers hit." },
    { q: "What's your delivery range?", a: "Currently Miraflores, San Isidro, Barranco, and Surco in Lima. Median delivery is 12 minutes. Expanding to Lima Norte in Q3 2026." },
    { q: "Can I see what's in each meal?", a: "Yes. Every meal exposes its ingredient breakdown by gram. You can audit any order in your history and we'll show you the exact composition." },
  ];
  return (
    <section className="py-24 border-t border-white/5" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <Mono className="text-[10px] uppercase tracking-[0.2em] text-lime-300 mb-3">questions</Mono>
        <h2 className="text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight mb-12" style={{fontFamily:"Geist"}}>
          Things you&apos;ll <span style={{fontFamily:"Instrument Serif", fontStyle:"italic"}}>probably</span> ask.
        </h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <button key={i} onClick={()=>setOpen(open===i ? -1 : i)} className="w-full text-left rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] p-5 transition-all">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white font-medium">{f.q}</span>
                <ChevronDown size={16} className={`text-white/40 transition-transform ${open===i ? "rotate-180" : ""}`}/>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${open===i ? "max-h-40 mt-3" : "max-h-0"}`}>
                <p className="text-sm text-white/50 leading-relaxed">{f.a}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Compact phone for landing hero
function MiniPhoneHero({ variant }) {
  return (
    <div className="w-[240px] rounded-[2rem] bg-gradient-to-b from-zinc-900 to-black p-2 border border-white/10 shadow-2xl">
      <div className="rounded-[1.6rem] bg-[#0A0A0B] overflow-hidden h-[480px] p-4">
        <div className="flex justify-between items-center mb-3">
          <Mono className="text-[9px] text-white/60">9:41</Mono>
          <div className="w-12 h-3 bg-black rounded-full"/>
          <div className="w-4 h-2 border border-white/40 rounded-sm"/>
        </div>

        {variant === "dashboard" && (
          <div>
            <Mono className="text-[8px] uppercase tracking-wider text-white/40">today</Mono>
            <div className="text-base text-white font-medium" style={{fontFamily:"Geist"}}>Hola, Sebastian</div>
            <div className="mt-3 flex justify-center">
              <Ring value={1620} max={2400} color={TOKENS.lime} size={130} stroke={9} label="kcal" sub="780 left"/>
            </div>
            <div className="mt-3 space-y-2">
              <MacroBar label="P" value={142} target={180} color={TOKENS.protein}/>
              <MacroBar label="C" value={188} target={240} color={TOKENS.carbs}/>
              <MacroBar label="F" value={48} target={75} color={TOKENS.fats}/>
            </div>
          </div>
        )}

        {variant === "auto" && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Cpu size={10} className="text-lime-300"/>
              <Mono className="text-[8px] uppercase text-lime-300 tracking-wider">auto.mode</Mono>
            </div>
            <Mono className="text-[8px] uppercase tracking-wider text-white/40">gap detected</Mono>
            <div className="grid grid-cols-3 gap-1 mt-2 mb-3">
              {[{l:"P",v:38,c:TOKENS.protein},{l:"C",v:52,c:TOKENS.carbs},{l:"F",v:8,c:TOKENS.fats}].map(x=>(
                <div key={x.l} className="rounded-lg border border-white/5 bg-black/40 p-2 text-center">
                  <Mono className="text-[7px] text-white/40">{x.l}</Mono>
                  <Mono className="block text-sm tabular-nums" style={{color:x.c}}>{x.v}g</Mono>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-lime-300/30 bg-lime-300/[0.08] p-3">
              <div className="text-[11px] text-white font-medium leading-tight">Pollo · Arroz Jazmín</div>
              <Mono className="text-[8px] text-lime-300 mt-1">match · 98%</Mono>
              <div className="grid grid-cols-4 gap-1 mt-2">
                {[{l:"P",v:42,c:TOKENS.protein},{l:"C",v:52,c:TOKENS.carbs},{l:"F",v:9,c:TOKENS.fats},{l:"kc",v:457,c:"#FFF"}].map(x=>(
                  <div key={x.l} className="text-center">
                    <Mono className="text-[7px] text-white/40">{x.l}</Mono>
                    <Mono className="block text-[9px] tabular-nums" style={{color:x.c}}>{x.v}</Mono>
                  </div>
                ))}
              </div>
              <Mono className="block text-center mt-2 text-sm text-white">S/18.40</Mono>
            </div>
          </div>
        )}

        {variant === "build" && (
          <div>
            <Mono className="text-[8px] uppercase tracking-wider text-white/40">build.mode</Mono>
            <div className="text-base text-white font-medium" style={{fontFamily:"Geist"}}>Compose your plate</div>
            <div className="mt-3 space-y-2">
              {[
                {n:"Chicken breast", g:150, p:TOKENS.protein},
                {n:"Jasmine rice", g:200, p:TOKENS.carbs},
                {n:"Avocado", g:50, p:TOKENS.fats},
              ].map(i=>(
                <div key={i.n} className="rounded-xl border border-lime-300/20 bg-lime-300/[0.04] p-2 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-white">{i.n}</div>
                    <Mono className="text-[8px] text-white/40">{i.g}g</Mono>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{background:i.p}}/>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-white/10 bg-zinc-900 p-3">
              <div className="grid grid-cols-4 gap-1 mb-2">
                {[{l:"P",v:54,c:TOKENS.protein},{l:"C",v:65,c:TOKENS.carbs},{l:"F",v:13,c:TOKENS.fats},{l:"kc",v:602,c:"#FFF"}].map(x=>(
                  <div key={x.l} className="text-center">
                    <Mono className="text-[7px] text-white/40">{x.l}</Mono>
                    <Mono className="block text-[10px] tabular-nums" style={{color:x.c}}>{x.v}</Mono>
                  </div>
                ))}
              </div>
              <Mono className="text-sm text-lime-300 text-center block">S/22.40</Mono>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- MAIN APP ----------

export default function App() {
  const [view, setView] = useState("landing");

  const screens = [
    { k:"landing", l:"Landing", icon:Layers },
    { k:"onboarding", l:"Onboarding", icon:User },
    { k:"dashboard", l:"Dashboard", icon:Activity },
    { k:"auto", l:"Smart Auto", icon:Sparkles },
    { k:"builder", l:"Build", icon:ChefHat },
    { k:"pricing", l:"Pricing", icon:Cpu },
    { k:"tracking", l:"Tracking", icon:Bike },
    { k:"analytics", l:"Analytics", icon:BarChart3 },
  ];

  const renderScreen = () => {
    switch(view) {
      case "landing": return <Landing/>;
      case "onboarding": return <CenterStage><Onboarding/></CenterStage>;
      case "dashboard": return <CenterStage><Dashboard/></CenterStage>;
      case "auto": return <CenterStage><SmartAuto/></CenterStage>;
      case "builder": return <CenterStage><Builder/></CenterStage>;
      case "pricing": return <CenterStage><Pricing/></CenterStage>;
      case "tracking": return <CenterStage><Tracking/></CenterStage>;
      case "analytics": return <CenterStage><Analytics/></CenterStage>;
      default: return <Landing/>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white" style={{fontFamily:"Geist, -apple-system, sans-serif"}}>
      <style>{`
        ${FONTS}
        * { -webkit-font-smoothing: antialiased; }
        body { background:#0A0A0B; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        .mm-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.08);
          outline: none;
          --accent: ${TOKENS.lime};
        }
        .mm-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px rgba(199,247,62,0.2), 0 0 20px var(--accent);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .mm-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .mm-slider::-moz-range-thumb {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          box-shadow: 0 0 0 4px rgba(199,247,62,0.2), 0 0 20px var(--accent);
          cursor: pointer;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in.fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* screen switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] hidden md:block">
        <div className="rounded-full border border-white/10 bg-black/80 backdrop-blur-2xl px-2 py-2 flex items-center gap-1 shadow-2xl">
          {screens.map(s => {
            const Icon = s.icon;
            return (
              <button key={s.k} onClick={()=>setView(s.k)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${view===s.k ? "bg-lime-300 text-black" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                <Icon size={11}/> {s.l}
              </button>
            );
          })}
        </div>
      </div>

      {/* mobile switcher */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] md:hidden">
        <select value={view} onChange={e=>setView(e.target.value)} className="rounded-full border border-white/10 bg-black/80 backdrop-blur-xl px-4 py-2 text-xs font-mono text-white">
          {screens.map(s => <option key={s.k} value={s.k}>{s.l}</option>)}
        </select>
      </div>

      {renderScreen()}
    </div>
  );
}

function CenterStage({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}/>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-300/5 rounded-full blur-[120px]"/>
      <div className="relative">{children}</div>
    </div>
  );
}
