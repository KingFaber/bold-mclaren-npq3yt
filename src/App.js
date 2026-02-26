import { useState, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { jsPDF } from "jspdf";

// --- CONFIGURAZIONE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCTODWinABcuz-HP9quZ6AXRg3AYTmchUc",
  authDomain: "ss-e3346.firebaseapp.com",
  projectId: "ss-e3346",
  storageBucket: "ss-e3346.firebasestorage.app",
  messagingSenderId: "147555007132",
  appId: "1:147555007132:web:a141402a417f6a71f4cb59",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const dataRef = doc(db, "associazione", "dati_con_login");

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:     #F7F4EE;
  --card:   #FFFDF8;
  --ink:    #1C1A16;
  --muted:  #7A7162;
  --line:   #E2DDD3;
  --gold:   #B8860B;
  --gold2:  #D4A017;
  --green:  #2D6A4F;
  --red:    #8B2020;
  --amber:  #C57A00;
  --wa:     #25D366;
  --radius: 12px;
  --shadow: 0 2px 16px rgba(28,26,22,.10);
}

body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--ink); min-height:100vh; }
h1,h2,h3 { font-family: 'Playfair Display', serif; }
.app { max-width: 480px; margin: 0 auto; min-height:100vh; padding-bottom: 90px; }

