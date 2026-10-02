(function () {
  const I = window.INPUT;
  const PAL = [
    "#a8c7fa",
    "#f2b8b5",
    "#fde293",
    "#a8dab5",
    "#fcc7a5",
    "#a5e3e0",
    "#d7aefb",
    "#d3bfb2",
  ];
  const WD = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const p2 = (n) => (n < 10 ? "0" + n : "" + n);
  const addD = (s, n) => {
    const [y, m, d] = s.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + n);
    return `${dt.getUTCFullYear()}-${p2(dt.getUTCMonth() + 1)}-${p2(dt.getUTCDate())}`;
  };
  const wdOf = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  };

  function pTime(raw) {
    if (typeof raw !== "string")
      return {
        e: "unparsable",
      };
    let s = raw
      .trim()
      .replace(/[oOоО]/g, "0")
      .replace(/;/g, ":")
      .replace(/\s+/g, "");
    let is12 = false,
      pm = false,
      am = false;
    const sfx = s.match(/^(.+?)(a\.m\.|p\.m\.|am|pm)$/i);
    if (sfx) {
      is12 = true;
      pm = /^p/i.test(sfx[2]);
      am = /^a/i.test(sfx[2]);
      s = sfx[1];
    }
    const m = s.match(/^(\d{1,2})(?:[:.](\d{2}))?$/);
    if (!m) return { e: "unparsable" };
    let h = +m[1];
    const mi = m[2] ? +m[2] : 0;
    if (is12) {
      if (h < 1 || h > 12) return { e: "unparsable" };
      if (pm && h !== 12) h += 12;
      if (am && h === 12) h = 0;
    }
    if (h < 0 || h > 23) return { e: "hour-out-of-range" };
    if (mi < 0 || mi > 59) return { e: "minute-out-of-range" };
    return { h, mi };
  }

  function pDur(raw) {
    if (typeof raw !== "string") return { e: "unparsable" };
    const s = raw.trim();
    let m;
    if ((m = s.match(/^(\d+)\s*мин\.?$/i))) return { v: +m[1] };
    if ((m = s.match(/^(\d+)\s*ч\.?\s*(\d+)\s*м\.?$/i)))
      return { v: +m[1] * 60 + +m[2] };
    if ((m = s.match(/^(\d+)\s*ч\.?$/i))) return { v: +m[1] * 60 };
    if ((m = s.match(/^(\d+)\s*м\.?$/i))) return { v: +m[1] };
    return { e: "unparsable" };
  }

  function check(ev, d0, d1) {
    if (ev.date < d0 || ev.date > d1)
      return { bad: ev.date, r: "date-out-of-range" };
    const s = pTime(ev.start);
    if (s.e) return { bad: ev.start, r: s.e };
    const sm = s.h * 60 + s.mi;
    if (ev.end !== undefined) {
      const e = pTime(ev.end);
      if (e.e) return { bad: ev.end, r: e.e };
      const em = e.h * 60 + e.mi;
      if (em <= sm) return { bad: ev.end, r: "end-before-start" };
      return { sm, em };
    }
    const du = pDur(ev.duration);
    if (du.e) return { bad: ev.duration, r: du.e };
    const em = sm + du.v;
    if (em <= sm) return { bad: ev.duration, r: "end-before-start" };
    return { sm, em };
  }

  const d0 = I.startDate,
    d1 = addD(d0, I.days - 1);
  const errs = [],
    valid = [];
  I.events.forEach((ev) => {
    const r = check(ev, d0, d1);
    if (r.r) errs.push({ id: ev.id, value: r.bad, reason: r.r });
    else
      valid.push({
        id: ev.id,
        title: ev.title,
        date: ev.date,
        sm: r.sm,
        em: r.em,
      });
  });
  valid.forEach((e, i) => (e.clr = PAL[i % 8]));

  const days = [];
  for (let i = 0; i < I.days; i++) days.push(addD(d0, i));
  const byDay = {};
  days.forEach((d) => (byDay[d] = []));
  valid.forEach((e) => byDay[e.date] && byDay[e.date].push(e));

  days.forEach((d) => {
    const evs = byDay[d].sort((a, b) => a.sm - b.sm);
    const groups = [];
    let grp = [],
      end = -Infinity;
    evs.forEach((e) => {
      if (e.sm >= end) {
        if (grp.length) groups.push(grp);
        grp = [e];
        end = e.em;
      } else {
        grp.push(e);
        end = Math.max(end, e.em);
      }
    });
    if (grp.length) groups.push(grp);

    groups.forEach((g) => {
      const ends = [];
      g.forEach((e) => {
        const c = ends.findIndex((x) => x <= e.sm);
        if (c < 0) {
          e.col = ends.length;
          ends.push(e.em);
        } else {
          e.col = c;
          ends[c] = e.em;
        }
      });
      g.forEach((e) => (e.tot = ends.length));
    });
  });

  const GW = 60,
    DW = 240,
    HEAD = 40,
    RH = 30;
  const W = GW + I.days * DW,
    H = HEAD + 24 * RH;
  const root = document.getElementById("calendar");
  root.innerHTML = "";
  root.style.cssText = `position:relative;width:${W}px;height:${H}px;font:12px/1 Arial,sans-serif`;

  const add = (css) => {
    const el = document.createElement("div");
    el.style.cssText = css;
    root.appendChild(el);
    return el;
  };

  for (let h = 1; h < 24; h++)
    add(
      `position:absolute;left:0;top:${HEAD + h * RH}px;width:${W}px;height:1px;background:#e0e0e0`,
    );
  for (let i = 0; i <= I.days; i++)
    add(
      `position:absolute;left:${GW + i * DW}px;top:0;width:1px;height:${H}px;background:#ccc`,
    );
  add(
    `position:absolute;left:0;top:${HEAD}px;width:${W}px;height:1px;background:#ccc`,
  );

  for (let h = 0; h < 24; h++) {
    const l = add(`position:absolute;left:0;top:${HEAD + h * RH}px`);
    l.textContent = p2(h) + ":00";
  }

  days.forEach((d, i) => {
    const [y, m, dd] = d.split("-");
    const h = add(
      `position:absolute;left:${GW + i * DW}px;top:0;width:${DW}px;height:${HEAD}px`,
    );
    h.textContent = `${WD[wdOf(d)]}, ${dd}.${m}`;
  });

  valid.forEach((e) => {
    const di = days.indexOf(e.date);
    if (di < 0) return;
    const w = DW / e.tot,
      l = GW + di * DW + e.col * w,
      t = HEAD + e.sm * 0.5,
      h = (e.em - e.sm) * 0.5;
    const b = add(
      `position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;background:${e.clr};border:1px solid #9aa0a6;box-sizing:border-box;padding:1px 4px;overflow:hidden;color:#3c4043;font-size:11px;line-height:1`,
    );
    b.textContent = e.title;
  });

  window.ERRORS = errs;
})();
