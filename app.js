
    const { useState, useEffect } = React;

    const QUOTES = [
      { text: "You don’t have to study for 5 hours. Just start with 5 minutes.", author: "Atomic Habits Mindset" },
      { text: "Small, consistent wins beat one big all-nighter.", author: "Study Coach" },
      { text: "Your attention is your superpower. Protect it.", author: "Focus Mentor" },
      { text: "Done is better than perfect — especially for students.", author: "Progress Over Perfection" },
    ];

    const MOOD_MESSAGES = {
      great: "You’re glowing today. Use this energy to gently tackle your hardest concept.",
      okay: "Steady, grounded. A 20-minute block will feel really good.",
      low: "It’s okay to be slow. One tiny task is still progress.",
      stressed: "Your mind is loud right now. Breathe, break things into micro steps, and pick just one.",
    };

    const WELLNESS_PROMPTS = [
      { label: "1-minute reset", body: "Inhale for 4, hold for 4, exhale for 4. Repeat 5 times before opening books." },
      { label: "Brain dump", body: "Write down everything bothering you. Then circle just 1–2 priorities for today." },
      { label: "Micro-win", body: "Choose a 2–5 min study action. Finishing it is a signal to your brain: ‘I can do this.’" },
    ];

    function CircleProgress({ value, label, sub, xpText }) {
      const radius = 22;
      const circumference = 2 * Math.PI * radius;
      const safeValue = Math.max(0, Math.min(100, value));
      const offset = circumference * (1 - safeValue / 100);

      return (
        <div className="circle-card">
          <div className="circle-wrapper">
            <svg className="circle-svg" width="52" height="52" viewBox="0 0 52 52">
              <circle className="circle-bg" cx="26" cy="26" r={radius}></circle>
              <circle className="circle-fg" cx="26" cy="26" r={radius} strokeDasharray={circumference} strokeDashoffset={offset}></circle>
            </svg>
            <div className="circle-text"><span>{Math.round(safeValue)}%</span></div>
          </div>
          <div className="circle-label-block">
            <div className="circle-title">{label}</div>
            <div className="circle-sub">{sub}</div>
            {xpText && <div className="circle-xp">{xpText}</div>}
          </div>
        </div>
      );
    }

    function FocusTimer({ onSessionComplete }) {
      const [secondsLeft, setSecondsLeft] = useState(25 * 60);
      const [initialSeconds, setInitialSeconds] = useState(25 * 60);
      const [isRunning, setIsRunning] = useState(false);
      const [mode, setMode] = useState(25);

      useEffect(() => {
        if (!isRunning) return;
        const id = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              clearInterval(id);
              setIsRunning(false);
              if (typeof onSessionComplete === "function") onSessionComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(id);
      }, [isRunning, onSessionComplete]);

      const setPreset = (minutes) => {
        setMode(minutes);
        setInitialSeconds(minutes * 60);
        setSecondsLeft(minutes * 60);
        setIsRunning(false);
      };

      const startTimer = () => { setSecondsLeft(initialSeconds); setIsRunning(true); };
      const pauseTimer = () => setIsRunning(false);

      const minutesStr = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
      const secondsStr = String(secondsLeft % 60).padStart(2, "0");

      const progress = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;
      const radius = 48;
      const circumference = 2 * Math.PI * radius;
      const safeProgress = Math.max(0, Math.min(100, progress));
      const offset = circumference * (1 - safeProgress / 100);

      return (
        <>
          <div className="card-header-row">
            <div>
              <div className="card-title"><i className="ri-timer-flash-line"></i> Study Timer</div>
              <div className="card-sub">Calm circular timer to keep you in flow without pressure.</div>
            </div>
            <div className="badge-soft"><i className="ri-sparkles-line"></i> +30 XP per session</div>
          </div>

          <div className="timer-layout">
            <div className="timer-circle-wrapper">
              <svg className="timer-svg" width="110" height="110" viewBox="0 0 110 110">
                <circle className="timer-bg" cx="55" cy="55" r={radius}></circle>
                <circle className="timer-fg" cx="55" cy="55" r={radius} strokeDasharray={circumference} strokeDashoffset={offset}></circle>
              </svg>
              <div className="timer-center">
                <div className="timer-time">{minutesStr}:{secondsStr}</div>
                <div className="timer-label">{mode} min focus block</div>
              </div>
            </div>

            <div className="timer-side">
              <div className="timer-status">
                <i className="ri-meditation-line"></i>
                {isRunning ? "Your mind is in a focus bubble. Let everything else wait." : "Choose a duration that feels light. You can always do another block."}
              </div>

              <div className="chips-row">
                {[15, 25, 50].map((m) => (
                  <button key={m} className={`chip-btn ${mode === m ? "active": ""}`} onClick={() => setPreset(m)} disabled={isRunning}>
                    <i className="ri-focus-2-line"></i> {m} min
                  </button>
                ))}
              </div>

              <div className="timer-actions">
                <button className="btn-primary" type="button" onClick={startTimer} disabled={isRunning}><i className="ri-play-fill"></i> Start session</button>
                <button className="btn-secondary" type="button" onClick={pauseTimer} disabled={!isRunning}><i className="ri-pause-circle-line"></i> Pause</button>
              </div>
            </div>
          </div>
        </>
      );
    }

    function App() {
      const [showDashboard, setShowDashboard] = useState(false);
      const [name] = useState("Student");
      const [now, setNow] = useState(new Date());
      const [xp, setXp] = useState(120);
      const [streakDays, setStreakDays] = useState(3);
      const [focusSessions, setFocusSessions] = useState(0);
      const [distractionsResisted, setDistractionsResisted] = useState(0);

      const [tasks, setTasks] = useState([
        { id: 1, text: "Finish Maths chapter revision (30 mins)", category:"Study", completed:false },
        { id: 2, text: "Go for a 15-min walk without phone", category:"Health", completed:false },
        { id: 3, text: "Write 3 lines about how I feel", category:"Mind", completed:false },
      ]);
      const [newTaskText, setNewTaskText] = useState("");
      const [newTaskCategory, setNewTaskCategory] = useState("Study");
      const [filterCategory, setFilterCategory] = useState("All");

      const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      const [mood, setMood] = useState(null);
      const [journal, setJournal] = useState("");

      useEffect(() => {
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible"); // fade out when leaving
        }
      });
    },
    {
      threshold: 0.2, // small amount visible triggers animation
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);

      useEffect(() => {
        try {
          const saved = JSON.parse(localStorage.getItem("zenspark_state") || "{}");
          if (!saved) return;
          if (typeof saved.xp === "number") setXp(saved.xp);
          if (typeof saved.streakDays === "number") setStreakDays(saved.streakDays);
          if (typeof saved.focusSessions === "number") setFocusSessions(saved.focusSessions);
          if (typeof saved.distractionsResisted === "number") setDistractionsResisted(saved.distractionsResisted);
          if (Array.isArray(saved.tasks) && saved.tasks.length) setTasks(saved.tasks);
          if (saved.mood) setMood(saved.mood);
          if (typeof saved.journal === "string") setJournal(saved.journal);
        } catch (err) {
          console.error("Failed to load saved state:", err);
        }
      }, []);

      useEffect(() => {
        const data = { xp, streakDays, focusSessions, distractionsResisted, tasks, mood, journal };
        try { localStorage.setItem("zenspark_state", JSON.stringify(data)); } catch (err) { console.error("Failed to save state:", err); }
      }, [xp, streakDays, focusSessions, distractionsResisted, tasks, mood, journal]);

      useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(id);
      }, []);

      const level = Math.floor(xp / 100) + 1;
      const xpProgress = xp % 100;

      const handleFocusComplete = () => { setFocusSessions((s)=>s+1); setXp((x)=>x+30); setStreakDays((s)=>Math.max(s,1)); };
      const handleDistractionResist = () => { setDistractionsResisted((d)=>d+1); setXp((x)=>x+10); };

      const handleToggleTask = (id) => {
        setTasks(prev => prev.map(t => {
          if (t.id === id) {
            const wasCompleted = t.completed;
            const updated = { ...t, completed: !t.completed };
            if (!wasCompleted && updated.completed) setXp(x => x + 20);
            return updated;
          }
          return t;
        }));
      };

      const handleAddTask = (e) => {
        e.preventDefault();
        const text = newTaskText.trim();
        if (!text) return;
        const task = { id: Date.now(), text, category: newTaskCategory, completed:false };
        setTasks(prev => [task, ...prev]);
        setNewTaskText("");
      };

      const filteredTasks = filterCategory === "All" ? tasks : tasks.filter(t => t.category === filterCategory);
      const completedCount = tasks.filter(t => t.completed).length;

      const dateStr = now.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric" });
      const timeStr = now.toLocaleTimeString(undefined, { hour:"2-digit", minute:"2-digit" });

      // LANDING VIEW (home)
      if (!showDashboard) {
        return (
          <div className="app">
            <div className="shell">
              <header className="top-bar">
                <div className="brand-left">
                  <div className="brand-logo">Z</div>
                  <div>
                    <div className="brand-text-main">ZenSpark <span className="brand-dot"></span></div>
                    <div className="brand-subtitle">Student Productivity & Mental Wellness Companion</div>
                  </div>
                </div>

                <div className="top-bar-right">
                  <a href="#about-box" className="nav-btn">About</a>
                  <a href="#features-box" className="nav-btn">Features</a>
                  <a href="#streak-box" className="nav-btn">Streak</a>
                  <a href="#login-box" className="nav-btn">Login / Sign Up</a>
                </div>
              </header>

              <main className="landing-grid">
                {/* LEFT HERO BOX (unchanged layout content) */}
                <div className="landing-left">
                  <div className="section-label">For students drowning in Reels</div>
                  <h1 className="hero-title">A <span className="hero-highlight">soft-focus space</span> to study, breathe, and feel less overwhelmed.</h1>
                  <p className="hero-subtitle">ZenSpark is a student companion that helps you gently break short-form addiction, manage your time, and take care of your mental space — without feeling like another stressful app.</p>

                  <div className="hero-list">
                    <span><i className="ri-check-line"></i> Replace endless Reels with <strong>short focus blocks</strong>.</span>
                    <span><i className="ri-check-line"></i> Turn procrastination into <strong>tiny, doable tasks</strong>.</span>
                    <span><i className="ri-check-line"></i> Ease anxiety with <strong>mood check-ins & journaling</strong>.</span>
                  </div>

                  <div className="hero-cta-row">
                    <button className="btn-primary"><i className="ri-play-circle-fill"></i> Enter ZenSpark Dashboard</button>
                    <div className="hero-note"><i className="ri-sun-cloudy-line"></i> No sign-up, no rankings — just you, your focus, and soft structure.</div>
                  </div>

                  <div className="hero-tags">
                    <div className="hero-tag"><i className="ri-brain-line"></i> Attention, not addiction.</div>
                    <div className="hero-tag"><i className="ri-heart-3-line"></i> Gentle on mental health.</div>
                    <div className="hero-tag"><i className="ri-time-line"></i> Built for exam seasons.</div>
                  </div>
                </div>

                {/* RIGHT stacked boxes: About, Features, Streak, Login */}
                <div className="landing-right reveal" id="about-box">
                  <div className="landing-right-title"><i className="ri-information-line"></i> About ZenSpark</div>
                  <p className="landing-right-note">ZenSpark is a soft, minimal companion built for overwhelmed students. Instead of pushing pressure, it creates a gentle environment where you can focus, breathe, and make progress without guilt.</p>

                  <div className="split-cols">
                    <div>
                      <div className="section-label">Why we built this</div>
                      <div className="small-list">
                        <span><i className="ri-arrow-right-s-line"></i> Students are drowning in Reels/Shorts distraction loops.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Overthinking + procrastination kills productivity.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Most apps are too complex and stressful.</span>
                      </div>
                    </div>

                    <div>
                      <div className="section-label">What ZenSpark provides</div>
                      <div className="small-list">
                        <span><i className="ri-arrow-right-s-line"></i> A calm focus timer that does not pressure you.</span>
                        <span><i className="ri-arrow-right-s-line"></i> A tiny-task system your brain actually likes.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Mood tracking + journaling for emotional clarity.</span>
                      </div>
                    </div>
                  </div>

                  <div className="highlight-card"><i className="ri-sparkles-line"></i>
                    <div><strong>Our Philosophy</strong><br/>You don’t need perfection. You need a kinder environment that supports consistency.</div>
                  </div>

                  <div className="tiny-row">
                    <div className="tiny-pill-soft"><i className="ri-heart-3-line"></i> Mental wellness first.</div>
                    <div className="tiny-pill-soft"><i className="ri-calendar-check-line"></i> Small steps daily.</div>
                  </div>
                </div>

                <div className="landing-right reveal" id="features-box">
                  <div className="landing-right-title"><i className="ri-star-smile-line"></i> Features</div>
                  <p className="landing-right-note">ZenSpark provides simple, powerful tools to help you stay focused, motivated, and mentally balanced every single day.</p>

                  <div className="split-cols">
                    <div>
                      <div className="section-label">Focus Tools</div>
                      <div className="small-list">
                        <span><i className="ri-arrow-right-s-line"></i> Soft circular focus timer.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Gentle session progress tracking.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Reels/Shorts resistance meter.</span>
                      </div>
                    </div>

                    <div>
                      <div className="section-label">Wellness Tools</div>
                      <div className="small-list">
                        <span><i className="ri-arrow-right-s-line"></i> Mood check-ins to understand emotions.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Quick 60-second calm resets.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Journaling for clarity & self-reflection.</span>
                      </div>
                    </div>
                  </div>

                  <div className="highlight-card"><i className="ri-lightbulb-flash-line"></i>
                    <div><strong>Designed for Students</strong><br/>Tools that fit your day — not overwhelm it.</div>
                  </div>

                  <div className="tiny-row">
                    <div className="tiny-pill-soft"><i className="ri-focus-2-line"></i> Practical workflow</div>
                    <div className="tiny-pill-soft"><i className="ri-brain-line"></i> Mental clarity</div>
                  </div>
                </div>

                <div className="landing-right reveal" id="streak-box">
                  <div className="landing-right-title"><i className="ri-fire-line"></i> Streak System</div>
                  <p className="landing-right-note">Build gentle consistency — the streak keeps you motivated without pressure.</p>

                  <div className="split-cols">
                    <div>
                      <div className="section-label">Why streaks work</div>
                      <div className="small-list">
                        <span><i className="ri-arrow-right-s-line"></i> Small daily wins create long-term momentum.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Your brain loves completion loops.</span>
                        <span><i className="ri-arrow-right-s-line"></i> No guilt — miss a day, start gently again.</span>
                      </div>
                    </div>

                    <div>
                      <div className="section-label">What counts as a streak</div>
                      <div className="small-list">
                        <span><i className="ri-arrow-right-s-line"></i> Finishing at least 1 focus session.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Completing 1 tiny task.</span>
                        <span><i className="ri-arrow-right-s-line"></i> Resisting distractions even once.</span>
                      </div>
                    </div>
                  </div>

                  <div className="highlight-card"><i className="ri-fire-fill"></i>
                    <div><strong>Your Daily Flame</strong><br/>Keep your streak alive with simple, realistic steps.</div>
                  </div>

                  <div className="tiny-row">
                    <div className="tiny-pill-soft"><i className="ri-calendar-check-line"></i> Gentle consistency</div>
                    <div className="tiny-pill-soft"><i className="ri-thumb-up-line"></i> No pressure, only progress</div>
                  </div>
                </div>

              </main>
            </div>
          </div>
        );
      }
    }
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