.topbar { background: var(--ink); color: #F7F4EE; padding: 16px 20px 0; position: sticky; top: 0; z-index: 100; }
.topbar-row { display:flex; align-items:center; justify-content:space-between; padding-bottom:14px; }
.topbar h1 { font-size: 1.3rem; letter-spacing:-.5px; color:#F7F4EE; }
.topbar .sub { font-size:.75rem; opacity:.55; font-family:'DM Sans'; font-weight:300; }

.tabs { display:flex; background: var(--ink); border-top:1px solid #2a2822; }
.tabs button {
  flex:1; padding:10px 4px; background:none; border:none; color:#888;
  font-family:'DM Sans'; font-size:.72rem; cursor:pointer; letter-spacing:.4px;
  text-transform:uppercase; transition: color .2s; border-bottom: 2px solid transparent;
}
.tabs button.active { color: var(--gold2); border-bottom-color: var(--gold2); }

.card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); margin: 16px; padding: 20px; border: 1px solid var(--line); }

.badge { display:inline-block; padding:2px 10px; border-radius:20px; font-size:.7rem; font-weight:500; letter-spacing:.4px; text-transform:uppercase; }
.badge-green  { background:#d7f0e6; color: var(--green); }
.badge-amber  { background:#fdf0d5; color: var(--amber); }
.badge-red    { background:#fde8e8; color: var(--red); }
.badge-gray   { background:#ede9e0; color: var(--muted); }
.badge-orange { background:#fdebd0; color:#c0580a; }

.btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:10px 18px; border-radius:8px; font-family:'DM Sans'; font-size:.9rem; font-weight:500; cursor:pointer; border:none; transition: all .18s; }
.btn-primary { background: var(--ink); color:#F7F4EE; }
.btn-primary:hover { background:#333; }
.btn-gold { background: var(--gold); color:#fff; }
.btn-gold:hover { background: var(--gold2); }
.btn-outline { background:transparent; border:1.5px solid var(--line); color:var(--ink); }
.btn-outline:hover { border-color: var(--gold); color:var(--gold); }
.btn-green { background: var(--green); color:#fff; }
.btn-green:hover { background:#245a40; }
.btn-wa { background: var(--wa); color:#fff; }
.btn-wa:hover { background:#1ebe5d; }
.btn-red { background: var(--red); color:#fff; }
.btn-red:hover { background:#6e1a1a; }
.btn-sm { padding:6px 12px; font-size:.8rem; }
.btn-xs { padding:4px 9px; font-size:.73rem; }
.btn-full { width:100%; }
.btn-icon { width:30px; height:30px; border-radius:50%; padding:0; flex-shrink:0; font-size:.8rem; }

.send-row { display:flex; gap:8px; margin-top:12px; }
.send-row .btn { flex:1; }

.rsvp-row { display:flex; gap:8px; margin-top:10px; }
.rsvp-btn { flex:1; padding:12px 6px; border-radius:8px; border:2px solid var(--line); background:transparent; font-family:'DM Sans'; font-size:.82rem; cursor:pointer; transition: all .18s; display:flex; flex-direction:column; align-items:center; gap:2px; }
.rsvp-btn.yes   { border-color: var(--green); background:#f0faf5; color: var(--green); font-weight:600; }
.rsvp-btn.no    { border-color: var(--red);   background:#fff5f5; color: var(--red);   font-weight:600; }

input, textarea, select { width:100%; padding:10px 12px; border-radius:8px; border:1.5px solid var(--line); background: var(--bg); font-family:'DM Sans'; font-size:.9rem; color: var(--ink); outline:none; transition: border-color .18s; resize:vertical; }
input:focus, textarea:focus, select:focus { border-color: var(--gold); }
label { font-size:.8rem; color:var(--muted); font-weight:500; display:block; margin-bottom:4px; margin-top:12px; }

.divider { height:1px; background: var(--line); margin: 16px 0; }

.avatar { width:36px; height:36px; border-radius:50%; background: var(--gold); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:.85rem; flex-shrink:0; }
.avatar.suspended { background: var(--muted); }

.person-row { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--line); }
.person-row:last-child { border-bottom:none; }
.person-row.suspended { opacity:.55; }

.section-title { font-family:'Playfair Display'; font-size:1.05rem; color:var(--ink); margin-bottom:4px; }
.section-sub { font-size:.78rem; color:var(--muted); }

.empty { text-align:center; padding:40px 20px; color:var(--muted); }
.empty .icon { font-size:2.5rem; margin-bottom:12px; }

.stat-row { display:flex; gap:10px; margin-top:12px; }
.stat-box { flex:1; background:var(--bg); border-radius:8px; padding:12px; text-align:center; border:1px solid var(--line); }
.stat-num { font-family:'Playfair Display'; font-size:1.5rem; color:var(--ink); }
.stat-lbl { font-size:.7rem; color:var(--muted); text-transform:uppercase; letter-spacing:.5px; }

.overlay { position:fixed; inset:0; background:rgba(28,26,22,.55); z-index:200; display:flex; align-items:flex-end; justify-content:center; }
.modal { background: var(--card); border-radius:20px 20px 0 0; width:100%; max-width:480px; padding:24px 20px 40px; max-height:92vh; overflow-y:auto; }
.modal h2 { margin-bottom:4px; font-size:1.2rem; }
.handle { width:40px; height:4px; border-radius:2px; background:var(--line); margin:0 auto 20px; }

.switch { position:relative; width:42px; height:24px; }
.switch input { opacity:0; width:0; height:0; }
.slider { position:absolute; inset:0; border-radius:24px; background:var(--line); transition:.3s; cursor:pointer; }
.slider::before { content:''; position:absolute; width:18px;height:18px; border-radius:50%; left:3px; bottom:3px; background:#fff; transition:.3s; }
.switch input:checked + .slider { background: var(--green); }
.switch input:checked + .slider::before { transform:translateX(18px); }
.switch-row { display:flex; align-items:center; justify-content:space-between; padding:8px 0; }

.gold-line { width:40px; height:3px; background:var(--gold); margin-bottom:14px; border-radius:2px; }

.agenda-item { display:flex; align-items:center; gap:8px; padding:7px 10px; background: var(--bg); border-radius:8px; border:1px solid var(--line); margin-bottom:6px; }
.agenda-num { width:22px; height:22px; border-radius:50%; background:var(--gold); color:#fff; font-size:.7rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.agenda-item input { border:none; background:transparent; padding:0; font-size:.88rem; flex:1; outline:none; }
.drag-handle { cursor:grab; color:var(--muted); font-size:1rem; flex-shrink:0; user-select:none; }

.user-pill { display:flex; align-items:center; gap:6px; background:#2a2822; border-radius:20px; padding:4px 10px 4px 4px; cursor:pointer; border:none; color:#ccc; font-family:'DM Sans'; font-size:.75rem; transition:.2s;}
.user-pill:hover { background: #3d3930; color:#fff;}
.user-pill .mini-av { width:22px; height:22px; border-radius:50%; background:var(--gold2); color:#fff; font-size:.65rem; font-weight:700; display:flex; align-items:center; justify-content:center; }

.info-box { background:#fdf8ec; border:1px solid #e8d89a; border-radius:8px; padding:12px 14px; font-size:.82rem; color:var(--amber); margin-bottom:12px; }
.privacy-box { background:transparent; border:1px solid var(--line); border-radius:8px; padding:12px 14px; font-size:.75rem; color:var(--muted); margin-top:24px; line-height:1.4; }
.warn-box  { background:#fff0f0; border:1px solid #f0c0c0; border-radius:8px; padding:12px 14px; font-size:.82rem; color:var(--red); margin-bottom:12px; }

.action-menu { display:flex; flex-direction:column; gap:6px; }
.action-item { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:8px; border:1px solid var(--line); cursor:pointer; background:var(--bg); font-size:.88rem; }
.action-item:hover { border-color:var(--gold); }
.action-item .ai-icon { font-size:1.2rem; width:28px; text-align:center; }
.member-actions { display:flex; gap:4px; flex-shrink:0; }

.toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--ink); color:#fff; padding:10px 22px; border-radius:20px; font-size:.85rem; z-index:300; white-space:nowrap; animation: fadeup .3s ease; box-shadow: 0 4px 20px rgba(0,0,0,.3); }
@keyframes fadeup { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
`;

const SEED_MEMBERS = [
  {
    id: "m1",
    name: "Amministratore",
    role: "admin",
    email: "",
    phone: "",
    status: "active",
    username: "admin",
    password: "admin123",
    degree: "Maestro",
    masonicRole: "Segretario",
  },
];
const SEED_ASSOCS = [];

const DEFAULT_SETTINGS = {
  assocName: "R.L. La Nostra Associazione",
  assocIcon: "⚜",
  pdfHeader: "CONVOCAZIONE UFFICIALE",
  masterName: "V.LE F.LLO GIUSEPPE SCANU",
  secretaryName: "M.M. MAURO BULLITTA",
  msgFooter: "Sinceramente e Fraternamente",
  founders: "",
  pastMasters: "",
  defaultAgenda: [
    "Apertura dei Lavori",
    "Giustificazione dei Fratelli assenti",
    "Chiusura Lavori di Loggia",
  ],
};

function nextMonday() {
  const d = new Date();
  const diff = d.getDay() === 0 ? 1 : 8 - d.getDay();
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

const SEED_EVENT = {
  id: "e1",
  date: nextMonday(),
  time: "20:00",
  place: "Casa Massonica",
  agenda: ["Apertura dei Lavori"],
  dinnerEnabled: true,
  dinnerNote: "",
  status: "open",
  createdAt: new Date().toISOString(),
};

const initials = (n) =>
  n
    ? n
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";
const fmtDate = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const fmtShort = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
  });
const cleanPhone = (p) => p.replace(/[\s\-().]/g, "");

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("evento");

  const [members, setMbrs] = useState([]);
  const [assocs, setAss] = useState([]);
  const [events, setEvts] = useState([]);
  const [rsvps, setRsvps] = useState({});
  const [grsvps, setGrsvps] = useState({});
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const [currentUser, setCU] = useState(null);
  const [loginU, setLoginU] = useState("");
  const [loginP, setLoginP] = useState("");

  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragIdx, setDragIdx] = useState(null);

  const [editMember, setEditMember] = useState(null);
  const [verbaleEvent, setVerbaleEvent] = useState(null);
  const [vf, setVf] = useState({ notes: [], closingNote: "", link: "" });

  const [ne, setNe] = useState({
    date: nextMonday(),
    time: "20:00",
    place: "",
    agendaItems: [""],
    dinnerEnabled: true,
    dinnerNote: "",
  });
  const [newMember, setNm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member",
    username: "",
    password: "",
    degree: "",
    masonicRole: "",
  });
  const [newAssoc, setNa] = useState({
    name: "",
    referente: "",
    email: "",
    phone: "",
  });
  const [guestForm, setGf] = useState({
    assocId: "",
    meeting: "yes",
    dinner: "no",
    count: 1,
  });

  const [myProfile, setMyProfile] = useState({});

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(dataRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.members) setMbrs(data.members);
        if (data.assocs) setAss(data.assocs);
        if (data.events) setEvts(data.events);
        if (data.rsvps) setRsvps(data.rsvps);
        if (data.grsvps) setGrsvps(data.grsvps);
        if (data.settings)
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      } else {
        setDoc(dataRef, {
          members: SEED_MEMBERS,
          assocs: SEED_ASSOCS,
          events: [SEED_EVENT],
          rsvps: {},
          grsvps: {},
          settings: DEFAULT_SETTINGS,
        });
      }
      setLoading(false);
    });

    const localUser = localStorage.getItem("cv3_cu");
    if (localUser) setCU(JSON.parse(localUser));

    return () => unsubscribe();
  }, []);

  const saveMbrs = (v) => updateDoc(dataRef, { members: v });
  const saveAss = (v) => updateDoc(dataRef, { assocs: v });
  const saveEvts = (v) => updateDoc(dataRef, { events: v });
  const saveRsvps = (v) => updateDoc(dataRef, { rsvps: v });
  const saveGrsvps = (v) => updateDoc(dataRef, { grsvps: v });
  const saveSettings = (v) => updateDoc(dataRef, { settings: v });

  const saveCU = (v) => {
    if (v) {
      setCU(v);
      localStorage.setItem("cv3_cu", JSON.stringify(v));
    } else {
      setCU(null);
      localStorage.removeItem("cv3_cu");
      setTab("evento");
    }
  };

  const doLogin = () => {
    const user = members.find(
      (m) => m.username === loginU && m.password === loginP
    );
    if (user) {
      if (user.status === "suspended") {
        showToast("❌ Il tuo account è in Sonno.");
        return;
      }
      saveCU(user);
      setLoginU("");
      setLoginP("");
      showToast(`👋 Bentornato ${user.name}`);
    } else {
      showToast("❌ Nome utente o password errati");
    }
  };

  const latestOpen = events.filter((e) => e.status === "open").slice(-1)[0];
  const latestEvent = latestOpen || events.slice(-1)[0];
  const activeMembers = members.filter((m) => m.status !== "suspended");

  const getRsvp = (eid, mid) =>
    rsvps[`${eid}_${mid}`] || { meeting: "yes", dinner: "no" };
  const getGRsvp = (eid, aid) =>
    grsvps[`${eid}_${aid}`] || { meeting: "yes", dinner: "no", count: 1 };

  const setRsvp = (eid, mid, field, val) => {
    const k = `${eid}_${mid}`;
    const prev = getRsvp(eid, mid);
    saveRsvps({ ...rsvps, [k]: { ...prev, [field]: val } });
  };
  const setGRsvp = (eid, aid, data) => {
    saveGrsvps({ ...grsvps, [`${eid}_${aid}`]: data });
  };

  const statsFor = (ev) => {
    if (!ev) return { meetYes: 0, dinYes: 0, gMeet: 0, gDin: 0 };
    const meetYes = activeMembers.filter(
      (m) => getRsvp(ev.id, m.id).meeting === "yes"
    ).length;
    const dinYes = activeMembers.filter(
      (m) => getRsvp(ev.id, m.id).dinner === "yes"
    ).length;
    const gMeet = assocs.reduce((s, a) => {
      const r = getGRsvp(ev.id, a.id);
      return s + (r.meeting === "yes" ? r.count || 1 : 0);
    }, 0);
    const gDin = assocs.reduce((s, a) => {
      const r = getGRsvp(ev.id, a.id);
      return s + (r.dinner === "yes" ? r.count || 1 : 0);
    }, 0);
    return { meetYes, dinYes, gMeet, gDin };
  };

  const buildMsgText = (ev, isUpdate = false) => {
    const agendaLines = (ev.agenda || [])
      .map((p, i) => `${i + 1}. ${p}`)
      .join("\n");
    const appUrl = window.location.href;
    const title = isUpdate
      ? "⚠️ AGGIORNAMENTO CONVOCAZIONE"
      : `${settings.assocIcon} CONVOCAZIONE ${settings.assocIcon}`;

    let msg = `${title}\n\n`;
    msg += `Caro Fratello,\n`;
    msg += `per comando del Maestro Venerabile\n`;
    msg += `*${settings.masterName || "M.V."}*\n`;
    msg += `sei invitato a partecipare alla Riunione Rituale che si terrà\n`;
    msg += `il giorno ${fmtDate(ev.date)} alle ore ${ev.time}\n`;
    msg += `presso ${ev.place}\n\n`;
    msg += `*AGENDA DEI LAVORI${isUpdate ? " (AGGIORNATA)" : ""}*\n`;
    msg += `${agendaLines}\n`;

    if (ev.dinnerEnabled) {
      msg += `\n🍽 Al termine è prevista l'Agape.\n`;
      if (ev.dinnerNote) msg += `${ev.dinnerNote}\n`;
    }

    msg += `\n👉 Conferma la tua presenza:\n${appUrl}\n\n`;
    msg += `${settings.msgFooter || "Sinceramente e Fraternamente"}\n`;
    msg += `Il Segretario\n`;
    msg += `${settings.secretaryName || "Segretario"}`;

    return msg;
  };

  const openEmail = (ev, isUpdate = false) => {
    const soci = activeMembers
      .filter((m) => m.email)
      .map((m) => m.email)
      .join(",");
    const gEmails = assocs
      .filter((a) => a.email)
      .map((a) => a.email)
      .join(",");
    const toAll = [soci, gEmails].filter(Boolean).join(",");
    const subject = `${
      isUpdate ? "VARIAZIONE OdG: " : ""
    }Convocazione ${fmtShort(ev.date)} - ${settings.assocName}`;
    const body = buildMsgText(ev, isUpdate)
      .replace(/\*/g, "")
      .replace(/_/g, "");
    window.open(
      `mailto:${toAll}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
    showToast("📧 Client email aperto!");
  };

  const openWhatsAppAll = (ev, isUpdate = false) => {
    const phones = [
      ...activeMembers.filter((m) => m.phone).map((m) => cleanPhone(m.phone)),
      ...assocs.filter((a) => a.phone).map((a) => cleanPhone(a.phone)),
    ].filter(Boolean);
    if (phones.length === 0) {
      showToast("⚠ Nessun numero WhatsApp registrato");
      return;
    }
    phones.forEach((p, i) => {
      setTimeout(() => {
        const text = buildMsgText(ev, isUpdate);
        window.open(
          `https://wa.me/${p.replace("+", "")}?text=${encodeURIComponent(
            text
          )}`,
          "_blank"
        );
      }, i * 600);
    });
    showToast(`📲 Apertura WhatsApp per ${phones.length} contatti…`);
  };

  const handleDownloadPDF = (ev) => {
    const doc = new jsPDF();

    const checkPage = (currentY, addY) => {
      if (currentY + addY > 280) {
        doc.addPage();
        return 20;
      }
      return currentY;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text((settings.assocName || "Associazione").toUpperCase(), 105, 15, {
      align: "center",
    });

    doc.setFontSize(18);
    doc.text(settings.pdfHeader || "CONVOCAZIONE UFFICIALE", 105, 25, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Caro Fratello,", 20, 40);
    doc.text("per comando del Maestro Venerabile", 20, 47);

    doc.setFont("helvetica", "bold");
    doc.text(settings.masterName || "M.V.", 20, 54);

    doc.setFont("helvetica", "normal");
    doc.text(
      "sei invitato a partecipare alla Riunione Rituale che si terrà",
      20,
      61
    );

    doc.setFont("helvetica", "bold");
    doc.text(`il giorno ${fmtDate(ev.date)} alle ore ${ev.time}`, 20, 68);
    doc.text(`presso ${ev.place}`, 20, 75);

    doc.setLineWidth(0.5);
    doc.line(20, 82, 190, 82);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("AGENDA DEI LAVORI", 20, 93);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let y = 103;
    (ev.agenda || []).forEach((item, i) => {
      y = checkPage(y, 15);
      const testoDiviso = doc.splitTextToSize(`${i + 1}. ${item}`, 170);
      doc.text(testoDiviso, 20, y);
      y += testoDiviso.length * 7;
    });

    if (ev.dinnerEnabled) {
      y = checkPage(y, 20);
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Agape:", 20, y);
      doc.setFont("helvetica", "normal");
      y += 7;
      const noteCena = doc.splitTextToSize(
        ev.dinnerNote || "Al termine dei lavori è prevista l'agape.",
        170
      );
      doc.text(noteCena, 20, y);
    }

    y = checkPage(y, 30);
    y += 20;
    doc.setFont("helvetica", "italic");
    doc.text(settings.msgFooter || "Sinceramente e Fraternamente", 190, y, {
      align: "right",
    });
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Il Segretario", 190, y, { align: "right" });
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text(settings.secretaryName || "Segretario", 190, y, {
      align: "right",
    });

    if (settings.founders || settings.pastMasters) {
      y = checkPage(y, 40);
      y += 15;
      doc.setFontSize(9);
      if (settings.founders) {
        doc.setFont("helvetica", "bold");
        doc.text("Membri Fondatori:", 20, y);
        doc.setFont("helvetica", "normal");
        const fLines = doc.splitTextToSize(settings.founders, 170);
        y += 5;
        doc.text(fLines, 20, y);
        y += fLines.length * 4 + 2;
      }
      if (settings.pastMasters) {
        y = checkPage(y, 15);
        doc.setFont("helvetica", "bold");
        doc.text("Past Master:", 20, y);
        doc.setFont("helvetica", "normal");
        const pmLines = doc.splitTextToSize(settings.pastMasters, 170);
        y += 5;
        doc.text(pmLines, 20, y);
      }
    }

    doc.save(`Convocazione_${ev.date}.pdf`);
    showToast("📄 PDF scaricato con successo!");
  };

  const handleDownloadPresenzePDF = (ev) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text((settings.assocName || "Associazione").toUpperCase(), 105, 15, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text("FOGLIO PRESENZE E FIRME", 105, 25, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Riunione Rituale del ${fmtDate(ev.date)} - Ore ${ev.time}`,
      105,
      33,
      { align: "center" }
    );

    let y = 50;
    doc.setFont("helvetica", "bold");
    doc.text("Fratelli Confermati (Hanno risposto Sì):", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    const yesMembers = activeMembers.filter(
      (m) => getRsvp(ev.id, m.id).meeting === "yes"
    );

    if (yesMembers.length === 0) {
      doc.text("Nessun Fratello ha confermato la presenza.", 20, y);
      y += 10;
    } else {
      yesMembers.forEach((m, i) => {
        const r = getRsvp(ev.id, m.id);
        const cenaInfo = ev.dinnerEnabled
          ? ` (Agape: ${r.dinner === "yes" ? "Sì" : "No"})`
          : "";
        doc.text(`${i + 1}. ${m.name}${cenaInfo}`, 20, y);
        doc.line(100, y, 190, y);
        y += 10;

        if (y > 275) {
          doc.addPage();
          y = 20;
        }
      });
    }

    y += 10;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Ospiti:", 20, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    const yesAssocs = assocs.filter(
      (a) => getGRsvp(ev.id, a.id).meeting === "yes"
    );
    if (yesAssocs.length === 0) {
      doc.text("Nessun ospite previsto.", 20, y);
    } else {
      yesAssocs.forEach((a) => {
        const r = getGRsvp(ev.id, a.id);
        const cenaInfo = ev.dinnerEnabled
          ? ` - Agape: ${r.dinner === "yes" ? "Sì" : "No"}`
          : "";
        doc.text(`- ${a.name} (${r.count || 1} persona/e)${cenaInfo}`, 20, y);
        y += 8;
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save(`Foglio_Presenze_${ev.date}.pdf`);
    showToast("📄 Foglio Presenze generato!");
  };

  const handleDownloadVerbalePDF = (ev, verbaleData) => {
    const doc = new jsPDF();
    let y = 20;
    const checkPage = (addY) => {
      if (y + addY > 280) {
        doc.addPage();
        y = 20;
      }
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text((settings.assocName || "Associazione").toUpperCase(), 105, y, {
      align: "center",
    });
    y += 10;

    doc.setFontSize(16);
    doc.text("VERBALE DELLA RIUNIONE", 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Data: ${fmtDate(ev.date)} - Ore: ${ev.time} - Luogo: ${ev.place}`,
      105,
      y,
      { align: "center" }
    );
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;

    const presentList = activeMembers
      .filter((m) => getRsvp(ev.id, m.id).meeting === "yes")
      .map((m) => m.name)
      .join(", ");
    const absentList = activeMembers
      .filter((m) => getRsvp(ev.id, m.id).meeting === "no")
      .map((m) => m.name)
      .join(", ");

    doc.setFont("helvetica", "bold");
    doc.text("Presenti:", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const pLines = doc.splitTextToSize(presentList || "Nessuno", 170);
    doc.text(pLines, 20, y);
    y += pLines.length * 6;
    checkPage(10);

    doc.setFont("helvetica", "bold");
    doc.text("Assenti:", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const aLines = doc.splitTextToSize(absentList || "Nessuno", 170);
    doc.text(aLines, 20, y);
    y += aLines.length * 6 + 5;
    checkPage(10);

    doc.setLineWidth(0.2);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Resoconto Agenda dei Lavori:", 20, y);
    y += 10;

    doc.setFontSize(11);
    (ev.agenda || []).forEach((item, i) => {
      checkPage(20);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(`${i + 1}. ${item}`, 170);
      doc.text(titleLines, 20, y);
      y += titleLines.length * 6;

      doc.setFont("helvetica", "normal");
      const noteText =
        verbaleData?.notes && verbaleData.notes[i]
          ? verbaleData.notes[i]
          : "Nessuna annotazione.";
      const noteLines = doc.splitTextToSize(noteText, 170);
      doc.text(noteLines, 20, y);
      y += noteLines.length * 6 + 5;
    });

    if (verbaleData?.closingNote) {
      checkPage(20);
      doc.setLineWidth(0.2);
      doc.line(20, y, 190, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Note di Chiusura:", 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const cLines = doc.splitTextToSize(verbaleData.closingNote, 170);
      doc.text(cLines, 20, y);
    }

    y += 15;
    checkPage(15);
    doc.setFont("helvetica", "italic");
    doc.text(settings.msgFooter || "Sinceramente e Fraternamente", 190, y, {
      align: "right",
    });
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Il Segretario", 190, y, { align: "right" });
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.text(settings.secretaryName || "Segretario", 190, y, {
      align: "right",
    });

    doc.save(`Verbale_${ev.date}.pdf`);
    showToast("📄 Verbale generato con successo!");
  };

  const isAdmin = currentUser?.role === "admin";
  const s = statsFor(latestEvent);

  const moveAgenda = (from, to) => {
    const arr = [...ne.agendaItems];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setNe({ ...ne, agendaItems: arr });
  };

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Connessione al server in corso...
      </div>
    );

  if (!currentUser) {
    return (
      <div
        className="app"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <style>{GLOBAL_STYLE}</style>
        <div className="card" style={{ width: "100%", marginTop: "10vh" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h1 style={{ fontSize: "1.6rem", color: "var(--ink)" }}>
              {settings.assocIcon} {settings.assocName}
            </h1>
            <p
              style={{
                fontSize: ".85rem",
                color: "var(--muted)",
                marginTop: 4,
              }}
            >
              Area Riservata
            </p>
          </div>
          <label>Nome Utente</label>
          <input
            value={loginU}
            onChange={(e) => setLoginU(e.target.value)}
            placeholder="es. m.rossi"
          />
          <label>Password</label>
          <input
            type="password"
            value={loginP}
            onChange={(e) => setLoginP(e.target.value)}
            placeholder="••••••••"
          />
          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 24 }}
            onClick={doLogin}
          >
            Accedi
          </button>

          <div
            style={{
              marginTop: 24,
              fontSize: ".65rem",
              color: "var(--muted)",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            <strong>Tutela della Privacy:</strong> I dati inseriti sono
            utilizzati esclusivamente per la gestione delle presenze e le
            comunicazioni interne della Loggia. Lasciare vuoti email e telefono
            è un diritto per chi non desidera comunicazioni dirette, garantendo
            la totale sicurezza.
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  const liveUser = members.find((m) => m.id === currentUser.id);
  if (liveUser && liveUser.status === "suspended") {
    saveCU(null);
    return null;
  }

  const tabsToShow = isAdmin
    ? [
        ["evento", "📋 Evento"],
        ["presenze", "👥 Presenze"],
        ["ospiti", "🤝 Ospiti"],
        ["gestione", "⚙ Gestione"],
        ["profilo", "👤 Profilo"],
      ]
    : [
        ["evento", "📋 Evento"],
        ["profilo", "👤 Profilo"],
      ];

  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <div className="app">
        <div className="topbar">
          <div className="topbar-row">
            <div>
              <h1 style={{ fontSize: "1.1rem" }}>
                {settings.assocIcon} {settings.assocName}
              </h1>
              <div className="sub">
                {isAdmin ? "Amministratore" : "Membro di Loggia"}
              </div>
            </div>
            <button
              className="user-pill"
              onClick={() => {
                if (window.confirm("Vuoi davvero uscire?")) saveCU(null);
              }}
            >
              <div className="mini-av">{initials(currentUser?.name)}</div>
              Esci ✕
            </button>
          </div>
          <div className="tabs">
            {tabsToShow.map(([k, l]) => (
              <button
                key={k}
                className={tab === k ? "active" : ""}
                onClick={() => setTab(k)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {tab === "evento" && (
          <>
            {latestEvent ? (
              <div className="card">
                <div className="gold-line" />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <div>
                    <div className="section-title">
                      {fmtDate(latestEvent.date)}
                    </div>
                    <div className="section-sub">
                      🕐 {latestEvent.time} &nbsp;·&nbsp; 📍 {latestEvent.place}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      latestEvent.status === "open"
                        ? "badge-green"
                        : "badge-gray"
                    }`}
                    style={{ flexShrink: 0 }}
                  >
                    {latestEvent.status === "open" ? "● Aperta" : "Chiusa"}
                  </span>
                </div>

                {latestEvent.agenda?.length > 0 && (
                  <>
                    <div className="divider" />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: ".75rem",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          letterSpacing: ".6px",
                        }}
                      >
                        Agenda dei Lavori
                      </div>
                      {isAdmin && latestEvent.status === "open" && (
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => {
                            setNe({
                              ...latestEvent,
                              agendaItems: latestEvent.agenda || [],
                            });
                            setModal("editAgenda");
                          }}
                        >
                          ⚙ Modifica Agenda
                        </button>
                      )}
                    </div>

                    {latestEvent.agenda.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <div className="agenda-num">{i + 1}</div>
                        <div
                          style={{
                            fontSize: ".88rem",
                            lineHeight: 1.55,
                            paddingTop: 3,
                          }}
                        >
                          {p}
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-outline btn-full btn-sm"
                      style={{ marginTop: 12 }}
                      onClick={() => handleDownloadPDF(latestEvent)}
                    >
                      📄 Scarica Convocazione (PDF)
                    </button>
                  </>
                )}

                <div className="divider" />
                <div
                  style={{
                    fontSize: ".78rem",
                    color: "var(--muted)",
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  La tua risposta — <strong>Riunione</strong>
                </div>
                <RsvpButtons
                  value={getRsvp(latestEvent.id, currentUser?.id).meeting}
                  onChange={(v) =>
                    setRsvp(latestEvent.id, currentUser?.id, "meeting", v)
                  }
                  disabled={latestEvent.status !== "open"}
                />

                {latestEvent.dinnerEnabled && (
                  <>
                    <div
                      style={{
                        fontSize: ".78rem",
                        color: "var(--muted)",
                        marginTop: 14,
                        marginBottom: 6,
                        fontWeight: 500,
                      }}
                    >
                      🍽 <strong>Agape</strong>
                      {latestEvent.dinnerNote && ` — ${latestEvent.dinnerNote}`}
                    </div>
                    <RsvpButtons
                      value={getRsvp(latestEvent.id, currentUser?.id).dinner}
                      onChange={(v) =>
                        setRsvp(latestEvent.id, currentUser?.id, "dinner", v)
                      }
                      disabled={latestEvent.status !== "open"}
                    />
                  </>
                )}

                <div className="divider" />
                <div
                  style={{
                    fontSize: ".75rem",
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: ".6px",
                    marginBottom: 8,
                  }}
                >
                  Riepilogo risposte
                </div>
                <div className="stat-row">
                  <div className="stat-box">
                    <div className="stat-num">{s.meetYes + s.gMeet}</div>
                    <div className="stat-lbl">✅ Riunione</div>
                  </div>
                  {latestEvent.dinnerEnabled && (
                    <div className="stat-box">
                      <div className="stat-num">{s.dinYes + s.gDin}</div>
                      <div className="stat-lbl">🍽 Agape</div>
                    </div>
                  )}
                </div>

                {isAdmin && latestEvent.status === "open" && (
                  <>
                    <div className="divider" />
                    <div className="send-row">
                      <button
                        className="btn btn-primary"
                        onClick={() => openEmail(latestEvent, false)}
                      >
                        📧 Apri Email
                      </button>
                      <button
                        className="btn btn-wa"
                        onClick={() => openWhatsAppAll(latestEvent, false)}
                      >
                        📲 Invia WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="empty">
                <div className="icon">📅</div>
                <div>Nessun evento attivo</div>
              </div>
            )}

            {isAdmin && (
              <div style={{ margin: "0 16px" }}>
                <button
                  className="btn btn-gold btn-full"
                  onClick={() => {
                    setNe({
                      date: nextMonday(),
                      time: "20:00",
                      place: "",
                      agendaItems: [...(settings.defaultAgenda || [])],
                      dinnerEnabled: true,
                      dinnerNote: "",
                    });
                    setModal("newEvent");
                  }}
                >
                  + Nuova Convocazione
                </button>
              </div>
            )}
          </>
        )}

        {tab === "profilo" && (
          <div className="card">
            <div className="gold-line" />
            <div className="section-title">Il tuo profilo</div>
            <div className="section-sub">
              Aggiorna i tuoi dati personali o la password.
            </div>
            <div className="divider" />

            {(() => {
              if (!myProfile.id || myProfile.id !== currentUser.id) {
                const m =
                  members.find((x) => x.id === currentUser.id) || currentUser;
                setMyProfile({ ...m });
                return null;
              }
              return (
                <>
                  <label>Nome Completo</label>
                  <input
                    value={myProfile.name}
                    disabled
                    style={{ background: "#eee" }}
                  />
                  <label>Email (Facoltativa)</label>
                  <input
                    type="email"
                    value={myProfile.email || ""}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, email: e.target.value })
                    }
                  />
                  <label>Numero WhatsApp (Facoltativo)</label>
                  <input
                    type="tel"
                    value={myProfile.phone || ""}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, phone: e.target.value })
                    }
                    placeholder="+39 333 1234567"
                  />
                  <div className="divider" />
                  <label>Nome Utente</label>
                  <input
                    value={myProfile.username}
                    disabled
                    style={{ background: "#eee" }}
                  />
                  <label>Nuova Password</label>
                  <input
                    type="text"
                    value={myProfile.password || ""}
                    onChange={(e) =>
                      setMyProfile({ ...myProfile, password: e.target.value })
                    }
                  />
                  <button
                    className="btn btn-primary btn-full"
                    style={{ marginTop: 20 }}
                    onClick={() => {
                      const updatedMembers = members.map((m) =>
                        m.id === myProfile.id ? myProfile : m
                      );
                      saveMbrs(updatedMembers);
                      saveCU(myProfile);
                      showToast("✅ Profilo aggiornato");
                    }}
                  >
                    Salva Modifiche
                  </button>
                </>
              );
            })()}

            <div className="privacy-box">
              <strong>Tutela della Privacy:</strong> I dati inseriti sono
              utilizzati esclusivamente per la gestione delle presenze e le
              comunicazioni interne della Loggia. Fornire un indirizzo email e
              un numero di telefono è facoltativo. Chi non desidera che questi
              dati vengano gestiti o comunicati, può lasciare i campi vuoti in
              totale sicurezza.
            </div>
          </div>
        )}

        {isAdmin &&
          tab === "presenze" &&
          (latestEvent ? (
            <div className="card">
              <div className="gold-line" />
              <div className="section-title">Presenze</div>
              <div className="section-sub">
                {fmtDate(latestEvent.date)} — solo attivi
              </div>
              <div className="divider" />
              {activeMembers.map((m) => {
                const r = getRsvp(latestEvent.id, m.id);
                return (
                  <div className="person-row" key={m.id}>
                    <div className="avatar">{initials(m.name)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: ".88rem", fontWeight: 500 }}>
                        {m.name}
                      </div>
                      <div
                        style={{
                          fontSize: ".72rem",
                          color: "var(--muted)",
                          marginTop: 2,
                        }}
                      >
                        {m.degree} {m.masonicRole ? `· ${m.masonicRole}` : ""}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        alignItems: "flex-end",
                      }}
                    >
                      <span
                        className={`badge ${
                          r.meeting === "yes" ? "badge-green" : "badge-red"
                        }`}
                      >
                        {r.meeting === "yes" ? "✓ Sì" : "✗ No"}
                      </span>
                      {latestEvent.dinnerEnabled && (
                        <span
                          className={`badge ${
                            r.dinner === "yes" ? "badge-green" : "badge-red"
                          }`}
                          style={{ fontSize: ".65rem" }}
                        >
                          🍽 {r.dinner === "yes" ? "Sì" : "No"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="divider" />
              <button
                className="btn btn-outline btn-full btn-sm"
                onClick={() => handleDownloadPresenzePDF(latestEvent)}
              >
                📄 Scarica Foglio Firme (PDF)
              </button>
            </div>
          ) : (
            <div className="empty">
              <div className="icon">👥</div>
              <div>Nessun evento attivo</div>
            </div>
          ))}

        {isAdmin && tab === "ospiti" && (
          <>
            {latestEvent && assocs.length > 0 && (
              <div className="card">
                <div className="gold-line" />
                <div className="section-title">Ospiti</div>
                <div className="section-sub">{fmtDate(latestEvent.date)}</div>
                <div className="divider" />
                {assocs.map((a) => {
                  const r = getGRsvp(latestEvent.id, a.id);
                  return (
                    <div
                      key={a.id}
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid var(--line)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: ".9rem" }}>
                            {a.name}
                          </div>
                          <div
                            style={{
                              fontSize: ".75rem",
                              color: "var(--muted)",
                            }}
                          >
                            Ref: {a.referente}
                            {a.phone && ` · 📲 ${a.phone}`}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <button
                            className="btn btn-outline btn-xs"
                            onClick={() => {
                              setGf({
                                assocId: a.id,
                                meeting: r.meeting || "yes",
                                dinner: r.dinner || "no",
                                count: r.count || 1,
                              });
                              setModal("guestRsvp");
                            }}
                          >
                            Modifica
                          </button>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          className={`badge ${
                            r.meeting === "yes" ? "badge-green" : "badge-red"
                          }`}
                        >
                          Riunione:{" "}
                          {r.meeting === "yes"
                            ? `✓ Sì (${r.count || 1} pers.)`
                            : "✗ No"}
                        </span>
                        {latestEvent.dinnerEnabled && (
                          <span
                            className={`badge ${
                              r.dinner === "yes" ? "badge-green" : "badge-red"
                            }`}
                          >
                            🍽{" "}
                            {r.dinner === "yes" ? `Sì (${r.count || 1})` : "No"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {latestEvent && assocs.length === 0 && (
              <div className="empty">
                <div className="icon">🤝</div>
                <div>Nessun ospite registrato</div>
              </div>
            )}
            {isAdmin && (
              <div style={{ margin: "0 16px" }}>
                <button
                  className="btn btn-outline btn-full"
                  onClick={() => setModal("addAssoc")}
                >
                  + Aggiungi Ospite / Delegazione
                </button>
              </div>
            )}
          </>
        )}

        {isAdmin && tab === "gestione" && (
          <>
            <div className="card">
              <div className="gold-line" />
              <div className="section-title">Impostazioni</div>
              <div className="section-sub">
                Configura scritte, firme e loggia.
              </div>
              <div className="divider" />
              <button
                className="btn btn-outline btn-full btn-sm"
                onClick={() => {
                  setModal("editGeneralSettings");
                }}
              >
                ⚙ Personalizza App e Firme
              </button>
              <button
                className="btn btn-outline btn-full btn-sm"
                style={{ marginTop: 8 }}
                onClick={() => {
                  setNe({
                    ...ne,
                    agendaItems: [...(settings.defaultAgenda || [])],
                  });
                  setModal("editDefaultAgenda");
                }}
              >
                📋 Imposta Agenda Predefinita
              </button>
            </div>

            <div className="card">
              <div className="gold-line" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: 6,
                }}
              >
                <div className="section-title">Fratelli di Loggia</div>
                <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>
                  {members.filter((m) => m.status !== "suspended").length}{" "}
                  attivi
                </div>
              </div>
              <div className="divider" />
              {members.map((m) => (
                <div
                  className={`person-row ${
                    m.status === "suspended" ? "suspended" : ""
                  }`}
                  key={m.id}
                >
                  <div
                    className={`avatar ${
                      m.status === "suspended" ? "suspended" : ""
                    }`}
                  >
                    {initials(m.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".88rem", fontWeight: 500 }}>
                      {m.name}
                    </div>
                    <div
                      style={{
                        fontSize: ".72rem",
                        color: "var(--muted)",
                        marginTop: 2,
                      }}
                    >
                      {m.degree} {m.masonicRole ? `· ${m.masonicRole}` : ""}
                    </div>
                    {m.status === "suspended" && (
                      <span
                        className="badge badge-orange"
                        style={{ fontSize: ".65rem", marginTop: 4 }}
                      >
                        In Sonno
                      </span>
                    )}
                  </div>
                  <div className="member-actions">
                    <button
                      className="btn btn-outline btn-xs btn-icon"
                      onClick={() => {
                        setEditMember(m);
                        setModal("editMember");
                      }}
                    >
                      ⚙
                    </button>
                  </div>
                </div>
              ))}
              <div className="divider" />
              <button
                className="btn btn-outline btn-full btn-sm"
                onClick={() => setModal("addMember")}
              >
                + Aggiungi Fratello
              </button>
            </div>

            <div className="card">
              <div className="gold-line" />
              <div className="section-title">Storico Convocazioni</div>
              <div className="divider" />
              {[...events].reverse().map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: ".88rem", fontWeight: 500 }}>
                        {fmtDate(ev.date)}
                      </div>
                      <div
                        style={{ fontSize: ".75rem", color: "var(--muted)" }}
                      >
                        ore {ev.time} · {(ev.agenda || []).length} punti
                        all'Agenda
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        className={`badge ${
                          ev.status === "open" ? "badge-green" : "badge-gray"
                        }`}
                      >
                        {ev.status === "open" ? "Aperta" : "Chiusa"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {ev.status === "open" && (
                      <button
                        className="btn btn-xs btn-outline"
                        style={{
                          color: "var(--red)",
                          borderColor: "var(--red)",
                          flex: 1,
                        }}
                        onClick={() => {
                          saveEvts(
                            events.map((e) =>
                              e.id === ev.id ? { ...e, status: "closed" } : e
                            )
                          );
                          showToast("Convocazione chiusa");
                        }}
                      >
                        Chiudi Lavori
                      </button>
                    )}
                    <button
                      className="btn btn-xs btn-outline"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setVerbaleEvent(ev);
                        setVf({
                          notes:
                            ev.verbale?.notes || ev.agenda?.map(() => "") || [],
                          closingNote: ev.verbale?.closingNote || "",
                          link: ev.verbale?.link || "",
                        });
                        setModal("verbale");
                      }}
                    >
                      📝 Verbale
                    </button>

                    {/* Pulsante per aprire il verbale definitivo se c'è un link */}
                    {ev.verbale?.link && (
                      <button
                        className="btn btn-xs btn-outline"
                        style={{
                          flex: 1,
                          borderColor: "var(--green)",
                          color: "var(--green)",
                        }}
                        onClick={() => window.open(ev.verbale.link, "_blank")}
                      >
                        🔗 Apri Verbale
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {modal && (
          <div className="overlay" onClick={() => setModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="handle" />

              {modal === "newEvent" && (
                <>
                  <h2>Nuova Convocazione</h2>
                  <label>Data</label>
                  <input
                    type="date"
                    value={ne.date}
                    onChange={(e) => setNe({ ...ne, date: e.target.value })}
                  />
                  <label>Ora</label>
                  <input
                    type="time"
                    value={ne.time}
                    onChange={(e) => setNe({ ...ne, time: e.target.value })}
                  />
                  <label>Luogo</label>
                  <input
                    value={ne.place}
                    onChange={(e) => setNe({ ...ne, place: e.target.value })}
                    placeholder="Es. Casa Massonica..."
                  />

                  <div className="divider" />
                  <div
                    style={{
                      fontSize: ".8rem",
                      color: "var(--muted)",
                      fontWeight: 500,
                      marginBottom: 10,
                    }}
                  >
                    Agenda dei Lavori
                  </div>
                  {ne.agendaItems.map((item, i) => (
                    <div
                      key={i}
                      className="agenda-item"
                      draggable
                      onDragStart={() => setDragIdx(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIdx !== null && dragIdx !== i) {
                          moveAgenda(dragIdx, i);
                        }
                        setDragIdx(null);
                      }}
                      style={dragIdx === i ? { opacity: 0.4 } : {}}
                    >
                      <span className="drag-handle">⠿</span>
                      <div className="agenda-num">{i + 1}</div>
                      <input
                        value={item}
                        onChange={(e) => {
                          const a = [...ne.agendaItems];
                          a[i] = e.target.value;
                          setNe({ ...ne, agendaItems: a });
                        }}
                        placeholder={`Punto ${i + 1}…`}
                      />
                      <button
                        className="btn btn-icon btn-outline"
                        style={{
                          color: "var(--red)",
                          borderColor: "#fcc",
                          fontSize: ".9rem",
                        }}
                        onClick={() =>
                          setNe({
                            ...ne,
                            agendaItems: ne.agendaItems.filter(
                              (_, j) => j !== i
                            ),
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 4 }}
                    onClick={() =>
                      setNe({ ...ne, agendaItems: [...ne.agendaItems, ""] })
                    }
                  >
                    + Aggiungi punto
                  </button>

                  <div className="divider" />
                  <div className="switch-row">
                    <span style={{ fontSize: ".88rem" }}>🍽 Abilita Agape</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={ne.dinnerEnabled}
                        onChange={(e) =>
                          setNe({ ...ne, dinnerEnabled: e.target.checked })
                        }
                      />
                      <span className="slider" />
                    </label>
                  </div>
                  {ne.dinnerEnabled && (
                    <input
                      value={ne.dinnerNote}
                      onChange={(e) =>
                        setNe({ ...ne, dinnerNote: e.target.value })
                      }
                      placeholder="Note Agape..."
                    />
                  )}
                  <div className="divider" />
                  <button
                    className="btn btn-gold btn-full"
                    onClick={() => {
                      const ev = {
                        id: "e" + Date.now(),
                        date: ne.date,
                        time: ne.time,
                        place: ne.place,
                        agenda: ne.agendaItems.filter((p) => p.trim()),
                        dinnerEnabled: ne.dinnerEnabled,
                        dinnerNote: ne.dinnerNote,
                        status: "open",
                        createdAt: new Date().toISOString(),
                      };
                      saveEvts([...events, ev]);
                      setModal(null);
                      setTab("evento");
                      showToast("✅ Convocazione pubblicata!");
                    }}
                  >
                    Pubblica Convocazione
                  </button>
                </>
              )}

              {modal === "editAgenda" && (
                <>
                  <h2>Modifica Agenda dei Lavori</h2>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "var(--muted)",
                      marginBottom: 16,
                    }}
                  >
                    Aggiungi, togli o riordina i punti per la convocazione
                    corrente.
                  </p>

                  {ne.agendaItems.map((item, i) => (
                    <div
                      key={i}
                      className="agenda-item"
                      draggable
                      onDragStart={() => setDragIdx(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIdx !== null && dragIdx !== i) {
                          moveAgenda(dragIdx, i);
                        }
                        setDragIdx(null);
                      }}
                      style={dragIdx === i ? { opacity: 0.4 } : {}}
                    >
                      <span className="drag-handle">⠿</span>
                      <div className="agenda-num">{i + 1}</div>
                      <input
                        value={item}
                        onChange={(e) => {
                          const a = [...ne.agendaItems];
                          a[i] = e.target.value;
                          setNe({ ...ne, agendaItems: a });
                        }}
                        placeholder={`Punto ${i + 1}…`}
                      />
                      <button
                        className="btn btn-icon btn-outline"
                        style={{
                          color: "var(--red)",
                          borderColor: "#fcc",
                          fontSize: ".9rem",
                        }}
                        onClick={() =>
                          setNe({
                            ...ne,
                            agendaItems: ne.agendaItems.filter(
                              (_, j) => j !== i
                            ),
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 4 }}
                    onClick={() =>
                      setNe({ ...ne, agendaItems: [...ne.agendaItems, ""] })
                    }
                  >
                    + Aggiungi punto
                  </button>

                  <div className="divider" />
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      const updatedAgenda = ne.agendaItems.filter((p) =>
                        p.trim()
                      );
                      saveEvts(
                        events.map((e) =>
                          e.id === latestEvent.id
                            ? { ...e, agenda: updatedAgenda }
                            : e
                        )
                      );
                      showToast("✅ Agenda dei Lavori aggiornata!");
                    }}
                  >
                    1. Salva Modifiche
                  </button>

                  <div
                    style={{
                      fontSize: ".8rem",
                      color: "var(--muted)",
                      marginTop: 20,
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    Dopo aver salvato, puoi avvisare i Fratelli:
                  </div>
                  <div className="send-row" style={{ marginTop: 0 }}>
                    <button
                      className="btn btn-outline"
                      onClick={() => openEmail(latestEvent, true)}
                    >
                      📧 Invia Email Variazione
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => openWhatsAppAll(latestEvent, true)}
                    >
                      📲 Invia WA Variazione
                    </button>
                  </div>
                </>
              )}

              {modal === "editGeneralSettings" && (
                <>
                  <h2>Personalizzazione App</h2>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "var(--muted)",
                      marginBottom: 16,
                    }}
                  >
                    Imposta i nomi delle Cariche, così le convocazioni si
                    compileranno in automatico.
                  </p>

                  <label>Nome Loggia</label>
                  <input
                    value={settings.assocName}
                    onChange={(e) =>
                      setSettings({ ...settings, assocName: e.target.value })
                    }
                    placeholder="Es. R.L. Garibaldi"
                  />

                  <label>Icona / Emoji</label>
                  <input
                    value={settings.assocIcon}
                    onChange={(e) =>
                      setSettings({ ...settings, assocIcon: e.target.value })
                    }
                    placeholder="Es. ⚜, 📐, 🏛"
                  />

                  <label>Intestazione nei PDF</label>
                  <input
                    value={settings.pdfHeader}
                    onChange={(e) =>
                      setSettings({ ...settings, pdfHeader: e.target.value })
                    }
                    placeholder="Es. CONVOCAZIONE UFFICIALE"
                  />

                  <div className="divider" />
                  <div className="section-title" style={{ fontSize: ".95rem" }}>
                    Cariche e Firme
                  </div>

                  <label>Maestro Venerabile</label>
                  <input
                    value={settings.masterName}
                    onChange={(e) =>
                      setSettings({ ...settings, masterName: e.target.value })
                    }
                    placeholder="Es. V.LE F.LLO NOME COGNOME"
                  />

                  <label>Segretario</label>
                  <input
                    value={settings.secretaryName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        secretaryName: e.target.value,
                      })
                    }
                    placeholder="Es. M.M. NOME COGNOME"
                  />

                  <label>Membri Fondatori (Stampa in fondo al PDF)</label>
                  <textarea
                    rows={2}
                    value={settings.founders}
                    onChange={(e) =>
                      setSettings({ ...settings, founders: e.target.value })
                    }
                    placeholder="Es. Nome 1, Nome 2, ..."
                  />

                  <label>Past Master (Stampa in fondo al PDF)</label>
                  <textarea
                    rows={2}
                    value={settings.pastMasters}
                    onChange={(e) =>
                      setSettings({ ...settings, pastMasters: e.target.value })
                    }
                    placeholder="Es. Nome 1, Nome 2, ..."
                  />

                  <label>Formula di Chiusura</label>
                  <input
                    value={settings.msgFooter}
                    onChange={(e) =>
                      setSettings({ ...settings, msgFooter: e.target.value })
                    }
                    placeholder="Es. Sinceramente e Fraternamente"
                  />

                  <div className="divider" />
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      saveSettings(settings);
                      setModal(null);
                      showToast("✅ Impostazioni salvate!");
                    }}
                  >
                    Salva Impostazioni
                  </button>
                </>
              )}

              {modal === "editDefaultAgenda" && (
                <>
                  <h2>Agenda Predefinita</h2>
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "var(--muted)",
                      marginBottom: 16,
                    }}
                  >
                    Questi punti verranno precaricati automaticamente in ogni
                    nuova convocazione.
                  </p>

                  {ne.agendaItems.map((item, i) => (
                    <div
                      key={i}
                      className="agenda-item"
                      draggable
                      onDragStart={() => setDragIdx(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIdx !== null && dragIdx !== i) {
                          moveAgenda(dragIdx, i);
                        }
                        setDragIdx(null);
                      }}
                      style={dragIdx === i ? { opacity: 0.4 } : {}}
                    >
                      <span className="drag-handle">⠿</span>
                      <div className="agenda-num">{i + 1}</div>
                      <input
                        value={item}
                        onChange={(e) => {
                          const a = [...ne.agendaItems];
                          a[i] = e.target.value;
                          setNe({ ...ne, agendaItems: a });
                        }}
                        placeholder={`Punto standard ${i + 1}…`}
                      />
                      <button
                        className="btn btn-icon btn-outline"
                        style={{
                          color: "var(--red)",
                          borderColor: "#fcc",
                          fontSize: ".9rem",
                        }}
                        onClick={() =>
                          setNe({
                            ...ne,
                            agendaItems: ne.agendaItems.filter(
                              (_, j) => j !== i
                            ),
                          })
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 4 }}
                    onClick={() =>
                      setNe({ ...ne, agendaItems: [...ne.agendaItems, ""] })
                    }
                  >
                    + Aggiungi punto
                  </button>

                  <div className="divider" />
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      saveSettings({
                        ...settings,
                        defaultAgenda: ne.agendaItems.filter((p) => p.trim()),
                      });
                      setModal(null);
                      showToast("✅ Agenda Standard salvata!");
                    }}
                  >
                    Salva Agenda Standard
                  </button>
                </>
              )}

              {modal === "verbale" && verbaleEvent && (
                <>
                  <h2>Compila Verbale</h2>
                  <div className="section-sub">
                    {fmtDate(verbaleEvent.date)}
                  </div>
                  <div className="divider" />

                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "var(--muted)",
                      marginBottom: 16,
                    }}
                  >
                    Scrivi una breve nota riassuntiva sotto ogni punto
                    dell'Agenda.
                  </p>

                  {(verbaleEvent.agenda || []).map((item, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: ".85rem",
                          marginBottom: 6,
                        }}
                      >
                        {i + 1}. {item}
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Note su questo punto..."
                        value={vf.notes[i] || ""}
                        onChange={(e) => {
                          const newNotes = [...vf.notes];
                          newNotes[i] = e.target.value;
                          setVf({ ...vf, notes: newNotes });
                        }}
                      />
                    </div>
                  ))}
                  <div className="divider" />
                  <label>Nota Finale di Chiusura</label>
                  <textarea
                    rows={3}
                    placeholder="Es. Esauriti i punti all'Agenda dei Lavori, la seduta è tolta alle ore..."
                    value={vf.closingNote}
                    onChange={(e) =>
                      setVf({ ...vf, closingNote: e.target.value })
                    }
                  />

                  <div className="divider" />
                  <label>Link Verbale Definitivo (Archivio Esterno)</label>
                  <input
                    value={vf.link || ""}
                    onChange={(e) => setVf({ ...vf, link: e.target.value })}
                    placeholder="Es. https://github.com/tuorepo/verbale.pdf"
                  />
                  <p
                    style={{
                      fontSize: ".7rem",
                      color: "var(--muted)",
                      marginTop: 4,
                    }}
                  >
                    Incolla qui il link al file caricato sul repository. Ricorda
                    di proteggerlo con password.
                  </p>

                  <div className="divider" />
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      const updatedEv = { ...verbaleEvent, verbale: vf };
                      saveEvts(
                        events.map((e) =>
                          e.id === verbaleEvent.id ? updatedEv : e
                        )
                      );
                      handleDownloadVerbalePDF(updatedEv, vf);
                      setModal(null);
                    }}
                  >
                    💾 Salva e Scarica PDF (Bozza)
                  </button>
                </>
              )}

              {modal === "addMember" && (
                <>
                  <h2>Nuovo Fratello</h2>
                  <label>Nome Completo</label>
                  <input
                    value={newMember.name}
                    onChange={(e) =>
                      setNm({ ...newMember, name: e.target.value })
                    }
                    placeholder="Mario Rossi"
                  />
                  <label>Nome Utente (per il login)</label>
                  <input
                    value={newMember.username}
                    onChange={(e) =>
                      setNm({
                        ...newMember,
                        username: e.target.value
                          .toLowerCase()
                          .replace(/\s/g, ""),
                      })
                    }
                    placeholder="m.rossi"
                  />
                  <label>Password provvisoria</label>
                  <input
                    value={newMember.password}
                    onChange={(e) =>
                      setNm({ ...newMember, password: e.target.value })
                    }
                    placeholder="password123"
                  />

                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ marginTop: 0 }}>Grado</label>
                      <input
                        value={newMember.degree}
                        onChange={(e) =>
                          setNm({ ...newMember, degree: e.target.value })
                        }
                        placeholder="Es. Maestro"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ marginTop: 0 }}>Ruolo / Carica</label>
                      <input
                        value={newMember.masonicRole}
                        onChange={(e) =>
                          setNm({ ...newMember, masonicRole: e.target.value })
                        }
                        placeholder="Es. Oratore"
                      />
                    </div>
                  </div>

                  <div className="divider" />
                  <label>Permessi di Accesso</label>
                  <select
                    value={newMember.role}
                    onChange={(e) =>
                      setNm({ ...newMember, role: e.target.value })
                    }
                  >
                    <option value="member">
                      Fratello (solo Lettura/Risposte)
                    </option>
                    <option value="admin">
                      Amministratore (Gestione Loggia)
                    </option>
                  </select>
                  <div className="divider" />
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      if (
                        !newMember.name ||
                        !newMember.username ||
                        !newMember.password
                      ) {
                        alert("Inserisci Nome, Utente e Password");
                        return;
                      }
                      if (
                        members.some((m) => m.username === newMember.username)
                      ) {
                        alert("Questo nome utente esiste già!");
                        return;
                      }
                      saveMbrs([
                        ...members,
                        {
                          ...newMember,
                          id: "m" + Date.now(),
                          status: "active",
                        },
                      ]);
                      setNm({
                        name: "",
                        email: "",
                        phone: "",
                        role: "member",
                        username: "",
                        password: "",
                        degree: "",
                        masonicRole: "",
                      });
                      setModal(null);
                      showToast("👤 Fratello aggiunto!");
                    }}
                  >
                    Salva Fratello
                  </button>
                </>
              )}

              {modal === "editMember" && editMember && (
                <>
                  <h2>Modifica Dati: {editMember.name}</h2>
                  <label>Nome Utente</label>
                  <input
                    value={editMember.username}
                    onChange={(e) =>
                      setEditMember({ ...editMember, username: e.target.value })
                    }
                  />
                  <label>Password</label>
                  <input
                    type="text"
                    value={editMember.password}
                    onChange={(e) =>
                      setEditMember({ ...editMember, password: e.target.value })
                    }
                  />

                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ marginTop: 0 }}>Grado</label>
                      <input
                        value={editMember.degree || ""}
                        onChange={(e) =>
                          setEditMember({
                            ...editMember,
                            degree: e.target.value,
                          })
                        }
                        placeholder="Es. Maestro"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ marginTop: 0 }}>Ruolo / Carica</label>
                      <input
                        value={editMember.masonicRole || ""}
                        onChange={(e) =>
                          setEditMember({
                            ...editMember,
                            masonicRole: e.target.value,
                          })
                        }
                        placeholder="Es. Oratore"
                      />
                    </div>
                  </div>

                  <label>Permessi di Accesso</label>
                  <select
                    value={editMember.role}
                    onChange={(e) =>
                      setEditMember({ ...editMember, role: e.target.value })
                    }
                  >
                    <option value="member">
                      Fratello (solo Lettura/Risposte)
                    </option>
                    <option value="admin">
                      Amministratore (Gestione Loggia)
                    </option>
                  </select>

                  <button
                    className="btn btn-gold btn-full"
                    style={{ marginTop: 16 }}
                    onClick={() => {
                      saveMbrs(
                        members.map((m) =>
                          m.id === editMember.id ? editMember : m
                        )
                      );
                      setModal(null);
                      showToast("✅ Dati aggiornati");
                    }}
                  >
                    Salva Modifiche
                  </button>

                  <div className="divider" />
                  <div className="action-menu">
                    <div
                      className="action-item"
                      onClick={() => {
                        const next = members.map((mb) =>
                          mb.id === editMember.id
                            ? {
                                ...mb,
                                status:
                                  mb.status === "suspended"
                                    ? "active"
                                    : "suspended",
                              }
                            : mb
                        );
                        saveMbrs(next);
                        setModal(null);
                        showToast("Stato account cambiato");
                      }}
                    >
                      <div className="ai-icon">
                        {editMember.status === "suspended" ? "▶" : "⏸"}
                      </div>
                      <div style={{ fontWeight: 500 }}>
                        {editMember.status === "suspended"
                          ? "Riattiva Account (Risveglio)"
                          : "Metti in Sonno (Sospendi)"}
                      </div>
                    </div>
                    <div
                      className="action-item"
                      style={{ color: "var(--red)" }}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Sei sicuro di voler eliminare ${editMember.name}?`
                          )
                        ) {
                          saveMbrs(
                            members.filter((m) => m.id !== editMember.id)
                          );
                          setModal(null);
                          showToast("🗑 Profilo eliminato");
                        }
                      }}
                    >
                      <div className="ai-icon">✕</div>
                      <div style={{ fontWeight: 500 }}>
                        Elimina definitivamente
                      </div>
                    </div>
                  </div>
                </>
              )}

              {modal === "addAssoc" && (
                <>
                  <h2>Nuovo Ospite / Delegazione</h2>
                  <label>Nome Loggia o Ospite</label>
                  <input
                    value={newAssoc.name}
                    onChange={(e) =>
                      setNa({ ...newAssoc, name: e.target.value })
                    }
                    placeholder="R.L. ..."
                  />
                  <label>Referente</label>
                  <input
                    value={newAssoc.referente}
                    onChange={(e) =>
                      setNa({ ...newAssoc, referente: e.target.value })
                    }
                    placeholder="Nome Cognome"
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={newAssoc.email}
                    onChange={(e) =>
                      setNa({ ...newAssoc, email: e.target.value })
                    }
                    placeholder="info@loggia.it"
                  />
                  <label>Numero WhatsApp referente</label>
                  <input
                    type="tel"
                    value={newAssoc.phone || ""}
                    onChange={(e) =>
                      setNa({ ...newAssoc, phone: e.target.value })
                    }
                    placeholder="+39 333 1234567"
                  />
                  <div className="divider" />
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => {
                      if (!newAssoc.name) return;
                      saveAss([
                        ...assocs,
                        { ...newAssoc, id: "a" + Date.now() },
                      ]);
                      setNa({ name: "", referente: "", email: "", phone: "" });
                      setModal(null);
                      showToast("🤝 Ospite aggiunto!");
                    }}
                  >
                    Aggiungi Ospite
                  </button>
                </>
              )}

              {modal === "guestRsvp" &&
                latestEvent &&
                (() => {
                  const assoc = assocs.find((a) => a.id === guestForm.assocId);
                  return (
                    <>
                      <h2>{assoc?.name}</h2>
                      <p
                        style={{
                          fontSize: ".82rem",
                          color: "var(--muted)",
                          marginBottom: 16,
                        }}
                      >
                        {fmtDate(latestEvent.date)}
                      </p>
                      <div
                        style={{
                          fontSize: ".8rem",
                          color: "var(--muted)",
                          fontWeight: 500,
                          marginBottom: 6,
                        }}
                      >
                        Partecipano alla Riunione?
                      </div>
                      <RsvpButtons
                        value={guestForm.meeting}
                        onChange={(v) => setGf({ ...guestForm, meeting: v })}
                      />
                      {latestEvent.dinnerEnabled && (
                        <>
                          <div
                            style={{
                              fontSize: ".8rem",
                              color: "var(--muted)",
                              fontWeight: 500,
                              marginTop: 14,
                              marginBottom: 6,
                            }}
                          >
                            Si trattengono per l'Agape?
                          </div>
                          <RsvpButtons
                            value={guestForm.dinner}
                            onChange={(v) => setGf({ ...guestForm, dinner: v })}
                          />
                        </>
                      )}
                      {guestForm.meeting === "yes" && (
                        <>
                          <label>Numero di persone</label>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={guestForm.count}
                            onChange={(e) =>
                              setGf({
                                ...guestForm,
                                count: parseInt(e.target.value) || 1,
                              })
                            }
                          />
                        </>
                      )}
                      <div className="divider" />
                      <button
                        className="btn btn-primary btn-full"
                        onClick={() => {
                          setGRsvp(latestEvent.id, guestForm.assocId, {
                            meeting: guestForm.meeting,
                            dinner: guestForm.dinner,
                            count: guestForm.count,
                          });
                          setModal(null);
                          showToast("✅ Risposta salvata!");
                        }}
                      >
                        Conferma
                      </button>
                    </>
                  );
                })()}
            </div>
          </div>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

function RsvpButtons({ value, onChange, disabled }) {
  return (
    <div className="rsvp-row">
      {[
        ["yes", "✅", "Sì"],
        ["no", "❌", "No"],
      ].map(([v, e, l]) => (
        <button
          key={v}
          className={`rsvp-btn ${value === v ? v : ""}`}
          onClick={() => !disabled && onChange(v)}
          style={disabled ? { opacity: 0.45, cursor: "default" } : {}}
        >
          <span style={{ fontSize: "1.1rem" }}>{e}</span>
          {l}
        </button>
      ))}
    </div>
  );
}
