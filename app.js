(() => {
  const D = window.IS7;
  const T = D.ui;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const byId = Object.fromEntries(D.products.map((p) => [p.id, p]));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- imágenes ---------- */
  const src = (p, name, w = 720) => `img/${name}-${p.single || w}.webp`;
  const srcset = (p, name) => (p.single ? "" : `img/${name}-400.webp 400w, img/${name}-720.webp 720w`);
  const imgTag = (p, name, sizes, alt) =>
    `<img src="${src(p, name, 400)}"${p.single ? "" : ` srcset="${srcset(p, name)}" sizes="${sizes}"`} alt="${esc(alt)}" loading="lazy" decoding="async" width="720" height="900">`;
  // nombre completo para textos corridos: «Versace Chain Reaction bianca», «Berretti di lana (vari marchi)»
  const fullName = (p) => (p.brand === "Vari marchi" ? `${p.name} (vari marchi)` : `${p.brand} ${p.name}`);
  const altFor = (p) => `${fullName(p)}. ${p.seen[0]}`;

  /* ---------- catálogo: composición de lookbook ----------
     Cada pieza tiene un lugar pensado a mano: columna y fila en la grilla de 12
     (escritorio), columna en la de 6 (móvil), desfase vertical y proporción. */
  const L = {
    // zapatillas
    "lv-skate":       { c: "1 / span 4",  r: 1, mt: 0,   ratio: "4/5",  m: "1 / span 4" },
    "mcq-graffiti":   { c: "6 / span 3",  r: 1, mt: 120, ratio: "3/4",  m: "1 / span 3" },
    "balenciaga-track": { c: "10 / span 3", r: 1, mt: 40, ratio: "4/5", m: "4 / span 3", mm: 48 },
    "mcq-oversized":  { c: "2 / span 3",  r: 2, mt: 80,  ratio: "1/1",  m: "3 / span 4" },
    "versace-white":  { c: "6 / span 3",  r: 2, mt: 0,   ratio: "4/5",  m: "1 / span 3" },
    "versace-black":  { c: "10 / span 3", r: 2, mt: 140, ratio: "3/4",  m: "4 / span 3", mm: 48 },
    "dior-b22":       { c: "1 / span 3",  r: 3, mt: 40,  ratio: "4/5",  m: "1 / span 4" },
    "note-shoes":     { c: "6 / span 5",  r: 3, mt: 120, m: "1 / span 6" },
    // ropa
    "rl-hoodie":      { c: "1 / span 3",  r: 1, mt: 120, ratio: "4/5",  m: "1 / span 3" },
    "prada-set":      { c: "6 / span 5",  r: 1, mt: 0,   ratio: "4/3",  m: "1 / span 4" },
    "lacoste-set":    { c: "2 / span 4",  r: 2, mt: 40,  ratio: "4/3",  m: "4 / span 3", mm: 48 },
    "lacoste-mono":   { c: "8 / span 3",  r: 2, mt: 140, ratio: "1/1",  m: "1 / span 3" },
    "stone-island":   { c: "2 / span 3",  r: 3, mt: 0,   ratio: "4/5",  m: "4 / span 3", mm: 48 },
    "cg-tee":         { c: "7 / span 4",  r: 3, mt: 90,  ratio: "4/3",  m: "2 / span 4" },
    "note-nike":      { c: "3 / span 6",  r: 4, mt: 40,  m: "1 / span 6" },
    // relojes
    "ms-pink":        { c: "1 / span 4",  r: 1, mt: 0,   ratio: "4/5",  m: "1 / span 4" },
    "ms-earth":       { c: "6 / span 3",  r: 1, mt: 110, ratio: "3/4",  m: "1 / span 3" },
    "ms-white":       { c: "10 / span 3", r: 1, mt: 0,   ratio: "3/4",  m: "4 / span 3", mm: 48 },
    "ms-green":       { c: "3 / span 3",  r: 2, mt: 40,  ratio: "3/4",  m: "1 / span 3" },
    "ms-black":       { c: "8 / span 3",  r: 2, mt: 130, ratio: "4/5",  m: "4 / span 3", mm: 48 },
    // accesorios
    "gorros":         { c: "4 / span 5",  r: 1, mt: 0,   ratio: "16/11", m: "1 / span 5" },
  };
  const pos = (id) => {
    const l = L[id] || {};
    return `--c:${l.c || "auto"};--r:${l.r || "auto"};--mt:${l.mt || 0}px;--m:${l.m || "1 / span 6"};--mm:${l.mm || 0}px;${l.ratio ? `--ratio:${l.ratio};` : ""}`;
  };

  const item = (p, sizes) => `
    <figure class="item" style="${pos(p.id)}">
      <button class="item-media" type="button" data-product="${p.id}" aria-label="Vedi scheda: ${esc(p.brand)} ${esc(p.name)}">
        ${imgTag(p, p.imgs[0], sizes, altFor(p))}
      </button>
      <figcaption class="cap">
        <span class="cap-brand">${esc(p.brand)}</span>
        <button class="cap-name" type="button" data-product="${p.id}">${esc(p.name)}</button>
        <button class="cap-add" type="button" data-quick="${p.id}" aria-label="Aggiungi ${esc(p.brand)} ${esc(p.name)} all'ordine">+ Aggiungi</button>
      </figcaption>
    </figure>`;

  const noteBlock = (key, title, text, cta) => `
    <div class="item item--note" style="${pos(key)}">
      <p class="note-title">${title}</p>
      <p class="note-text">${text}</p>
      <a class="sticker" href="${D.dm}" target="_blank" rel="noopener">${cta}</a>
    </div>`;

  const inCat = (c) => D.products.filter((p) => p.cat === c);
  const sizes = "(max-width: 760px) 100vw, 45vw";

  $('[data-grid="sneakers"]').innerHTML =
    inCat("sneakers").map((p) => item(p, sizes)).join("") +
    noteBlock("note-shoes", "Un'altra taglia o un altro modello?", "Qui trovi quello che è apparso nei video. Per qualsiasi altro articolo, l'account chiede di scrivere in DM.", "Info in DM");

  $('[data-grid="abbigliamento"]').innerHTML =
    inCat("abbigliamento").map((p) => item(p, sizes)).join("") +
    noteBlock("note-nike", "Tute Nike, qualsiasi taglia o colore", "L'account l'ha pubblicato così: «Tute Nike qualsiasi taglia o colore». Le foto te le manda in DM.", "Chiedi le foto in DM");

  $('[data-grid="orologi"]').innerHTML = inCat("orologi").map((p) => item(p, sizes)).join("");
  $('[data-grid="accessori"]').innerHTML = inCat("accessori").map((p) => item(p, "(max-width: 760px) 100vw, 58vw")).join("");

  const notes = {
    sneakers: `${inCat("sneakers").length} modelli visti nei video dell'account. Prezzo e taglia in DM.`,
    abbigliamento: "Completi estivi e tute. Alcuni, secondo l'account, in qualsiasi taglia o colore. Nelle storie in evidenza su Instagram ci sono anche giubbotti, stivaletti e maglie da calcio.",
    orologi: "Swatch × Omega MoonSwatch. Nei video compaiono con la loro scatola e, diversi, con lo scontrino.",
    accessori: "Berretti di lana con logo ricamato.",
  };
  $$("[data-note]").forEach((el) => (el.textContent = notes[el.dataset.note] || ""));

  $("[data-nav]").innerHTML = D.categories
    .map((c) => `<li><a href="#${c.id}">${c.name}</a></li>`)
    .join("") + `<li><a href="#chi-siamo">Chi siamo</a></li>`;

  /* ---------- menú móvil ---------- */
  const menu = $("[data-menu]");
  $("[data-menu-list]").innerHTML = D.categories
    .map((c) => `<li><a href="#${c.id}" data-menu-link>${c.name}<sup>${String(inCat(c.id).length).padStart(2, "0")}</sup></a></li>`)
    .join("");
  $("[data-open-menu]").addEventListener("click", () => menu.showModal());
  menu.addEventListener("click", (e) => { if (e.target.closest("[data-menu-link]")) menu.close(); });

  /* ---------- buscador ---------- */
  const sd = $("[data-search]");
  const sInput = $("[data-search-input]", sd);
  const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const renderSearch = () => {
    const q = norm(sInput.value.trim());
    const hits = D.products.filter((p) => !q || norm(`${p.brand} ${p.name} ${p.cat} ${(p.colors || []).join(" ")}`).includes(q));
    $("[data-search-list]", sd).innerHTML = hits
      .map((p) => `<li><button type="button" class="search-item" data-product="${p.id}">
          <img src="${src(p, p.imgs[0], 400)}" alt="" loading="lazy">
          <span><small>${esc(p.brand)}</small>${esc(p.name)}</span>
          <em>${esc(D.categories.find((c) => c.id === p.cat).name)}</em>
        </button></li>`)
      .join("");
    $("[data-search-empty]", sd).hidden = hits.length > 0;
  };
  sInput.addEventListener("input", renderSearch);
  $("[data-open-search]").addEventListener("click", () => { sInput.value = ""; renderSearch(); sd.showModal(); sInput.focus(); });
  sd.addEventListener("click", (e) => { if (e.target === sd) sd.close(); });

  /* ---------- pedido (estado) ---------- */
  const KEY = "is7-pedido";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY) || "[]").filter((i) => byId[i.id]); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };

  const add = (id, note = "") => {
    note = note.trim();
    const hit = cart.find((i) => i.id === id && i.note === note);
    if (hit) hit.qty += 1;
    else cart.push({ id, note, qty: 1 });
    save(); renderCart();
    const p = byId[id];
    toast(`${T.added}: ${fullName(p)}`);
  };

  /* ---------- toast ---------- */
  const toastEl = $("[data-toast]");
  let tt;
  const toast = (msg, ms = 2600) => {
    toastEl.textContent = msg;
    toastEl.setAttribute("data-show", "");
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.removeAttribute("data-show"), ms);
  };

  /* ---------- ficha de producto (pantalla completa) ---------- */
  const pd = $("[data-product-dialog]");
  const catName = Object.fromEntries(D.categories.map((c) => [c.id, c.name]));
  let current = null;
  let color = "";

  // textos fijos de la ficha
  $("[data-p-back]", pd).textContent = T.back;
  $("[data-p-price]", pd).innerHTML = T.priceLine;
  $("[data-p-color-label]", pd).textContent = T.color;
  $("[data-p-size-label]", pd).textContent = T.sizeLabel;
  $("[data-p-size-hint]", pd).textContent = T.sizeHint;
  $("[data-p-add]", pd).textContent = T.add;
  $("[data-p-dm]", pd).textContent = T.dm;
  $("[data-p-next-title]", pd).textContent = T.nextTitle;
  $("[data-p-next]", pd).innerHTML = T.next.map((t) => `<li>${esc(t)}</li>`).join("");
  $("[data-p-about-title]", pd).textContent = T.aboutTitle;
  $("[data-p-seen-title]", pd).textContent = T.seenTitle;
  $("[data-p-msg-title]", pd).textContent = T.msgTitle;
  $("[data-p-msg-hint]", pd).textContent = T.msgHint;

  // muestra de color: un tono o dos mitades
  const swatch = (c) => {
    const v = D.swatches[c];
    if (!v) return "";
    const bg = Array.isArray(v) ? `linear-gradient(135deg, ${v[0]} 50%, ${v[1]} 50%)` : v;
    return `<span class="sw" style="background:${bg}" aria-hidden="true"></span>`;
  };

  const noteFor = () => {
    const size = $("#p-size", pd).value.trim();
    return [color, size ? `taglia ${size}` : ""].filter(Boolean).join(" · ");
  };

  // el mensaje que se copia al consultar, visible y en vivo
  const dmText = () => {
    const n = noteFor();
    return `${T.dmHello}\n${fullName(current)}${n ? ` (${n})` : ""}\n${T.msgBye}`;
  };
  const renderMsg = () => { if (current) $("[data-p-msg]", pd).textContent = dmText(); };
  $("#p-size", pd).addEventListener("input", renderMsg);

  const setColor = (c) => {
    color = c;
    $("[data-p-color-sel]", pd).textContent = c ? `— ${c}` : "";
    $$("[data-p-colors] button", pd).forEach((b) => b.setAttribute("aria-pressed", b.dataset.color === c));
    renderMsg();
  };

  const specRow = (k, v) => (v ? `<div><dt>${T.specs[k]}</dt><dd>${esc(v)}</dd></div>` : "");

  const openProduct = (id) => {
    const p = byId[id];
    if (!p) return;
    current = p;
    pd.dataset.cat = p.cat;
    const cat = catName[p.cat];
    const wearable = p.cat === "sneakers" || p.cat === "abbigliamento";
    const list = inCat(p.cat);
    $("[data-p-index]", pd).textContent =
      `${cat} · ${String(list.indexOf(p) + 1).padStart(2, "0")} ${T.of} ${String(list.length).padStart(2, "0")}`;

    // sobre el modelo y lo que se ve en el video
    $("[data-p-about-wrap]", pd).hidden = !p.about;
    $("[data-p-about]", pd).textContent = p.about || "";
    $("[data-p-seen]", pd).innerHTML = p.seen.map((t) => `<li>${esc(t)}</li>`).join("");
    $("[data-p-source]", pd).textContent = `${T.photoFrom}: ${p.source}`;

    $("[data-p-crumb]", pd).innerHTML = `${esc(cat)} <span aria-hidden="true">/</span> ${esc(p.brand)}`;
    $("[data-p-brand]", pd).textContent = p.brand;
    $("[data-p-name]", pd).textContent = p.name;

    // galería: fotos apiladas en escritorio, carrusel en móvil
    const g = $("[data-p-gallery]", pd);
    g.innerHTML = p.imgs
      .map((n, i) => `<figure><img src="${src(p, n, 720)}" alt="${esc(`${p.brand} ${p.name}, foto ${i + 1}`)}" ${i ? 'loading="lazy"' : ""} decoding="async"></figure>`)
      .join("");
    g.scrollLeft = 0;
    const count = $("[data-p-count]", pd);
    count.hidden = p.imgs.length < 2;
    count.textContent = `1 / ${p.imgs.length}`;
    const thumbs = $("[data-p-thumbs]", pd);
    thumbs.hidden = p.imgs.length < 2;
    thumbs.innerHTML = p.imgs.length < 2 ? "" : p.imgs
      .map((n, i) => `<button type="button" data-thumb="${i}" aria-label="Vedi foto ${i + 1}"${i ? "" : ' aria-current="true"'}><img src="${src(p, n, 400)}" alt=""></button>`)
      .join("");

    // colores reales vistos en las fotos
    const colors = p.colors || [];
    $("[data-p-colors-wrap]", pd).hidden = !colors.length;
    $("[data-p-colors]", pd).innerHTML = colors
      .map((c) => `<button type="button" class="chip" data-color="${esc(c)}" aria-pressed="false">${swatch(c)}${esc(c)}</button>`)
      .join("");
    const any = $("[data-p-any]", pd);
    any.hidden = !p.any; any.textContent = T.anyColor;
    setColor(colors.length === 1 ? colors[0] : "");

    // talla: solo para lo que se viste o se calza
    $("[data-p-size-wrap]", pd).hidden = !wearable;
    const size = $("#p-size", pd);
    size.value = ""; size.placeholder = T.sizePh[p.cat] || "";

    // ficha técnica
    const sizeText = p.size || (p.any ? T.sizeAny : wearable ? T.sizeAsk : "");
    $("[data-p-specs]", pd).innerHTML =
      specRow("brand", p.brand) +
      specRow("cat", cat) +
      specRow("colors", colors.join(", ")) +
      specRow("size", sizeText) +
      specRow("includes", p.includes) +
      specRow("detail", p.detail) +
      specRow("price", T.priceDm);

    // más de la misma categoría (o de otras si no alcanza)
    const others = D.products.filter((x) => x.id !== p.id);
    const more = [...others.filter((x) => x.cat === p.cat), ...others.filter((x) => x.cat !== p.cat)].slice(0, 4);
    $("[data-p-more-title]", pd).textContent = T.moreTitle;
    $("[data-p-more]", pd).innerHTML = more
      .map((x) => `<button type="button" class="more-item" data-product="${x.id}">
          <span class="more-media"><img src="${src(x, x.imgs[0], 400)}" alt="" loading="lazy"></span>
          <span class="more-brand">${esc(x.brand)}</span>
          <span class="more-name">${esc(x.name)}</span>
        </button>`)
      .join("");

    // anterior / siguiente, en el orden del catálogo
    const all = D.products, k = all.indexOf(p);
    const prev = all[(k - 1 + all.length) % all.length], next = all[(k + 1) % all.length];
    const step = (x, label, cls) => `<button type="button" class="step ${cls}" data-product="${x.id}">
        <img src="${src(x, x.imgs[0], 400)}" alt="" loading="lazy">
        <span><small>${label}</small><b>${esc(x.brand)}</b>${esc(x.name)}</span>
      </button>`;
    $("[data-p-step]", pd).innerHTML = step(prev, T.prev, "step--prev") + step(next, T.nextItem, "step--next");

    renderMsg();
    if (!pd.open) pd.showModal();
    pd.scrollTop = 0;
    $("[data-p-name]", pd).focus({ preventScroll: true });
  };

  $("[data-p-colors]", pd).addEventListener("click", (e) => {
    const b = e.target.closest("[data-color]");
    if (b) setColor(color === b.dataset.color && current.colors.length > 1 ? "" : b.dataset.color);
  });

  $("[data-p-gallery]", pd).addEventListener("scroll", (e) => {
    const g = e.currentTarget;
    const i = Math.round(g.scrollLeft / g.clientWidth) + 1;
    $("[data-p-count]", pd).textContent = `${i} / ${current.imgs.length}`;
    $$("[data-thumb]", pd).forEach((t) => t.toggleAttribute("aria-current", +t.dataset.thumb === i - 1));
  }, { passive: true });

  $("[data-p-thumbs]", pd).addEventListener("click", (e) => {
    const t = e.target.closest("[data-thumb]");
    if (!t) return;
    const g = $("[data-p-gallery]", pd);
    g.scrollTo({ left: +t.dataset.thumb * g.clientWidth });
  });

  $("[data-p-form]", pd).addEventListener("submit", (e) => {
    e.preventDefault();
    if (!current) return;
    add(current.id, noteFor());
    pd.close();
  });

  $("[data-p-dm]", pd).addEventListener("click", () => sendToDm(dmText(), T.dmCopied));

  /* ---------- pedido (vista) ---------- */
  const cd = $("[data-cart-dialog]");
  $("[data-cart-title]", cd).textContent = T.cartTitle;
  $("[data-cart-empty]", cd).textContent = T.cartEmpty;
  $("[data-pill-label]").textContent = T.pill;

  const TRASH = '<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/></svg>';

  // nombre y teléfono: quedan guardados para el próximo pedido
  const fName = $("[data-cf-name]", cd), fPhone = $("[data-cf-phone]", cd);
  const CKEY = "is7-cliente";
  try { const c = JSON.parse(localStorage.getItem(CKEY) || "{}"); fName.value = c.nombre || ""; fPhone.value = c.telefono || ""; } catch (e) {}
  const saveClient = () => { try { localStorage.setItem(CKEY, JSON.stringify({ nombre: fName.value, telefono: fPhone.value })); } catch (e) {} };
  const setErr = (input, sel, msg) => {
    const el = $(sel, cd);
    el.textContent = msg || ""; el.hidden = !msg;
    input.toggleAttribute("aria-invalid", !!msg);
  };
  [fName, fPhone].forEach((f) => f.addEventListener("input", () => {
    saveClient();
    if (f === fName && fName.value.trim().length >= 2) setErr(fName, "[data-cf-name-err]");
    if (f === fPhone && fPhone.value.replace(/\D/g, "").length >= 8) setErr(fPhone, "[data-cf-phone-err]");
  }));
  const validClient = () => {
    const okName = fName.value.trim().length >= 2;
    const okPhone = fPhone.value.replace(/\D/g, "").length >= 8;
    setErr(fName, "[data-cf-name-err]", okName ? "" : T.nameErr);
    setErr(fPhone, "[data-cf-phone-err]", okPhone ? "" : T.phoneErr);
    if (!okName) fName.focus(); else if (!okPhone) fPhone.focus();
    return okName && okPhone;
  };

  function renderCart() {
    const n = cart.reduce((s, i) => s + i.qty, 0);
    $$("[data-count]").forEach((el) => {
      el.textContent = n;
      el.toggleAttribute("data-zero", n === 0);
    });
    $(".pill").hidden = n === 0;
    $$("[data-quick]").forEach((b) => b.toggleAttribute("data-in", cart.some((i) => i.id === b.dataset.quick)));

    $("[data-cart-sum]", cd).textContent = n ? `${n} ${T.cartUnit[n === 1 ? 0 : 1]} · ${T.cartSumTail}` : "";
    $("[data-cart-list]", cd).innerHTML = cart
      .map((i, k) => {
        const p = byId[i.id];
        return `<li class="cart-item">
          <div class="ci-text">
            <p class="ci-name">${esc(fullName(p))}${i.qty > 1 ? ` <span class="ci-qty">×${i.qty}</span>` : ""}</p>
            <p class="ci-meta">${esc(lineNote(p, i.note))}</p>
            <p class="ci-price">${T.price}</p>
          </div>
          <button class="ci-rm" type="button" data-rm="${k}" aria-label="Rimuovi ${esc(p.brand)} ${esc(p.name)} dall'ordine">${TRASH}</button>
        </li>`;
      })
      .join("");
    $("[data-cart-empty]", cd).hidden = n > 0;
    $("[data-fallback]", cd).hidden = true;
    $("[data-cart-done]", cd).hidden = true;
  }

  $("[data-cart-list]", cd).addEventListener("click", (e) => {
    const t = e.target.closest("[data-rm]");
    if (!t) return;
    cart.splice(+t.dataset.rm, 1);
    save(); renderCart();
  });

  // lo que se sabe de cada línea: lo elegido, o el único color visto y la talla a confirmar si se viste
  const lineNote = (p, note) => note.trim() || [
    (p.colors || []).length === 1 ? p.colors[0] : (p.colors || []).length ? "colore da confermare" : "",
    p.cat === "sneakers" || p.cat === "abbigliamento" ? "taglia da confermare" : "",
  ].filter(Boolean).join(" · ");

  // Mismo formato que el pedido de Fullfardo, adaptado: sin precios ni retiro, todo a confirmar en DM.
  const RULE = "———————————————";
  const message = () => {
    const fecha = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
    return [
      "*NUOVO ORDINE - ITALY SHOP 7*",
      RULE,
      `Cliente: ${fName.value.trim()}`,
      `Telefono: ${fPhone.value.trim()}`,
      `Data: ${fecha}`,
      RULE,
      "*ORDINE*",
      ...cart.map((i) => {
        const p = byId[i.id];
        return `* ${i.qty} ${fullName(p)} - ${lineNote(p, i.note)}`;
      }),
      RULE,
      "*Totale: da confermare*",
      RULE,
      T.msgBye,
    ].join("\n");
  };

  // Copia sincrónica: tiene que ocurrir antes de abrir Instagram (la pestaña nueva
  // le quita el foco al documento) y dentro del diálogo (el resto queda inerte).
  const copySync = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    (document.querySelector("dialog[open]") || document.body).appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return ok;
  };

  function sendToDm(text, okMsg, fallback) {
    let ok = copySync(text);
    if (!ok && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => toast(okMsg, 5000)).catch(() => {});
    }
    if (ok) toast(okMsg, 5000);
    else if (fallback) { fallback.value = text; fallback.hidden = false; fallback.select(); toast(T.copyFail, 5000); }
    const win = window.open(D.dm, "_blank");
    if (win) win.opener = null;
    else if (ok) location.href = D.dm; // ventana bloqueada: se abre en la misma pestaña (el pedido queda guardado)
  }

  /* Envío del pedido. Con número de WhatsApp (D.whatsapp) el chat se abre con el
     mensaje ya escrito, como en Fullfardo. Sin número, va por Instagram, que no
     permite precargar texto: se copia y el cliente lo pega. */
  const WA = String(D.whatsapp || "").replace(/\D/g, "");
  const sendBtn = $("[data-send]", cd);
  sendBtn.classList.toggle("btn-wa", !!WA);
  $("[data-ic-wa]", cd).toggleAttribute("hidden", !WA); // en SVG, .hidden no existe: va como atributo
  $("[data-ic-ig]", cd).toggleAttribute("hidden", !!WA);
  const sendLabel = WA ? T.cartSendWa : T.cartSend;
  $("[data-send-label]", cd).textContent = sendLabel;

  const showDone = (msg, err) => {
    const done = $("[data-cart-done]", cd);
    done.textContent = msg; done.hidden = false;
    done.toggleAttribute("data-err", !!err);
  };

  sendBtn.addEventListener("click", () => {
    if (!cart.length) { showDone(T.cartEmptyErr, true); return; }
    if (!validClient()) return;
    const text = message();
    let copied = true;
    if (!WA) {
      // la copia tiene que ser sincrónica, antes de abrir otra pestaña
      copied = copySync(text);
      // segunda vía de copia (iPhone y navegadores nuevos), dentro del mismo toque
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      if (!copied && !navigator.clipboard) { const fb = $("[data-fallback]", cd); fb.value = text; fb.hidden = false; fb.select(); }
    }
    const url = WA ? `https://wa.me/${WA}?text=${encodeURIComponent(text)}` : D.dm;
    // El chat se abre en el mismo toque, como un enlace normal: en el celular es lo
    // único que garantiza que se abra la app. «Invio dell'ordine…» es solo el aviso.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else location.href = url; // ventana bloqueada: se abre en la misma pestaña (el pedido queda guardado)
    $("[data-send-label]", cd).textContent = T.sending;
    sendBtn.classList.add("is-sending");
    showDone(WA ? T.cartDoneWa : copied || navigator.clipboard ? T.cartDone : T.copyFail);
    setTimeout(() => {
      $("[data-send-label]", cd).textContent = sendLabel;
      sendBtn.classList.remove("is-sending");
    }, 2500);
  });

  /* ---------- aperturas y cierres ---------- */
  document.addEventListener("click", (e) => {
    const prod = e.target.closest("[data-product]");
    if (prod && prod.closest("[data-search]")) { sd.close(); openProduct(prod.dataset.product); return; }
    if (prod && (!prod.closest("dialog") || prod.closest("[data-product-dialog]"))) { openProduct(prod.dataset.product); return; }
    const q = e.target.closest("[data-quick]");
    if (q) { add(q.dataset.quick); return; }
    if (e.target.closest("[data-open-cart]")) { renderCart(); cd.showModal(); return; }
    if (e.target.closest("[data-close]")) e.target.closest("dialog").close();
  });
  // clic en el fondo cierra
  cd.addEventListener("click", (e) => { if (e.target === cd) cd.close(); });

  renderCart();
})();
