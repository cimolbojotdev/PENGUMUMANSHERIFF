import { useEffect, useState } from "react";
import logo from "./assets/logo/sheriff.png";
import {
  ArrowUpRight,
  BookOpen,
  Calculator,
  Check,
  Clipboard,
  FileText,
  Menu,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  laws,
  templateCategories,
  templateNavigation,
  templateSubcategories,
  templates,
} from "./data";

let clickAudioContext;

function playClickSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  clickAudioContext ||= new AudioContext();
  if (clickAudioContext.state === "suspended") clickAudioContext.resume();

  const oscillator = clickAudioContext.createOscillator();
  const gain = clickAudioContext.createGain();
  const startTime = clickAudioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(720, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(420, startTime + 0.045);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.015, startTime + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.06);

  oscillator.connect(gain);
  gain.connect(clickAudioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.065);
}

const tools = [
  {
    id: "templates",
    label: "Template Pengumuman",
    icon: FileText,
  },
  {
    id: "calculator",
    label: "Kalkulator Pasal",
    icon: Calculator,
  },
];
function formatJedaTime(value) {
  const match = String(value || "").match(/(\d+)\s*menit/);
  if (!match) return value;
  const minutes = parseInt(match[1], 10);
  const target = new Date(Date.now() + minutes * 60000);
  const hh = String(target.getHours()).padStart(2, "0");
  const mm = String(target.getMinutes()).padStart(2, "0");
  return `${value} (${hh}.${mm})`;
}

