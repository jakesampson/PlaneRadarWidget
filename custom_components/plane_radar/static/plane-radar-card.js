/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, tt = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, et = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let xt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== et) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (tt && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ct.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ct.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Rt = (i) => new xt(typeof i == "string" ? i : i + "", void 0, et), Tt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[r + 1], i[0]);
  return new xt(e, i, et);
}, Ot = (i, t) => {
  if (tt) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = q.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, dt = tt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Rt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Nt, getOwnPropertyDescriptor: Dt, getOwnPropertyNames: Ut, getOwnPropertySymbols: Ht, getPrototypeOf: It } = Object, K = globalThis, ht = K.trustedTypes, Lt = ht ? ht.emptyScript : "", zt = K.reactiveElementPolyfillSupport, H = (i, t) => i, G = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Lt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, st = (i, t) => !kt(i, t), pt = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: st };
Symbol.metadata ??= Symbol("metadata"), K.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = pt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Nt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: r } = Dt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: n, set(o) {
      const l = n?.call(this);
      r?.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = It(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, s = [...Ut(e), ...Ht(e)];
      for (const n of s) this.createProperty(n, e[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, n] of e) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const n = this._$Eu(e, s);
      n !== void 0 && this._$Eh.set(n, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) e.unshift(dt(n));
    } else t !== void 0 && e.push(dt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ot(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : G).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const r = s.getPropertyOptions(n), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : G;
      this._$Em = n;
      const l = o.fromAttribute(e, r.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (r = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? st)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: r }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, r] of s) {
        const { wrapped: o } = r, l = this[n];
        o !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, r, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[H("elementProperties")] = /* @__PURE__ */ new Map(), P[H("finalized")] = /* @__PURE__ */ new Map(), zt?.({ ReactiveElement: P }), (K.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = globalThis, ut = (i) => i, W = it.trustedTypes, ft = W ? W.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, At = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, wt = "?" + b, Ft = `<${wt}>`, S = document, I = () => S.createComment(""), L = (i) => i === null || typeof i != "object" && typeof i != "function", nt = Array.isArray, jt = (i) => nt(i) || typeof i?.[Symbol.iterator] == "function", Y = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, mt = />/g, $ = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _t = /'/g, bt = /"/g, St = /^(?:script|style|textarea|title)$/i, Bt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), x = Bt(1), T = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), $t = /* @__PURE__ */ new WeakMap(), A = S.createTreeWalker(S, 129);
function Mt(i, t) {
  if (!nt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ft !== void 0 ? ft.createHTML(t) : t;
}
const qt = (i, t) => {
  const e = i.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = N;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let c, d, h = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, d = o.exec(a), d !== null); ) u = o.lastIndex, o === N ? d[1] === "!--" ? o = gt : d[1] !== void 0 ? o = mt : d[2] !== void 0 ? (St.test(d[2]) && (n = RegExp("</" + d[2], "g")), o = $) : d[3] !== void 0 && (o = $) : o === $ ? d[0] === ">" ? (o = n ?? N, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, c = d[1], o = d[3] === void 0 ? $ : d[3] === '"' ? bt : _t) : o === bt || o === _t ? o = $ : o === gt || o === mt ? o = N : (o = $, n = void 0);
    const g = o === $ && i[l + 1].startsWith("/>") ? " " : "";
    r += o === N ? a + Ft : h >= 0 ? (s.push(c), a.slice(0, h) + At + a.slice(h) + b + g) : a + b + (h === -2 ? l : g);
  }
  return [Mt(i, r + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class z {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [c, d] = qt(t, e);
    if (this.el = z.createElement(c, s), A.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = A.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(At)) {
          const u = d[o++], g = n.getAttribute(h).split(b), m = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: r, name: m[2], strings: g, ctor: m[1] === "." ? Wt : m[1] === "?" ? Vt : m[1] === "@" ? Kt : J }), n.removeAttribute(h);
        } else h.startsWith(b) && (a.push({ type: 6, index: r }), n.removeAttribute(h));
        if (St.test(n.tagName)) {
          const h = n.textContent.split(b), u = h.length - 1;
          if (u > 0) {
            n.textContent = W ? W.emptyScript : "";
            for (let g = 0; g < u; g++) n.append(h[g], I()), A.nextNode(), a.push({ type: 2, index: ++r });
            n.append(h[u], I());
          }
        }
      } else if (n.nodeType === 8) if (n.data === wt) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(b, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += b.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = S.createElement("template");
    return s.innerHTML = t, s;
  }
}
function O(i, t, e = i, s) {
  if (t === T) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = L(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = O(i, n._$AS(i, t.values), n, s)), t;
}
class Gt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? S).importNode(e, !0);
    A.currentNode = n;
    let r = A.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new F(r, r.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (c = new Jt(r, this, t)), this._$AV.push(c), a = s[++l];
      }
      o !== a?.index && (r = A.nextNode(), o++);
    }
    return A.currentNode = S, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class F {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, n) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = O(this, t, e), L(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : jt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = z.createElement(Mt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const r = new Gt(n, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = $t.get(t.strings);
    return e === void 0 && $t.set(t.strings, e = new z(t)), e;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const r of t) n === e.length ? e.push(s = new F(this.O(I()), this.O(I()), this, this.options)) : s = e[n], s._$AI(r), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = ut(t).nextSibling;
      ut(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, r) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = O(this, t, e, 0), o = !L(t) || t !== this._$AH && t !== T, o && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = r[0], a = 0; a < r.length - 1; a++) c = O(this, l[s + a], e, a), c === T && (c = this._$AH[a]), o ||= !L(c) || c !== this._$AH[a], c === p ? t = p : t !== p && (t += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Vt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Kt extends J {
  constructor(t, e, s, n, r) {
    super(t, e, s, n, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? p) === T) return;
    const s = this._$AH, n = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== p && (s === p || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Jt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const Zt = it.litHtmlPolyfillSupport;
Zt?.(z, F), (it.litHtmlVersions ??= []).push("3.3.3");
const Xt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = n = new F(t.insertBefore(I(), r), r, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis;
class R extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Xt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return T;
  }
}
R._$litElement$ = !0, R.finalized = !0, ot.litElementHydrateSupport?.({ LitElement: R });
const Yt = ot.litElementPolyfillSupport;
Yt?.({ LitElement: R });
(ot.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: st }, te = (i = Qt, t, e) => {
  const { kind: s, metadata: n } = e;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), r.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function rt(i) {
  return (t, e) => typeof e == "object" ? te(i, t, e) : ((s, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(i) {
  return rt({ ...i, state: !0, attribute: !1 });
}
const ee = 3440.065, w = (i) => i * Math.PI / 180, se = (i) => i * 180 / Math.PI;
function ie(i, t, e, s) {
  const n = w(e - i), r = w(s - t), o = Math.sin(n / 2) * Math.sin(n / 2) + Math.cos(w(i)) * Math.cos(w(e)) * Math.sin(r / 2) * Math.sin(r / 2);
  return 2 * ee * Math.asin(Math.min(1, Math.sqrt(o)));
}
function ne(i, t, e, s) {
  const n = w(i), r = w(e), o = w(s - t), l = Math.sin(o) * Math.cos(r), a = Math.cos(n) * Math.sin(r) - Math.sin(n) * Math.cos(r) * Math.cos(o);
  return (se(Math.atan2(l, a)) + 360) % 360;
}
const oe = 0.539957;
function re(i) {
  return i / oe;
}
function ae(i, t) {
  if (t === "km") {
    const e = re(i);
    return e < 10 ? `${e.toFixed(1)} km` : `${Math.round(e)} km`;
  }
  return i < 10 ? `${i.toFixed(1)} nm` : `${Math.round(i)} nm`;
}
const v = "#2bffa0", j = "#8affce", vt = "rgba(43, 255, 160, 0.28)", yt = "rgba(43, 255, 160, 0.12)", Q = 78, E = Math.PI * 2, y = Math.PI / 180;
class le {
  constructor(t) {
    this.aircraft = [], this.options = {
      rangeNm: 50,
      rings: 4,
      sweepDurationSec: 6,
      distanceUnit: "nm",
      showLabels: !0,
      selectedId: null
    }, this.raf = 0, this.layout = { cx: 0, cy: 0, radius: 0 }, this.canvas = t;
    const e = t.getContext("2d");
    if (!e) throw new Error("Canvas 2D context unavailable");
    this.ctx = e, this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(t), this.resize();
  }
  destroy() {
    cancelAnimationFrame(this.raf), this.resizeObserver.disconnect();
  }
  setAircraft(t) {
    this.aircraft = t;
  }
  setOptions(t) {
    this.options = { ...this.options, ...t };
  }
  getLayout() {
    return this.layout;
  }
  start() {
    const t = () => {
      this.draw(), this.raf = requestAnimationFrame(t);
    };
    this.raf = requestAnimationFrame(t);
  }
  /** Hit-test in CSS pixel coordinates relative to the canvas. */
  hitTest(t, e) {
    const { cx: s, cy: n, radius: r } = this.layout;
    if (r <= 0) return null;
    const { rangeNm: o } = this.options;
    let l = null, a = 1 / 0;
    for (const c of this.aircraft) {
      if (c.distanceNm > o) continue;
      const d = this.project(c, s, n, r), h = Math.hypot(d.x - t, d.y - e), u = Math.max(16, r * 0.045);
      h < u && h < a && (l = c, a = h);
    }
    return l;
  }
  project(t, e, s, n) {
    const r = t.distanceNm / this.options.rangeNm * n, o = (t.bearingDeg - 90) * y;
    return { x: e + r * Math.cos(o), y: s + r * Math.sin(o) };
  }
  resize() {
    const t = this.canvas.getBoundingClientRect(), e = Math.min(window.devicePixelRatio || 1, 2.5), s = Math.max(1, Math.round(t.width)), n = Math.max(1, Math.round(t.height));
    (this.canvas.width !== s * e || this.canvas.height !== n * e) && (this.canvas.width = s * e, this.canvas.height = n * e);
  }
  draw() {
    const { ctx: t, canvas: e } = this, s = Math.min(window.devicePixelRatio || 1, 2.5), n = e.width / s, r = e.height / s;
    if (n < 10 || r < 10) return;
    t.setTransform(s, 0, 0, s, 0, 0), t.clearRect(0, 0, n, r);
    const o = n / 2, l = r / 2, a = Math.min(n, r) / 2 - 26;
    this.layout = { cx: o, cy: l, radius: a };
    const c = performance.now(), d = c / 1e3 / this.options.sweepDurationSec * 360 % 360;
    this.drawBackground(o, l, a), this.drawGrid(o, l, a), this.drawRim(o, l, a), this.drawSweep(o, l, a, d, c), this.drawBlips(o, l, a, d, c), this.drawOwnship(o, l);
  }
  drawBackground(t, e, s) {
    const { ctx: n } = this, r = n.createRadialGradient(t, e, 0, t, e, s);
    r.addColorStop(0, "#04281a"), r.addColorStop(0.75, "#02180f"), r.addColorStop(1, "#010f09"), n.fillStyle = r, n.beginPath(), n.arc(t, e, s, 0, E), n.fill();
  }
  drawGrid(t, e, s) {
    const { ctx: n, options: r } = this;
    n.save(), n.strokeStyle = yt, n.lineWidth = 1;
    for (let a = 0; a < 360; a += 30) {
      const c = (a - 90) * y;
      n.beginPath(), n.moveTo(t, e), n.lineTo(t + s * Math.cos(c), e + s * Math.sin(c)), n.stroke();
    }
    n.strokeStyle = vt, n.beginPath(), n.moveTo(t - s, e), n.lineTo(t + s, e), n.moveTo(t, e - s), n.lineTo(t, e + s), n.stroke();
    const o = Math.max(1, Math.round(r.rings));
    for (let a = 1; a <= o; a++)
      n.strokeStyle = a === o ? vt : yt, n.lineWidth = a === o ? 2 : 1, n.beginPath(), n.arc(t, e, s * a / o, 0, E), n.stroke();
    n.fillStyle = "rgba(43, 255, 160, 0.55)", n.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.textAlign = "left";
    const l = -45 * y;
    for (let a = 1; a <= o; a++) {
      const c = s * a / o, d = t + c * Math.cos(l) + 4, h = e + c * Math.sin(l) - 2;
      n.fillText(ae(r.rangeNm * a / o, r.distanceUnit), d, h);
    }
    n.restore();
  }
  drawRim(t, e, s) {
    const { ctx: n } = this;
    n.save(), n.strokeStyle = v, n.lineWidth = 2, n.shadowColor = v, n.shadowBlur = 12, n.beginPath(), n.arc(t, e, s, 0, E), n.stroke(), n.restore(), n.save(), n.strokeStyle = v, n.fillStyle = v, n.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.textAlign = "center", n.textBaseline = "middle";
    for (let r = 0; r < 360; r += 5) {
      const o = r % 30 === 0, l = r % 90 === 0, a = (r - 90) * y, c = s + (o ? 12 : 6), d = s + (o ? 22 : 11);
      if (n.lineWidth = o ? 2 : 1, n.beginPath(), n.moveTo(t + c * Math.cos(a), e + c * Math.sin(a)), n.lineTo(t + d * Math.cos(a), e + d * Math.sin(a)), n.stroke(), o) {
        const h = s + 22, u = t + h * Math.cos(a), g = e + h * Math.sin(a);
        l ? (n.font = "bold 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.fillStyle = j, n.fillText(["N", "E", "S", "W"][r / 90], u, g), n.font = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace") : (n.fillStyle = "rgba(43, 255, 160, 0.75)", n.fillText(String(r).padStart(3, "0"), u, g));
      }
    }
    n.restore();
  }
  drawSweep(t, e, s, n, r) {
    const { ctx: o } = this, l = (n - 90) * y, a = (n - Q - 90) * y, c = Q / 360, d = o.createConicGradient(a, t, e);
    d.addColorStop(0, "rgba(43, 255, 160, 0)"), d.addColorStop(c * 0.55, "rgba(43, 255, 160, 0.10)"), d.addColorStop(c * 0.85, "rgba(43, 255, 160, 0.22)"), d.addColorStop(c, "rgba(120, 255, 200, 0.55)"), d.addColorStop(Math.min(1, c + 2e-3), "rgba(43, 255, 160, 0)"), d.addColorStop(1, "rgba(43, 255, 160, 0)"), o.save(), o.beginPath(), o.moveTo(t, e), o.arc(t, e, s, a, l), o.closePath(), o.fillStyle = d, o.fill();
    const h = (r / 1e3 / this.options.sweepDurationSec % 1 + 1) % 1;
    o.strokeStyle = `rgba(43, 255, 160, ${(0.16 * (1 - h)).toFixed(3)})`, o.lineWidth = 2, o.beginPath(), o.arc(t, e, h * s, 0, E), o.stroke(), o.strokeStyle = j, o.shadowColor = v, o.shadowBlur = 14, o.lineWidth = 2.5, o.beginPath(), o.moveTo(t, e), o.lineTo(t + s * Math.cos(l), e + s * Math.sin(l)), o.stroke(), o.restore();
  }
  drawBlips(t, e, s, n, r) {
    const { ctx: o, options: l } = this, a = Math.max(6, Math.min(10, s * 0.032));
    o.save(), o.textBaseline = "middle";
    for (const c of this.aircraft) {
      if (c.distanceNm > l.rangeNm) continue;
      const { x: d, y: h } = this.project(c, t, e, s), u = (n - c.bearingDeg + 360) % 360, g = Math.max(0, 1 - u / Q), m = Math.pow(g, 1.7), lt = 0.2 + 0.8 * m, Z = l.selectedId === c.id;
      if (c.onGround) {
        o.strokeStyle = `rgba(255, 210, 110, ${(0.35 + 0.5 * m).toFixed(3)})`, o.lineWidth = 1.5;
        const C = a * 0.75;
        o.strokeRect(d - C / 2, h - C / 2, C, C);
        continue;
      }
      const X = o.createRadialGradient(d, h, 0, d, h, a * 2.6);
      if (X.addColorStop(0, `rgba(120, 255, 200, ${(0.75 * lt).toFixed(3)})`), X.addColorStop(1, "rgba(43, 255, 160, 0)"), o.fillStyle = X, o.beginPath(), o.arc(d, h, a * 2.6, 0, E), o.fill(), o.save(), o.translate(d, h), o.rotate((c.headingDeg ?? c.bearingDeg) * y), o.fillStyle = `rgba(140, 255, 205, ${lt.toFixed(3)})`, o.shadowColor = v, o.shadowBlur = Z ? 16 : 6 + 10 * m, this.tracePlane(a), o.fill(), o.restore(), Z) {
        const C = a + 7 + Math.sin(r / 300) * 1.5;
        o.strokeStyle = j, o.lineWidth = 1.6, o.setLineDash([5, 4]), o.lineDashOffset = -r / 40, o.beginPath(), o.arc(d, h, C, 0, E), o.stroke(), o.setLineDash([]);
      }
      l.showLabels && (m > 0.28 || Z) && (o.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", o.textAlign = "left", o.fillStyle = `rgba(160, 255, 210, ${(0.55 + 0.45 * m).toFixed(3)})`, o.fillText(c.callsign, d + a + 4, h));
    }
    o.restore();
  }
  /** Simple top-view plane silhouette, nose pointing up (north), centered on origin. */
  tracePlane(t) {
    const { ctx: e } = this, s = t / 10;
    e.beginPath(), e.moveTo(0, -9 * s), e.lineTo(1.6 * s, -4 * s), e.lineTo(7.5 * s, 2.5 * s), e.lineTo(7.5 * s, 4.5 * s), e.lineTo(1.9 * s, 3.2 * s), e.lineTo(1.4 * s, 6.5 * s), e.lineTo(3.6 * s, 8.8 * s), e.lineTo(3.6 * s, 10 * s), e.lineTo(0, 9 * s), e.lineTo(-3.6 * s, 10 * s), e.lineTo(-3.6 * s, 8.8 * s), e.lineTo(-1.4 * s, 6.5 * s), e.lineTo(-1.9 * s, 3.2 * s), e.lineTo(-7.5 * s, 4.5 * s), e.lineTo(-7.5 * s, 2.5 * s), e.lineTo(-1.6 * s, -4 * s), e.closePath();
  }
  drawOwnship(t, e) {
    const { ctx: s } = this;
    s.save(), s.translate(t, e), s.strokeStyle = j, s.lineWidth = 1.6, s.shadowColor = v, s.shadowBlur = 8, this.tracePlane(7), s.stroke(), s.restore();
  }
}
const ce = Tt`
  :host {
    display: block;
  }

  ha-card {
    overflow: hidden;
    background: #010f09;
    border: 1px solid rgba(43, 255, 160, 0.35);
    border-radius: 10px;
    box-shadow: 0 0 18px rgba(43, 255, 160, 0.12), inset 0 0 40px rgba(43, 255, 160, 0.05);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    color: #8affce;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px 8px;
    border-bottom: 1px solid rgba(43, 255, 160, 0.25);
    background: linear-gradient(180deg, rgba(43, 255, 160, 0.08), transparent);
  }

  .title {
    font-size: 13px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #b4ffd9;
    text-shadow: 0 0 8px rgba(43, 255, 160, 0.65);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contacts {
    font-size: 11px;
    letter-spacing: 0.18em;
    padding: 3px 10px;
    border: 1px solid rgba(43, 255, 160, 0.5);
    border-radius: 999px;
    color: #2bffa0;
    background: rgba(43, 255, 160, 0.08);
    text-shadow: 0 0 6px rgba(43, 255, 160, 0.6);
    white-space: nowrap;
  }

  .radar-wrap {
    position: relative;
    aspect-ratio: 1 / 1;
    width: 100%;
    background: radial-gradient(circle at center, #04281a 0%, #02180f 75%, #010f09 100%);
  }

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    cursor: crosshair;
  }

  /* CRT overlays: scanlines + vignette */
  .scanlines,
  .vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .scanlines {
    background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.13) 0px,
      rgba(0, 0, 0, 0.13) 1px,
      transparent 1px,
      transparent 4px
    );
    opacity: 0.55;
  }

  .vignette {
    background: radial-gradient(circle at center, transparent 55%, rgba(0, 0, 0, 0.5) 100%);
  }

  .notice {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;
    padding: 24px;
    color: #ffb454;
    font-size: 12px;
    letter-spacing: 0.08em;
    background: rgba(1, 15, 9, 0.72);
    z-index: 5;
  }

  .notice code {
    background: rgba(255, 180, 84, 0.12);
    border: 1px solid rgba(255, 180, 84, 0.4);
    border-radius: 4px;
    padding: 2px 6px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 14px;
    border-top: 1px solid rgba(43, 255, 160, 0.25);
    font-size: 10px;
    letter-spacing: 0.12em;
    color: rgba(138, 255, 206, 0.75);
    background: linear-gradient(0deg, rgba(43, 255, 160, 0.06), transparent);
    white-space: nowrap;
    overflow: hidden;
  }

  .footer .seg {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer .error {
    color: #ff7a5c;
    text-shadow: 0 0 6px rgba(255, 122, 92, 0.6);
    animation: blink 1.4s steps(2, start) infinite;
  }

  @keyframes blink {
    to {
      visibility: hidden;
    }
  }

  /* Flight details panel */
  .details {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    z-index: 6;
    background: rgba(2, 24, 15, 0.92);
    border: 1px solid rgba(43, 255, 160, 0.45);
    border-radius: 8px;
    box-shadow: 0 0 22px rgba(43, 255, 160, 0.18);
    padding: 10px 12px;
    backdrop-filter: blur(3px);
  }

  .details-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    border-bottom: 1px solid rgba(43, 255, 160, 0.3);
    padding-bottom: 6px;
    margin-bottom: 8px;
  }

  .callsign {
    font-size: 18px;
    letter-spacing: 0.18em;
    color: #b4ffd9;
    text-shadow: 0 0 10px rgba(43, 255, 160, 0.7);
  }

  .type {
    font-size: 11px;
    letter-spacing: 0.12em;
    color: rgba(138, 255, 206, 0.7);
    margin-left: 8px;
  }

  .close {
    appearance: none;
    border: 1px solid rgba(43, 255, 160, 0.4);
    background: transparent;
    color: #8affce;
    border-radius: 4px;
    font: inherit;
    font-size: 11px;
    padding: 2px 8px;
    cursor: pointer;
    letter-spacing: 0.1em;
  }

  .close:hover {
    background: rgba(43, 255, 160, 0.15);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px 10px;
  }

  .field label {
    display: block;
    font-size: 8px;
    letter-spacing: 0.2em;
    color: rgba(138, 255, 206, 0.55);
    text-transform: uppercase;
    margin-bottom: 2px;
  }

  .field span {
    font-size: 12px;
    color: #d7ffeb;
    letter-spacing: 0.05em;
  }

  @media (max-width: 480px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .footer {
      flex-wrap: wrap;
      white-space: normal;
    }
  }
`, Et = 250, Pt = 5, de = {
  "adsb.lol": { name: "adsb.lol", url: "https://adsb.lol" },
  "adsb.fi": { name: "adsb.fi", url: "https://adsb.fi" }
};
function f(i) {
  return typeof i == "number" && Number.isFinite(i) ? i : typeof i == "string" && i.trim() !== "" && Number.isFinite(Number(i)) ? Number(i) : null;
}
function D(i) {
  if (typeof i != "string") return null;
  const t = i.trim();
  return t === "" ? null : t;
}
function he(i, t, e) {
  const s = f(i?.lat), n = f(i?.lon);
  if (s === null || n === null) return null;
  const r = D(i?.hex) ?? `${s.toFixed(3)}:${n.toFixed(3)}`, o = D(i?.flight), l = i?.alt_baro, a = typeof l == "string" && l.toLowerCase() === "ground", c = a ? null : f(l) ?? f(i?.alt_geom), d = f(i?.track) ?? f(i?.true_heading) ?? f(i?.nav_heading) ?? f(i?.mag_heading);
  return {
    id: r,
    callsign: o ?? r.toUpperCase(),
    typeCode: D(i?.t) ?? D(i?.category),
    altitudeFt: c !== null ? Math.round(c) : null,
    onGround: a,
    speedKt: f(i?.gs) ?? f(i?.tas) ?? f(i?.ias),
    headingDeg: d !== null ? (d % 360 + 360) % 360 : null,
    lat: s,
    lon: n,
    verticalRateFpm: f(i?.baro_rate) ?? f(i?.vert_rate),
    squawk: D(i?.squawk),
    rssi: f(i?.rssi),
    distanceNm: ie(t, e, s, n),
    bearingDeg: ne(t, e, s, n)
  };
}
function pe(i) {
  if (i && typeof i.error == "string")
    throw new Error(i.error);
  return Array.isArray(i?.ac) ? i.ac : [];
}
async function ue(i, t, e, s, n, r) {
  const o = Math.min(Et, Math.max(Pt, Math.round(n))), l = `lat=${e}&lon=${s}&radius=${o}&provider=${encodeURIComponent(t)}`;
  let a;
  if (r) {
    const c = r.includes("?") ? "&" : "?", d = await fetch(`${r}${c}${l}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(12e3)
    });
    if (!d.ok)
      throw new Error(`${r} returned HTTP ${d.status}`);
    a = await d.json();
  } else
    a = await i.callApi("GET", `plane_radar/aircraft?${l}`);
  return pe(a).map((c) => he(c, e, s)).filter((c) => c !== null).sort((c, d) => c.distanceNm - d.distanceNm);
}
function fe(i, t) {
  return t ? "GND" : i === null ? "—" : `${Math.round(i).toLocaleString()} ft`;
}
function ge(i) {
  return i === null ? "—" : `${Math.round(i)} kt`;
}
function me(i) {
  return i === null ? "—" : `${String(Math.round(i)).padStart(3, "0")}°`;
}
function _e(i) {
  return i === null ? "—" : Math.abs(i) < 64 ? "0 fpm" : `${i > 0 ? "▲" : "▼"} ${Math.abs(Math.round(i))} fpm`;
}
function be(i, t) {
  if (t === "km") {
    const e = i * 1.852;
    return e < 10 ? `${e.toFixed(1)} km` : `${Math.round(e)} km`;
  }
  return i < 10 ? `${i.toFixed(1)} nm` : `${Math.round(i)} nm`;
}
function $e(i) {
  return i.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
var ve = Object.defineProperty, ye = Object.getOwnPropertyDescriptor, at = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? ye(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && ve(t, e, n), n;
};
const xe = {
  title: "Title",
  location_mode: "Radar position",
  latitude: "Latitude",
  longitude: "Longitude",
  provider: "Data provider (via Plane Radar integration)",
  api_url: "API base URL override (advanced)",
  range_nm: "Range (nautical miles)",
  rings: "Range rings",
  update_interval: "Update interval (seconds)",
  sweep_duration: "Sweep duration (seconds / revolution)",
  distance_unit: "Distance unit",
  show_labels: "Show callsign labels"
};
let V = class extends R {
  constructor() {
    super(...arguments), this._computeLabel = (i) => xe[i.name] ?? i.name;
  }
  setConfig(i) {
    this._config = i;
  }
  _valueChanged(i) {
    const t = i.detail.value;
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: t }, bubbles: !0, composed: !0 })
    );
  }
  _schema() {
    const i = this._config?.location_mode === "manual", t = [
      { name: "title", selector: { text: {} } },
      {
        name: "location_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "ha", label: "Home Assistant home location" },
              { value: "manual", label: "Manual latitude / longitude" }
            ]
          }
        }
      }
    ];
    return i && t.push(
      { name: "latitude", selector: { number: { min: -90, max: 90, step: 1e-4, mode: "box" } } },
      { name: "longitude", selector: { number: { min: -180, max: 180, step: 1e-4, mode: "box" } } }
    ), t.push(
      {
        name: "provider",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "adsb.lol", label: "adsb.lol (free, no key)" },
              { value: "adsb.fi", label: "adsb.fi (free, personal/non-commercial)" }
            ]
          }
        }
      },
      { name: "range_nm", selector: { number: { min: 5, max: 250, step: 5, mode: "slider" } } },
      { name: "rings", selector: { number: { min: 1, max: 8, step: 1, mode: "slider" } } },
      { name: "update_interval", selector: { number: { min: 5, max: 300, step: 5, mode: "slider" } } },
      { name: "sweep_duration", selector: { number: { min: 2, max: 20, step: 0.5, mode: "slider" } } },
      {
        name: "distance_unit",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "nm", label: "Nautical miles (nm)" },
              { value: "km", label: "Kilometers (km)" }
            ]
          }
        }
      },
      { name: "show_labels", selector: { boolean: {} } },
      { name: "api_url", selector: { text: { type: "url", placeholder: "https://my-proxy.example.com/aircraft" } } }
    ), t;
  }
  render() {
    if (!this._config) return p;
    const i = {
      update_interval: 10,
      sweep_duration: 6,
      rings: 4,
      range_nm: 50,
      distance_unit: "nm",
      provider: "adsb.lol",
      location_mode: "ha",
      show_labels: !0,
      ...this._config
    };
    return x`
      <ha-form
        .hass=${this.hass}
        .data=${i}
        .schema=${this._schema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p style="font-size: 12px; opacity: 0.7; margin: 8px 4px 0;">
        “Home Assistant home location” uses <code>zone.home</code> (falling back to the system
        location from your HA configuration). Manual mode lets you point the radar at any
        coordinates. By default aircraft data is relayed by the <b>Plane Radar integration</b>
        (required). <code>api_url</code> is an advanced override for a custom compatible proxy —
        it receives <code>?lat=&amp;lon=&amp;radius=&amp;provider=</code> and must return
        readsb-style <code>{ ac: [...] }</code> JSON.
      </p>
    `;
  }
};
at([
  rt({ attribute: !1 })
], V.prototype, "hass", 2);
at([
  k()
], V.prototype, "_config", 2);
V = at([
  Ct("plane-radar-card-editor")
], V);
var Ae = Object.defineProperty, we = Object.getOwnPropertyDescriptor, M = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? we(t, e) : t, r = i.length - 1, o; r >= 0; r--)
    (o = i[r]) && (n = (s ? o(t, e, n) : o(n)) || n);
  return s && n && Ae(t, e, n), n;
};
const Se = "0.1.0", U = {
  title: "AIRSPACE RADAR",
  location_mode: "ha",
  provider: "adsb.lol",
  range_nm: 50,
  rings: 4,
  update_interval: 10,
  sweep_duration: 6,
  distance_unit: "nm",
  show_labels: !0
};
let _ = class extends R {
  constructor() {
    super(...arguments), this._aircraft = [], this._selected = null, this._error = null, this._lastUpdated = null, this._renderer = null, this._pollTimer = null, this._fetching = !1, this._hassNudged = !1;
  }
  setConfig(i) {
    if (!i || typeof i != "object")
      throw new Error("Invalid configuration");
    const t = { ...U, ...i };
    if (t.location_mode === "manual") {
      const { latitude: e, longitude: s } = t;
      if (typeof e != "number" || !Number.isFinite(e) || e < -90 || e > 90 || typeof s != "number" || !Number.isFinite(s) || s < -180 || s > 180)
        throw new Error('Manual location mode requires a valid "latitude" (-90..90) and "longitude" (-180..180)');
    }
    t.range_nm = B(t.range_nm ?? U.range_nm, Pt, Et), t.rings = B(Math.round(t.rings ?? U.rings), 1, 8), t.update_interval = B(t.update_interval ?? U.update_interval, 5, 300), t.sweep_duration = B(t.sweep_duration ?? U.sweep_duration, 2, 20), this._config = t, this._applyRendererOptions(), this._restartPolling();
  }
  getCardSize() {
    return 7;
  }
  static getStubConfig() {
    return { location_mode: "ha", range_nm: 50, rings: 4, provider: "adsb.lol" };
  }
  static getConfigElement() {
    return document.createElement("plane-radar-card-editor");
  }
  connectedCallback() {
    super.connectedCallback(), this._restartPolling();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopPolling(), this._renderer?.destroy(), this._renderer = null;
  }
  firstUpdated() {
    const i = this.renderRoot.querySelector("canvas");
    i && (this._renderer = new le(i), this._applyRendererOptions(), this._renderer.setAircraft(this._aircraft), this._renderer.start()), this._restartPolling();
  }
  updated() {
    this._applyRendererOptions(), this.hass && !this._hassNudged && !this._lastUpdated && !this._fetching && (this._hassNudged = !0, this._poll());
  }
  _applyRendererOptions() {
    !this._renderer || !this._config || this._renderer.setOptions({
      rangeNm: this._config.range_nm,
      rings: this._config.rings,
      sweepDurationSec: this._config.sweep_duration,
      distanceUnit: this._config.distance_unit ?? "nm",
      showLabels: this._config.show_labels ?? !0,
      selectedId: this._selected?.id ?? null
    });
  }
  _resolveLocation() {
    const i = this._config;
    if (!i) return null;
    if (i.location_mode === "manual")
      return { latitude: i.latitude, longitude: i.longitude, source: "manual" };
    const t = this.hass?.states?.["zone.home"], e = t?.attributes?.latitude, s = t?.attributes?.longitude;
    if (typeof e == "number" && typeof s == "number")
      return { latitude: e, longitude: s, source: "zone.home" };
    const n = this.hass?.config?.latitude, r = this.hass?.config?.longitude;
    return typeof n == "number" && typeof r == "number" ? { latitude: n, longitude: r, source: "hass.config" } : null;
  }
  _restartPolling() {
    this._stopPolling(), !(!this.isConnected || !this._config) && (this._poll(), this._pollTimer = window.setInterval(() => this._poll(), this._config.update_interval * 1e3));
  }
  _stopPolling() {
    this._pollTimer !== null && (window.clearInterval(this._pollTimer), this._pollTimer = null);
  }
  async _poll() {
    const i = this._config;
    if (!i || this._fetching) return;
    const t = this._resolveLocation();
    if (!(!t || !this.hass)) {
      this._fetching = !0;
      try {
        const e = await ue(
          this.hass,
          i.provider ?? "adsb.lol",
          t.latitude,
          t.longitude,
          i.range_nm,
          i.api_url
        );
        if (this._aircraft = e, this._renderer?.setAircraft(e), this._lastUpdated = /* @__PURE__ */ new Date(), this._error = null, this._selected) {
          const s = e.find((n) => n.id === this._selected.id);
          this._selected = s ?? null;
        }
      } catch (e) {
        this._error = e instanceof Error ? e.message : String(e);
      } finally {
        this._fetching = !1;
      }
    }
  }
  _onCanvasClick(i) {
    if (!this._renderer) return;
    const e = i.currentTarget.getBoundingClientRect(), s = this._renderer.hitTest(i.clientX - e.left, i.clientY - e.top);
    this._selected = s && s.id !== this._selected?.id ? s : null, this._applyRendererOptions();
  }
  render() {
    if (!this._config) return p;
    const i = this._config, t = this._resolveLocation(), e = i.distance_unit ?? "nm", s = de[i.provider ?? "adsb.lol"], n = this._aircraft.filter((r) => r.distanceNm <= i.range_nm).length;
    return x`
      <ha-card>
        <div class="header">
          <div class="title">${i.title}</div>
          <div class="contacts">${n} CONTACT${n === 1 ? "" : "S"}</div>
        </div>
        <div class="radar-wrap">
          <canvas @click=${this._onCanvasClick}></canvas>
          <div class="scanlines"></div>
          <div class="vignette"></div>
          ${t === null ? x`
                <div class="notice">
                  <div>⚠ NO RADAR POSITION</div>
                  <div>
                    ${i.location_mode === "manual" ? "Set a valid latitude and longitude in the card configuration." : x`Home location unavailable. Set <code>location_mode: manual</code> with
                          <code>latitude</code> and <code>longitude</code>, or enable the Home location zone in Home Assistant.`}
                  </div>
                </div>` : p}
          ${this._selected ? this._renderDetails(this._selected, e) : p}
        </div>
        <div class="footer">
          <span class="seg">SRC ${s.name.toUpperCase()} · RNG ${i.range_nm} NM</span>
          <span class="seg">
            ${t ? `${t.latitude.toFixed(3)}° / ${t.longitude.toFixed(3)}° · ${t.source.toUpperCase()}` : "NO POSITION"}
          </span>
          <span class="seg ${this._error ? "error" : ""}">
            ${this._error ? "LINK LOST – RETRYING" : this._lastUpdated ? `UPDATED ${$e(this._lastUpdated)}` : "ACQUIRING…"}
          </span>
        </div>
      </ha-card>
    `;
  }
  _renderDetails(i, t) {
    const e = [
      ["Altitude", fe(i.altitudeFt, i.onGround)],
      ["Ground speed", ge(i.speedKt)],
      ["Track", me(i.headingDeg)],
      ["Vert. rate", _e(i.verticalRateFpm)],
      ["Distance", be(i.distanceNm, t)],
      ["Bearing", `${String(Math.round(i.bearingDeg)).padStart(3, "0")}°`],
      ["Squawk", i.squawk ?? "—"],
      ["RSSI", i.rssi !== null ? `${i.rssi.toFixed(1)} dBFS` : "—"]
    ];
    return x`
      <div class="details" @click=${(s) => s.stopPropagation()}>
        <div class="details-head">
          <div>
            <span class="callsign">${i.callsign}</span>
            ${i.typeCode ? x`<span class="type">${i.typeCode}</span>` : p}
          </div>
          <button class="close" @click=${() => {
      this._selected = null, this._applyRendererOptions();
    }}>
            CLOSE
          </button>
        </div>
        <div class="grid">
          ${e.map(
      ([s, n]) => x`
              <div class="field">
                <label>${s}</label>
                <span>${n}</span>
              </div>`
    )}
        </div>
      </div>
    `;
  }
};
_.styles = ce;
M([
  rt({ attribute: !1 })
], _.prototype, "hass", 2);
M([
  k()
], _.prototype, "_config", 2);
M([
  k()
], _.prototype, "_aircraft", 2);
M([
  k()
], _.prototype, "_selected", 2);
M([
  k()
], _.prototype, "_error", 2);
M([
  k()
], _.prototype, "_lastUpdated", 2);
_ = M([
  Ct("plane-radar-card")
], _);
function B(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
window.customCards ??= [];
window.customCards.push({
  type: "plane-radar-card",
  name: "Plane Radar Card",
  description: "Military-style sweeping ADS-B radar of the aircraft around your home.",
  preview: "false"
});
console.info(`%c PLANE-RADAR-CARD %c v${Se} `, "background:#04281a;color:#2bffa0;font-weight:bold", "background:#2bffa0;color:#04281a;font-weight:bold");
export {
  _ as PlaneRadarCard
};
