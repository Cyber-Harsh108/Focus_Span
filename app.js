const { useState, useEffect } = React;

    const QUOTES = [
      {
        text: "You don’t have to study for 5 hours. Just start with 5 minutes.",
        author: "Atomic Habits Mindset",
      },
      {
        text: "Small, consistent wins beat one big all-nighter.",
        author: "Study Coach",
      },
      {
        text: "Your attention is your superpower. Protect it.",
        author: "Focus Mentor",
      },
      {
        text: "Done is better than perfect — especially for students.",
        author: "Progress Over Perfection",
      },
    ];

    const MOOD_MESSAGES = {
      great: "You’re glowing today. Use this energy to gently tackle your hardest concept.",
      okay: "Steady, grounded. A 20-minute block will feel really good.",
      low: "It’s okay to be slow. One tiny task is still progress.",
      stressed:
        "Your mind is loud right now. Breathe, break things into micro steps, and pick just one.",
    };

    const WELLNESS_PROMPTS = [
      {
        label: "1-minute reset",
        body: "Inhale for 4, hold for 4, exhale for 4. Repeat 5 times before opening books.",
      },
      {
        label: "Brain dump",
        body: "Write down everything bothering you. Then circle just 1–2 priorities for today.",
      },
      {
        label: "Micro-win",
        body: "Choose a 2–5 min study action. Finishing it is a signal to your brain: ‘I can do this.’",
      },
    ];

    function CircleProgress({ value, label, sub, xpText }) {
      const radius = 22;
      const circumference = 2 * Math.PI * radius;
      const safeValue = Math.max(0, Math.min(100, value));
      const offset = circumference * (1 - safeValue / 100);

      return (
        <div className="circle-card">
          <div className="circle-wrapper">
            <svg
              className="circle-svg"
              width="52"
              height="52"
              viewBox="0 0 52 52"
            >
              <circle
                className="circle-bg"
                cx="26"
                cy="26"
                r={radius}
              ></circle>
              <circle
                className="circle-fg"
                cx="26"
                cy="26"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              ></circle>
            </svg>
            <div className="circle-text">
              <span>{Math.round(safeValue)}%</span>
            </div>
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
              if (typeof onSessionComplete === "function") {
                onSessionComplete();
              }
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

      const startTimer = () => {
        setSecondsLeft(initialSeconds);
        setIsRunning(true);
      };

      const pauseTimer = () => setIsRunning(false);

      const minutesStr = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
      const secondsStr = String(secondsLeft % 60).padStart(2, "0");

      const progress =
        initialSeconds > 0
          ? ((initialSeconds - secondsLeft) / initialSeconds) * 100
          : 0;

      const radius = 48;
      const circumference = 2 * Math.PI * radius;
      const safeProgress = Math.max(0, Math.min(100, progress));
      const offset = circumference * (1 - safeProgress / 100);

      return (
        <>
          <div className="card-header-row">
            <div>
              <div className="card-title">
                <i className="ri-timer-flash-line"></i>
                Study Timer
              </div>
              <div className="card-sub">
                Calm circular timer to keep you in flow without pressure.
              </div>
            </div>
            <div className="badge-soft">
              <i className="ri-sparkles-line"></i> +30 XP per session
            </div>
          </div>

          <div className="timer-layout">
            <div className="timer-circle-wrapper">
              <svg
                className="timer-svg"
                width="110"
                height="110"
                viewBox="0 0 110 110"
              >
                <circle
                  className="timer-bg"
                  cx="55"
                  cy="55"
                  r={radius}
                ></circle>
                <circle
                  className="timer-fg"
                  cx="55"
                  cy="55"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                ></circle>
              </svg>
              <div className="timer-center">
                <div className="timer-time">
                  {minutesStr}:{secondsStr}
                </div>
                <div className="timer-label">
                  {mode} min focus block
                </div>
              </div>
            </div>

            <div className="timer-side">
              <div className="timer-status">
                <i className="ri-meditation-line"></i>
                {isRunning
                  ? "Your mind is in a focus bubble. Let everything else wait."
                  : "Choose a duration that feels light. You can always do another block."}
              </div>

              <div className="chips-row">
                {[15, 25, 50].map((m) => (
                  <button
                    key={m}
                    className={`chip-btn ${mode === m ? "active" : ""}`}
                    onClick={() => setPreset(m)}
                    disabled={isRunning}
                  >
                    <i className="ri-focus-2-line"></i>
                    {m} min
                  </button>
                ))}
              </div>

              <div className="timer-actions">
                <button
                  className="btn-primary"
                  type="button"
                  onClick={startTimer}
                  disabled={isRunning}
                >
                  <i className="ri-play-fill"></i>
                  Start session
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={pauseTimer}
                  disabled={!isRunning}
                >
                  <i className="ri-pause-circle-line"></i>
                  Pause
                </button>
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
        {
          id: 1,
          text: "Finish Maths chapter revision (30 mins)",
          category: "Study",
          completed: false,
        },
        {
          id: 2,
          text: "Go for a 15-min walk without phone",
          category: "Health",
          completed: false,
        },
        {
          id: 3,
          text: "Write 3 lines about how I feel",
          category: "Mind",
          completed: false,
        },
      ]);
      const [newTaskText, setNewTaskText] = useState("");
      const [newTaskCategory, setNewTaskCategory] = useState("Study");
      const [filterCategory, setFilterCategory] = useState("All");

      const [quote] = useState(
        () => QUOTES[Math.floor(Math.random() * QUOTES.length)]
      );
      const [mood, setMood] = useState(null);
      const [journal, setJournal] = useState("");

      useEffect(() => {
        try {
          const saved = JSON.parse(localStorage.getItem("zenspark_state") || "{}");
          if (!saved) return;

          if (typeof saved.xp === "number") setXp(saved.xp);
          if (typeof saved.streakDays === "number")
            setStreakDays(saved.streakDays);
          if (typeof saved.focusSessions === "number")
            setFocusSessions(saved.focusSessions);
          if (typeof saved.distractionsResisted === "number")
            setDistractionsResisted(saved.distractionsResisted);
          if (Array.isArray(saved.tasks) && saved.tasks.length) {
            setTasks(saved.tasks);
          }
          if (saved.mood) setMood(saved.mood);
          if (typeof saved.journal === "string") setJournal(saved.journal);
        } catch (err) {
          console.error("Failed to load saved state:", err);
        }
      }, []);

      useEffect(() => {
        const data = {
          xp,
          streakDays,
          focusSessions,
          distractionsResisted,
          tasks,
          mood,
          journal,
        };
        try {
          localStorage.setItem("zenspark_state", JSON.stringify(data));
        } catch (err) {
          console.error("Failed to save state:", err);
        }
      }, [xp, streakDays, focusSessions, distractionsResisted, tasks, mood, journal]);

      useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(id);
      }, []);

      const level = Math.floor(xp / 100) + 1;
      const xpProgress = xp % 100;

      const handleFocusComplete = () => {
        setFocusSessions((s) => s + 1);
        setXp((x) => x + 30);
        setStreakDays((s) => Math.max(s, 1));
      };

      const handleDistractionResist = () => {
        setDistractionsResisted((d) => d + 1);
        setXp((x) => x + 10);
      };

      const handleToggleTask = (id) => {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === id) {
              const wasCompleted = t.completed;
              const updated = { ...t, completed: !t.completed };
              if (!wasCompleted && updated.completed) {
                setXp((x) => x + 20);
              }
              return updated;
            }
            return t;
          })
        );
      };

      const handleAddTask = (e) => {
        e.preventDefault();
        const text = newTaskText.trim();
        if (!text) return;
        const task = {
          id: Date.now(),
          text,
          category: newTaskCategory,
          completed: false,
        };
        setTasks((prev) => [task, ...prev]);
        setNewTaskText("");
      };

      const filteredTasks =
        filterCategory === "All"
          ? tasks
          : tasks.filter((t) => t.category === filterCategory);

      const completedCount = tasks.filter((t) => t.completed).length;

      const dateStr = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const timeStr = now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });

      // -------- LANDING VIEW --------
      if (!showDashboard) {
        return (
          <div className="app">
            <div className="shell">
              <header className="top-bar">
                <div className="brand-left">
                  <div className="brand-logo">Z</div>
                  <div>
                    <div className="brand-text-main">
                      ZenSpark <span className="brand-dot"></span>
                    </div>
                    <div className="brand-subtitle">
                      Student Productivity & Mental Wellness Companion
                    </div>
                  </div>
                </div>
                <div className="top-bar-right">
                  <div className="small-pill">
                    <i className="ri-leaf-line"></i>
                    Calm mind, energetic progress.
                  </div>
                </div>
              </header>

              <main className="landing-grid">
                <section className="landing-left">
                  <div className="section-label">For students drowning in Reels</div>
                  <h1 className="hero-title">
                    A <span className="hero-highlight">soft-focus space</span> to
                    study, breathe, and feel less overwhelmed.
                  </h1>
                  <p className="hero-subtitle">
                    ZenSpark is a student companion that helps you gently break
                    short-form addiction, manage your time, and take care of your
                    mental space — without feeling like another stressful app.
                  </p>

                  <div className="hero-list">
                    <span>
                      <i className="ri-check-line"></i>
                      Replace endless Reels with <strong>short focus blocks</strong>.
                    </span>
                    <span>
                      <i className="ri-check-line"></i>
                      Turn procrastination into <strong>tiny, doable tasks</strong>.
                    </span>
                    <span>
                      <i className="ri-check-line"></i>
                      Ease anxiety with <strong>mood check-ins & journaling</strong>.
                    </span>
                  </div>

                  <div className="hero-cta-row">
                    <button
                      className="btn-primary"
                      onClick={() => setShowDashboard(true)}
                    >
                      <i className="ri-play-circle-fill"></i>
                      Enter ZenSpark Dashboard
                    </button>
                    <div className="hero-note">
                      <i className="ri-sun-cloudy-line"></i>
                      No sign-up, no rankings — just you, your focus, and soft structure.
                    </div>
                  </div>

                  <div className="hero-tags">
                    <div className="hero-tag">
                      <i className="ri-brain-line"></i>
                      Attention, not addiction.
                    </div>
                    <div className="hero-tag">
                      <i className="ri-heart-3-line"></i>
                      Gentle on mental health.
                    </div>
                    <div className="hero-tag">
                      <i className="ri-time-line"></i>
                      Built for exam seasons.
                    </div>
                  </div>
                </section>

                <section className="landing-right">
                  <div className="landing-right-title">
                    <i className="ri-error-warning-line"></i>
                    The Problem & Challenge
                  </div>
                  <p className="landing-right-note">
                    Reels/Shorts are designed to hijack your focus. Homework and
                    exams start to feel impossible, so your brain escapes into
                    more scrolling — creating a loop of guilt and anxiety.
                  </p>

                  <div className="split-cols">
                    <div>
                      <div className="section-label">Problem</div>
                      <div className="small-list">
                        <span>
                          <i className="ri-arrow-right-s-line"></i>
                          Short attention spans due to constant short-form hits.
                        </span>
                        <span>
                          <i className="ri-arrow-right-s-line"></i>
                          Extreme procrastination and “I’ll start tomorrow” cycle.
                        </span>
                        <span>
                          <i className="ri-arrow-right-s-line"></i>
                          Academic anxiety and feeling behind all the time.
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="section-label">Challenge</div>
                      <div className="small-list">
                        <span>
                          <i className="ri-arrow-right-s-line"></i>
                          Make focus feel calmer than scrolling.
                        </span>
                        <span>
                          <i className="ri-arrow-right-s-line"></i>
                          Give structure without overwhelming dashboards.
                        </span>
                        <span>
                          <i className="ri-arrow-right-s-line"></i>
                          Support mental wellness, not just marks.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="highlight-card">
                    <i className="ri-sparkles-line"></i>
                    <div>
                      <strong>ZenSpark&apos;s Solution</strong>
                      <br />
                      A warm, minimalist dashboard with focus timer, tiny tasks,
                      Reels-resistance tracker, mood check-ins and journaling —
                      everything in one calm, sand-toned space.
                    </div>
                  </div>

                  <div className="tiny-row">
                    <div className="tiny-pill-soft">
                      <i className="ri-gamepad-line"></i>
                      Earn XP for real study, not for screen time.
                    </div>
                    <div className="tiny-pill-soft">
                      <i className="ri-smartphone-line"></i>
                      Track every time you close Reels instead of scrolling.
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>
        );
      }

      // -------- DASHBOARD VIEW --------
      const moodMsg = mood ? MOOD_MESSAGES[mood] :
        "Tap the emoji that feels closest. ZenSpark adapts to your mood, not the other way around.";

      const levelPercent = Math.min(100, (xpProgress / 100) * 100);
      const focusPercent = Math.min(100, (focusSessions / 4) * 100); // 4+ sessions = 100%
      const resistPercent = Math.min(100, (distractionsResisted / 5) * 100); // 5+ resist = 100%

      return (
        <div className="app">
          <div className="shell">
            <header className="top-bar">
              <div className="brand-left">
                <div className="brand-logo">Z</div>
                <div>
                  <div className="brand-text-main">
                    ZenSpark <span className="brand-dot"></span>
                  </div>
                  <div className="brand-subtitle">
                    Calm Mind • Energetic Flow
                  </div>
                </div>
              </div>
              <div className="top-bar-right">
                <div className="small-pill">
                  <i className="ri-seedling-line"></i>
                  Today is a new chance to show up softly for yourself.
                </div>
              </div>
            </header>

            <main className="dashboard-grid">
              {/* SIDEBAR */}
              <aside className="panel sidebar">
                <section>
                  <div className="section-label">Welcome</div>
                  <div className="greeting-title">Namaste, {name} 🌿</div>
                  <div className="greeting-sub">
                    This is your sand-garden for focus, rest and tiny wins.
                  </div>
                </section>

                <section>
                  <div className="section-label">How are you feeling?</div>
                  <div className="mood-buttons">
                    <button
                      className={`mood-btn ${mood === "great" ? "active" : ""}`}
                      onClick={() => setMood("great")}
                    >
                      😄
                    </button>
                    <button
                      className={`mood-btn ${mood === "okay" ? "active" : ""}`}
                      onClick={() => setMood("okay")}
                    >
                      🙂
                    </button>
                    <button
                      className={`mood-btn ${mood === "low" ? "active" : ""}`}
                      onClick={() => setMood("low")}
                    >
                      😶
                    </button>
                    <button
                      className={`mood-btn ${mood === "stressed" ? "active" : ""
                        }`}
                      onClick={() => setMood("stressed")}
                    >
                      😥
                    </button>
                  </div>
                  <div className="mood-text">{moodMsg}</div>
                </section>

                <section>
                  <div className="section-label">60-second calm reset</div>
                  <div className="breathe-card">
                    <div className="breathe-circle">
                      Inhale<br />Hold<br />Exhale
                    </div>
                    <div className="breathe-text">
                      <strong>Before studying</strong>, give your brain a soft landing.
                      Try 4–4–4 breathing: 4 sec inhale, 4 sec hold, 4 sec exhale.
                    </div>
                  </div>
                </section>

                <section>
                  <div className="section-label">Gentle reminder</div>
                  <div className="quote-card">
                    <div className="quote-text">“{quote.text}”</div>
                    <div className="quote-author">— {quote.author}</div>
                  </div>
                </section>
              </aside>

              {/* MAIN CONTENT */}
              <section className="panel main-panel">
                <header className="dashboard-header">
                  <div>
                    <div className="section-label">Today&apos;s focus</div>
                    <div className="dh-title">
                      Let&apos;s move your goals forward softly.
                    </div>
                    <div className="dh-subtitle">
                      One focus block, one tiny task, one kinder thought at a time.
                    </div>
                  </div>
                  <div className="dh-right">
                    <div className="date-chip">
                      <i className="ri-calendar-2-line"></i>
                      {dateStr} • {timeStr}
                    </div>
                    <span>All data is stored only in your browser.</span>
                  </div>
                </header>

                <section className="stats-grid">
                  <CircleProgress
                    value={levelPercent}
                    label={`Level ${level}`}
                    sub="Calm Learner"
                    xpText={`XP: ${xp} • Next level at 100`}
                  />
                  <CircleProgress
                    value={focusPercent}
                    label="Focus sessions"
                    sub={`${focusSessions} completed today`}
                    xpText="+30 XP per session"
                  />
                  <CircleProgress
                    value={resistPercent}
                    label="Reels resisted"
                    sub={`${distractionsResisted} times today`}
                    xpText="+10 XP per resist"
                  />
                </section>

                <section className="main-grid">
                  {/* TIMER */}
                  <div className="card">
                    <FocusTimer onSessionComplete={handleFocusComplete} />
                  </div>

                  {/* TASKS */}
                  <div className="card">
                    <div className="card-header-row">
                      <div>
                        <div className="card-title">
                          <i className="ri-checkbox-multiple-line"></i>
                          Today&apos;s tiny tasks
                        </div>
                        <div className="card-sub">
                          Keep this list short and realistic — your brain loves
                          finishing things.
                        </div>
                      </div>
                      <div className="badge-soft">
                        <i className="ri-plant-line"></i>
                        {completedCount} done
                      </div>
                    </div>

                    <div className="filter-row">
                      <span>Filter:</span>
                      <div className="filter-chips">
                        {["All", "Study", "Health", "Mind"].map((cat) => (
                          <button
                            key={cat}
                            className={`filter-chip ${filterCategory === cat ? "active" : ""
                              }`}
                            onClick={() => setFilterCategory(cat)}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="tasks-list">
                      {filteredTasks.length === 0 ? (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#8a8a8a",
                            paddingTop: 4,
                          }}
                        >
                          No tasks here yet. Add something so small that it feels
                          almost too easy.
                        </div>
                      ) : (
                        filteredTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`task-item ${task.completed ? "completed" : ""
                              }`}
                            onClick={() => handleToggleTask(task.id)}
                          >
                            <div className="task-bullet"></div>
                            <div className="task-body">
                              <div className="task-title">{task.text}</div>
                              <div className="task-meta-row">
                                <span className="task-tag">{task.category}</span>
                                {task.completed && (
                                  <span className="task-status">
                                    +20 XP earned
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <form className="task-form" onSubmit={handleAddTask}>
                      <input
                        className="task-input"
                        placeholder="Add a tiny task (e.g. ‘Read 2 pages of Chemistry’)"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                      />
                      <select
                        className="task-select"
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value)}
                      >
                        <option value="Study">Study</option>
                        <option value="Health">Health</option>
                        <option value="Mind">Mind</option>
                      </select>
                      <button className="btn-primary" type="submit">
                        <i className="ri-add-line"></i>
                        Add
                      </button>
                    </form>
                  </div>

                  {/* REELS RESISTANCE */}
                  <div className="card">
                    <div className="card-header-row">
                      <div>
                        <div className="card-title">
                          <i className="ri-smartphone-line"></i>
                          Reels / Shorts Resistance
                        </div>
                        <div className="card-sub">
                          When you almost open Reels but stop yourself, record it here.
                        </div>
                      </div>
                      <div className="badge-soft">
                        <i className="ri-thumb-up-line"></i>
                        +10 XP per resist
                      </div>
                    </div>

                    <div className="distraction-main">
                      <p>
                        Each time you gently close Reels/Shorts instead of
                        scrolling, you&apos;re rewiring your brain. Tap the button
                        below to celebrate that tiny, powerful decision.
                      </p>
                      <div className="distraction-counter-row">
                        <div className="d-counter-block">
                          <div className="d-counter">
                            {distractionsResisted}
                          </div>
                          <div className="d-sub">
                            times resisted today
                          </div>
                          <div className="d-progress">
                            <div
                              className="d-progress-inner"
                              style={{
                                width: `${Math.min(
                                  100,
                                  distractionsResisted * 20
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={handleDistractionResist}
                        >
                          <i className="ri-shut-down-line"></i>
                          I closed Reels
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* WELLNESS / JOURNAL */}
                  <div className="card">
                    <div className="card-header-row">
                      <div>
                        <div className="card-title">
                          <i className="ri-brain-line"></i>
                          Mind & Mood Companion
                        </div>
                        <div className="card-sub">
                          A small corner for your thoughts between study blocks.
                        </div>
                      </div>
                      <div className="badge-soft">
                        <i className="ri-lock-2-line"></i>
                        Stays on your device
                      </div>
                    </div>

                    <ul className="tips-list">
                      {WELLNESS_PROMPTS.map((p, index) => (
                        <li key={index} className="tip-item">
                          <i className="ri-sparkles-line"></i>
                          <div>
                            <span className="tip-label">{p.label}: </span>
                            <span>{p.body}</span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <textarea
                      className="journal-area"
                      placeholder="Write anything: worries, small wins, what’s on your mind. No judgement, no marks."
                      value={journal}
                      onChange={(e) => setJournal(e.target.value)}
                    ></textarea>

                    <div className="footer-note">
                      Even a few honest lines can lighten your chest before the
                      next study block.
                    </div>
                  </div>
                </section>
              </section>
            </main>
          </div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);