function Emblem({ size = 36 }) {
  return (
    <img
      src={logo}
      alt="Sheriff Logo"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
function CopyButton({ text, label = "Salin" }) {
  const [state, setState] = useState("idle"); // idle | copied | error
  const copy = async () => {
    const value = String(text ?? "");
    if (!value) return;
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok) {
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    setState(ok ? "copied" : "error");
    setTimeout(() => setState("idle"), 1800);
  };
  return (
    <button className={`copy-button${state === "copied" ? " copied" : ""}`} type="button" onClick={copy}>
      {state === "copied" ? (
        <>
          <Check size={14} /> Berhasil Disalin
        </>
      ) : state === "error" ? (
        <>
          <X size={14} /> Gagal Menyalin
        </>
      ) : (
        <>
          <Clipboard size={14} /> {label}
        </>
      )}
    </button>
  );
}
function Header({ view, setView, menuOpen, setMenuOpen }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const update = () => setTime(fmt.format(new Date()).replace(/\./g, ":"));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <header className="header">
      <div className="wrap header-inner">
        <button
          className="brand"
          onClick={() => {
            setView("home");
            setMenuOpen(false);
          }}
        >
          <Emblem />
          <span>
            <strong>SHERIFF</strong>
            <small>ROXWOOD KINGDOM</small>
          </span>
        </button>
        <nav className={menuOpen ? "nav open" : "nav"}>
          {tools.map((tool) => (
            <button
              className={view === tool.id ? "nav-link active" : "nav-link"}
              key={tool.id}
              onClick={() => {
                setView(tool.id);
                setMenuOpen(false);
              }}
            >
              {tool.label}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <span className="wib">
            <i /> {time || "00:00:00"} WIB
          </span>
          <button
            className="menu"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Shell({ children, title, subtitle }) {
  return (
    <main className="wrap workspace">
      <div className="page-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </main>
  );
}
function Home({ setView }) {
  return (
    <main className="wrap home-simple">
      <div className="home-simple-inner">
        <div className="logo-glow-container">
          <div className="logo-glow" />
          <Emblem size={160} />
        </div>
        <span className="kicker-simple">SHERIFF KERAJAAN ROXWOOD</span>
        <h1>Roxwood Sheriff</h1>
        <p className="subtitle-simple">Sistem internal terintegrasi untuk pembuatan template pengumuman dan kalkulasi pasal.</p>
        <div className="home-simple-buttons">
          {tools.map((tool) => (
            <button
              className="home-simple-btn"
              key={tool.id}
              onClick={() => setView(tool.id)}
            >
              <div className="btn-icon-wrapper">
                <tool.icon size={24} strokeWidth={1.8} />
              </div>
              <div className="btn-content">
                <span className="btn-title">{tool.label}</span>
                <span className="btn-desc">
                  {tool.id === "templates" 
                    ? "Buat format pengumuman resmi dengan cepat" 
                    : "Hitung denda, pasal, dan masa tahanan otomatis"}
                </span>
              </div>
              <ArrowUpRight className="btn-arrow" size={18} />
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
function TemplateAccordionView() {
  const [category, setCategory] = useState("Perampokan");
  const [subcategory, setSubcategory] = useState("Status Warung");
  const [openId, setOpenId] = useState(null);
  const [values, setValues] = useState({});
  const navigation = templateNavigation[category] || [];
  const selectCategory = (item) => {
    const children = templateNavigation[item] || [];
    setCategory(item);
    setSubcategory(children.length ? children[0] : item);
    setOpenId(null);
    setValues({});
  };
  const selectSubcategory = (item) => {
    setSubcategory(item);
    setOpenId(null);
  };
  const allowed = templateSubcategories[subcategory || category];
  const list = templates.filter(
    (item) => item.category === category && (!allowed || allowed.includes(item.id)),
  );
  const toggle = (item) => {
    setOpenId(openId === item.id ? null : item.id);
  };
  const renderBody = (item) => {
    const filled = item.body.replace(
      /{{(.*?)}}/g,
      (_, key) => {
        const k = key.trim();
        const v = values[k];
        if ((k === "jeda" || k === "waktu") && v) return formatJedaTime(v);
        return v || "....";
      },
    );
    // Keep /police or /policer prefix lowercase, uppercase the rest
    const match = filled.match(/^(\/\w+)([\s\S]*)$/);
    if (match) return match[1] + match[2].toUpperCase();
    return filled.toUpperCase();
  };
  return (
    <Shell
      title="Template Pengumuman"
      subtitle="Pilih kategori, buka satu template, isi informasi yang diperlukan, lalu salin hasilnya."
    >
      <div className="template-layout">
        <aside className="side-panel template-sidebar">
          <div className="panel-label">Kategori Pengumuman</div>
          <div className="nested-category-list">
            {templateCategories.map((item) => (
              <button
                className={
                  category === item ? "category-parent active" : "category-parent"
                }
                key={item}
                onClick={() => selectCategory(item)}
              >
                <span>{item}</span>
              </button>
            ))}
          </div>
        </aside>
        <section className="template-workspace">
          <div className="template-workspace-head">
            <div>
              <span className="panel-label">
                {(subcategory || category).toUpperCase()}
              </span>
              <h2>{subcategory || category}</h2>
              <p>
                {list.length
                  ? "Pilih berita yang ingin digunakan."
                  : "Belum ada template pada submenu ini."}
              </p>
            </div>
          </div>
          {navigation.length > 0 && (
            <div className="submenu-buttons">
              {navigation.map((child) => (
                <button
                  className={
                    subcategory === child ? "submenu-btn active" : "submenu-btn"
                  }
                  key={child}
                  onClick={() => selectSubcategory(child)}
                >
                  {child}
                </button>
              ))}
            </div>
          )}
          <div className="template-accordion">
            {category === "Tutorial" ? (
              <div className="tutorial-page">
                <div className="tutorial-text-dizzy">
                  <span className="dizzy-echo echo-1">YAKALI HARUS DI AJARIN</span>
                  <span className="dizzy-echo echo-2">YAKALI HARUS DI AJARIN</span>
                  <span className="dizzy-echo echo-3">YAKALI HARUS DI AJARIN</span>
                  <span className="dizzy-echo echo-4">YAKALI HARUS DI AJARIN</span>
                  <span className="dizzy-main">YAKALI HARUS DI AJARIN</span>
                </div>
                <div className="tutorial-text-dizzy tutorial-text-dizzy-sub">
                  <span className="dizzy-echo echo-1">malu dong</span>
                  <span className="dizzy-echo echo-2">malu dong</span>
                  <span className="dizzy-echo echo-3">malu dong</span>
                  <span className="dizzy-echo echo-4">malu dong</span>
                  <span className="dizzy-main">malu dong</span>
                </div>
              </div>
            ) : (
              list.map((item) => {
              const isOpen = openId === item.id;
              return (
                <article
                  className={
                    isOpen ? "announcement-item open" : "announcement-item"
                  }
                  key={item.id}
                >
                  <button
                    className="announcement-trigger"
                    onClick={() => toggle(item)}
                    aria-expanded={isOpen}
                  >
                    <span>
                      <small>{category.toUpperCase()}</small>
                      <strong>{item.name}</strong>
                    </span>
                    <span className="announcement-chevron">
                      {isOpen ? "⌃" : "⌄"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="announcement-content">
                      <p className="announcement-description">
                        {item.description}
                      </p>
                      <div className="template-inputs">
                        {item.fields.map((field) => (
                          <label key={field.key}>
                            {field.label}
                            {field.type === "select" ? (
                              <select
                                value={values[field.key] || ""}
                                onChange={(event) =>
                                  setValues({
                                    ...values,
                                    [field.key]: event.target.value,
                                  })
                                }
                              >
                                <option value="">{field.placeholder}</option>
                                {field.options.map((option) => (
                                  <option value={option} key={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={values[field.key] || ""}
                                onChange={(event) =>
                                  setValues({
                                    ...values,
                                    [field.key]: event.target.value,
                                  })
                                }
                                placeholder={field.placeholder || `Contoh: ${field.label}`}
                              />
                            )}
                          </label>
                        ))}
                      </div>
                      <div className="template-preview">
                        <div className="preview-label">
                          <span>Preview pengumuman</span>
                          <span className="preview-live">
                            <i /> Live
                          </span>
                        </div>
                        <div className="preview-paper">
                          <span className="preview-channel">
                            ROXWOOD SHERIFF DEPARTMENT
                          </span>
                          <p>{renderBody(item)}</p>
                          <small>Template siap dikirim</small>
                        </div>
                      </div>
                      <div className="template-copy">
                        <span>Pastikan seluruh informasi sudah benar.</span>
                        <CopyButton
                          text={renderBody(item)}
                          label="Salin Teks"
                        />
                      </div>
                    </div>
                  )}
                </article>
              );
            })
            )}
            {category !== "Tutorial" && !list.length && (
              <div className="template-empty">
                <FileText size={24} />
                <strong>Belum ada template</strong>
                <span>
                  Pilih submenu lain untuk melihat pengumuman yang tersedia.
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}
const TemplatesView = TemplateAccordionView;
function money(value) {
  return `$${value.toLocaleString("id-ID")}`;
}
function LawCard({ law, selected, onToggle }) {
  const chosen = selected.some((item) => item.id === law.id);
  return (
    <button
      className={chosen ? "book-law selected" : "book-law"}
      onClick={() => onToggle(law)}
    >
      <span className="law-copy">
        <strong>Pasal {law.article}</strong>
        <span>{law.name}</span>
        <small>{law.category}</small>
      </span>
      <span className="law-values">
        <b>{money(law.fine)}</b>
        <small>
          {law.consequence ||
            (law.jailTime ? `${law.jailTime} Bulan` : "Tanpa hukuman")}
        </small>
      </span>
      <span className="add-law">
        {chosen ? (
          <>
            <Check size={15} /> Dipilih
          </>
        ) : (
          <>
            <ArrowUpRight size={15} /> Tambah
          </>
        )}
      </span>
    </button>
  );
}
function LawBook({
  query,
  setQuery,
  category,
  setCategory,
  selected,
  onToggle,
  onClose,
}) {
  const categories = [
    "Semua",
    "Pelanggaran Ringan",
    "Pelanggaran Sedang",
    "Pelanggaran Berat",
    "Undang Undang Lalu Lintas",
  ];
  const filtered = laws.filter(
    (law) =>
      (category === "Semua" || law.category === category) &&
      `${law.article} ${law.name} ${law.keywords}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="book-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="law-book"
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="book-head">
          <div>
            <span className="kicker">ROXWOOD / LAW DATABASE</span>
            <h2 id="book-title">Daftar Pasal & Pelanggaran</h2>
            <p>Pilih pasal yang ingin ditambahkan ke perhitungan.</p>
          </div>
          <button
            className="close-book"
            aria-label="Tutup daftar pasal"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
        <div className="book-tools">
          <div className="search-input">
            <Search size={18} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pasal atau pelanggaran..."
            />
          </div>
          <div className="book-categories">
            {categories.map((item) => (
              <button
                className={category === item ? "category active" : "category"}
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="book-chapter">
          <span>
            CHAPTER /{" "}
            {category === "Semua" ? "01 - 04" : category.toUpperCase()}
          </span>
          <b>{filtered.length} pasal ditemukan</b>
        </div>
        <div className="book-list">
          {filtered.map((law) => (
            <LawCard
              key={law.id}
              law={law}
              selected={selected}
              onToggle={onToggle}
            />
          ))}
          {!filtered.length && (
            <div className="empty">Pasal tidak ditemukan.</div>
          )}
        </div>
        <div className="book-footer">
          <span>{selected.length} Pasal Dipilih</span>
          <button className="button primary" onClick={onClose}>
            Selesai <Check size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
function TilangOutput({ suspect, officer, date, region, time, cases }) {
  const note = `NAMA          : ${suspect || "..."}\nWILAYAH       : ${region || "..."}\nJAM           : ${time || "..."}\nTANGGAL       : ${date}\nKASUS         : ${cases || "..."}\nPETUGAS       : ${officer || "..."}`;
  return (
    <div className="tilang-outputs">
      <div className="document-card">
        <div className="document-head">
          <strong>Catatan Tilang</strong>
          <CopyButton text={note} />
        </div>
        <textarea readOnly value={note} aria-label="Catatan Tilang" rows="6" />
      </div>
    </div>
  );
}
function CalculatorView() {
  const [mode, setMode] = useState("criminal");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [bookOpen, setBookOpen] = useState(false);
  const [bookQuery, setBookQuery] = useState("");
  const [bookCategory, setBookCategory] = useState("Semua");
  const [selected, setSelected] = useState([]);
  const [dpo, setDpo] = useState(false);
  const [suspect, setSuspect] = useState("");
  const [officer, setOfficer] = useState("");
  const [notes, setNotes] = useState("");
  const [notesManual, setNotesManual] = useState(false);
  const [date, setDate] = useState(() =>
    new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
  );
  const [region, setRegion] = useState("");
  const [time, setTime] = useState("");
  const quickResults = laws
    .filter((law) =>
      `${law.article} ${law.name} ${law.keywords} ${law.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .slice(0, 4);
  const trafficLaws = selected.filter(
    (law) => law.category === "Undang Undang Lalu Lintas",
  );
  const cases = selected.map((item) => item.sheriffDescription).join(", ");
  const trafficCases = trafficLaws
    .map((item) => item.sheriffDescription)
    .join(", ");
  const totalFine = selected.length
    ? Math.max(...selected.map((item) => item.fine))
    : 0;
  const rawMonths = selected.reduce((sum, item) => sum + item.jailTime, 0);
  const totalMonths = Math.min(dpo ? rawMonths * 2 : rawMonths, 60);
  const toggle = (law) =>
    setSelected((current) => {
      const next = current.some((item) => item.id === law.id)
        ? current.filter((item) => item.id !== law.id)
        : [...current, law];
      if (!next.length) {
        setNotes("");
        setNotesManual(false);
      } else if (!notesManual)
        setNotes(
          next.map((item) => item.sheriffDescription).join(", ") + " (SHERIFF)",
        );
      return next;
    });
  const editNotes = (value) => {
    setNotes(value);
    setNotesManual(true);
  };
  const reset = () => {
    setQuery("");
    setCategory("Semua");
    setBookQuery("");
    setBookCategory("Semua");
    setBookOpen(false);
    setSelected([]);
    setDpo(false);
    setSuspect("");
    setOfficer("");
    setNotes("");
    setNotesManual(false);
    setDate(
      new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta" }).format(
        new Date(),
      ),
    );
    setRegion("");
    setTime("");
  };
  const openLawBook = (nextQuery = "") => {
    setBookQuery(nextQuery);
    setBookCategory(
      mode === "traffic" ? "Undang Undang Lalu Lintas" : "Semua",
    );
    setBookOpen(true);
  };
  const result = selected.length
    ? `PASAL:\n${selected.map((item) => `${item.article} — ${item.name}`).join("\n")}\n\nTOTAL DENDA:\n${money(totalFine)}\n\nTOTAL HUKUMAN:\n${totalMonths} Bulan`
    : "Belum ada pasal yang dipilih.";
  return (
    <Shell
      title="Kalkulator Pasal"
      subtitle="Pilih pasal dan hitung total denda serta hukuman."
    >
      <div className="report-fields">
        <label>
          Nama tersangka
          <input
            value={suspect}
            onChange={(event) => setSuspect(event.target.value)}
            placeholder="Contoh: CEYLA V"
          />
        </label>
        <label>
          Nama petugas
          <input
            value={officer}
            onChange={(event) => setOfficer(event.target.value)}
            placeholder="Contoh: SERSAN II RAHMAT"
          />
        </label>
        <label>
          Tanggal
          <input
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label className="dpo-toggle">
          <input
            type="checkbox"
            checked={dpo}
            onChange={(event) => setDpo(event.target.checked)}
          />{" "}
          Status DPO (x2)
        </label>
      </div>
      <div className="calc-tabs">
        <button
          className={mode === "criminal" ? "calc-tab active" : "calc-tab"}
          onClick={() => setMode("criminal")}
        >
          KRIMINAL
        </button>
        <button
          className={mode === "traffic" ? "calc-tab active" : "calc-tab"}
          onClick={() => setMode("traffic")}
        >
          TILANG
        </button>
      </div>
      {mode === "traffic" ? (
        <div className="tilang-layout">
          <section className="tilang-form">
            <div className="panel-label">Data tilang</div>
            <div className="tilang-fields">
              <label>
                Wilayah
                <input
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  placeholder="Contoh: POM ROXWOOD"
                />
              </label>
              <label>
                Jam
                <input
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  placeholder="Contoh: 15.30"
                />
              </label>
            </div>
            <div className="tilang-case">
              <div className="document-head">
                <strong>Kasus / Pelanggaran</strong>
                <button
                  className="copy-button"
                  onClick={() => openLawBook()}
                >
                  <BookOpen size={14} /> Pilih Pasal
                </button>
              </div>
              <p>{trafficCases || "Belum ada kasus tilang dipilih."}</p>
            </div>
            <TilangOutput
              suspect={suspect}
              officer={officer}
              date={date}
              region={region}
              time={time}
              cases={trafficCases}
            />
          </section>
          <aside className="result-panel tilang-summary">
            <div className="panel-label">Ringkasan tilang</div>
            <div className="result-numbers">
              <div>
                <small>Kasus tilang</small>
                <strong>{trafficLaws.length}</strong>
              </div>
              <div>
                <small>Denda tertinggi</small>
                <strong>
                  {trafficLaws.length
                    ? money(Math.max(...trafficLaws.map((item) => item.fine)))
                    : "$0"}
                </strong>
              </div>
              <div>
                <small>Tanggal</small>
                <strong className="date-value">{date}</strong>
              </div>
            </div>
            <p className="muted">
              Pilih pasal lalu lintas melalui daftar pasal untuk mengisi kasus
              secara otomatis.
            </p>
            <button className="button secondary" onClick={reset}>
              Reset Semua Data
            </button>
          </aside>
        </div>
      ) : (
        <div className="calculator-layout">
          <section className="charge-picker">
            <div className="search-input">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari pasal atau pelanggaran..."
              />
            </div>
            {query ? (
              <div className="quick-results">
                <div className="quick-heading">
                  <span>{quickResults.length} hasil ditemukan</span>
                  <button
                    onClick={() => openLawBook(query)}
                  >
                    Lihat semua hasil <ArrowUpRight size={14} />
                  </button>
                </div>
                {quickResults.map((law) => (
                  <LawCard
                    key={law.id}
                    law={law}
                    selected={selected}
                    onToggle={toggle}
                  />
                ))}
              </div>
            ) : (
              <button className="open-book" onClick={() => openLawBook()}>
                <BookOpen size={21} />
                <span>
                  <strong>Buka Daftar Pasal</strong>
                  <small>Browse seluruh pasal seperti katalog peraturan</small>
                </span>
                <b>
                  {selected.length
                    ? `${selected.length} Dipilih`
                    : "Pilih Pasal"}{" "}
                  <ArrowUpRight size={16} />
                </b>
              </button>
            )}
          </section>
          <aside className="result-panel">
            <div className="panel-label">Hasil perhitungan</div>
            <div className="result-numbers">
              <div>
                <small>Total pasal</small>
                <strong>{selected.length}</strong>
              </div>
              <div>
                <small>Denda tertinggi</small>
                <strong>{money(totalFine)}</strong>
              </div>
              <div>
                <small>Masa tahanan</small>
                <strong>
                  {totalMonths} <em>Bulan</em>
                </strong>
              </div>
            </div>
            {dpo && (
              <div className="modifier">
                <Check size={14} /> Status DPO aktif · Hukuman x2 · Maksimal 60
                bulan
              </div>
            )}
            <div className="selected-charges">
              <div className="panel-label">
                Pasal dipilih <span>{selected.length}</span>
              </div>
              {selected.length ? (
                selected.map((law) => (
                  <div className="selected-law" key={law.article}>
                    <span>
                      <strong>
                        {law.article} · {law.name}
                      </strong>
                      <small>
                        {money(law.fine)} ·{" "}
                        {law.consequence ||
                          (law.jailTime
                            ? `${law.jailTime} bulan`
                            : "Tanpa kurungan")}
                      </small>
                    </span>
                    <button
                      onClick={() => toggle(law)}
                      aria-label={`Hapus pasal ${law.article}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="muted">
                  Belum ada pasal, pakai kolom pencarian atau buku pasal untuk pilih pasal.
                </p>
              )}
            </div>
            <div className="generated-docs">
              <div className="document-card">
                <div className="document-head">
                  <strong>Catatan Kriminal</strong>
                  <CopyButton
                    text={`NAMA          : ${suspect || "..."}\nKASUS         : ${cases || "..."}\nDENDA TERTINGGI : ${totalFine ? totalFine.toLocaleString("id-ID") : "0"}\nTANGGAL       : ${date}\nPETUGAS       : ${officer || "..."}`}
                  />
                </div>
                <textarea
                  readOnly
                  value={`NAMA          : ${suspect || "..."}\nKASUS         : ${cases || "..."}\nDENDA TERTINGGI : ${totalFine ? totalFine.toLocaleString("id-ID") : "0"}\nTANGGAL       : ${date}\nPETUGAS       : ${officer || "..."}`}
                  rows="5"
                />
              </div>
              <div className="document-card">
                <div className="document-head">
                  <strong>Depo Barang Bukti</strong>
                  <CopyButton text={`REASON: SITAAN A/N ${suspect || "..."}`} />
                </div>
                <textarea
                  readOnly
                  value={`REASON: SITAAN A/N ${suspect || "..."}`}
                  rows="2"
                />
              </div>
              <div className="document-card">
                <div className="document-head">
                  <strong>Keterangan Pasal (Sheriff)</strong>
                  <CopyButton text={notes} />
                </div>
                <textarea
                  value={notes}
                  onChange={(event) => editNotes(event.target.value)}
                  placeholder="Pilih pasal dulu nanti keterangan nya muncul..."
                  rows="3"
                />
              </div>
            </div>
            <div className="result-actions">
              <CopyButton text={result} label="Salin Hasil" />
              <button className="button secondary" onClick={reset}>
                Reset Semua Data
              </button>
            </div>
          </aside>
        </div>
      )}
      {bookOpen && (
        <LawBook
          query={bookQuery}
          setQuery={setBookQuery}
          category={bookCategory}
          setCategory={setBookCategory}
          selected={mode === "traffic" ? trafficLaws : selected}
          onToggle={toggle}
          onClose={() => setBookOpen(false)}
        />
      )}
    </Shell>
  );
}
export default function App() {
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleButtonClick = (event) => {
      if (event.target.closest("button")) playClickSound();
    };

    document.addEventListener("click", handleButtonClick);
    return () => document.removeEventListener("click", handleButtonClick);
  }, []);
  const content =
    view === "templates" ? (
      <TemplatesView />
    ) : view === "calculator" ? (
      <CalculatorView />
    ) : (
      <Home setView={setView} />
    );
  return (
    <>
      <Header
        view={view}
        setView={setView}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      {content}
      <footer className="app-footer">ty ty idp - Roys m hawkins</footer>
    </>
  );
}
