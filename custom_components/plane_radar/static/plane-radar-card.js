/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, lt = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = Symbol(), mt = /* @__PURE__ */ new WeakMap();
let Rt = class {
  constructor(t, s, e) {
    if (this._$cssResult$ = !0, e !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (lt && t === void 0) {
      const e = s !== void 0 && s.length === 1;
      e && (t = mt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && mt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ft = (i) => new Rt(typeof i == "string" ? i : i + "", void 0, ct), jt = (i, ...t) => {
  const s = i.length === 1 ? i[0] : t.reduce((e, n, o) => e + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new Rt(s, i, ct);
}, Bt = (i, t) => {
  if (lt) i.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const e = document.createElement("style"), n = Z.litNonce;
    n !== void 0 && e.setAttribute("nonce", n), e.textContent = s.cssText, i.appendChild(e);
  }
}, _t = lt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const e of t.cssRules) s += e.cssText;
  return Ft(s);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: qt, defineProperty: Gt, getOwnPropertyDescriptor: Wt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Vt, getPrototypeOf: Jt } = Object, et = globalThis, bt = et.trustedTypes, Xt = bt ? bt.emptyScript : "", Zt = et.reactiveElementPolyfillSupport, B = (i, t) => i, Y = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Xt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let s = i;
  switch (t) {
    case Boolean:
      s = i !== null;
      break;
    case Number:
      s = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(i);
      } catch {
        s = null;
      }
  }
  return s;
} }, dt = (i, t) => !qt(i, t), $t = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: dt };
Symbol.metadata ??= Symbol("metadata"), et.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let D = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = $t) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const e = Symbol(), n = this.getPropertyDescriptor(t, e, s);
      n !== void 0 && Gt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, s, e) {
    const { get: n, set: o } = Wt(this.prototype, t) ?? { get() {
      return this[s];
    }, set(r) {
      this[s] = r;
    } };
    return { get: n, set(r) {
      const l = n?.call(this);
      o?.call(this, r), this.requestUpdate(t, l, e);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? $t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(B("elementProperties"))) return;
    const t = Jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(B("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(B("properties"))) {
      const s = this.properties, e = [...Kt(s), ...Vt(s)];
      for (const n of e) this.createProperty(n, s[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [e, n] of s) this.elementProperties.set(e, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, e] of this.elementProperties) {
      const n = this._$Eu(s, e);
      n !== void 0 && this._$Eh.set(n, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const e = new Set(t.flat(1 / 0).reverse());
      for (const n of e) s.unshift(_t(n));
    } else t !== void 0 && s.push(_t(t));
    return s;
  }
  static _$Eu(t, s) {
    const e = s.attribute;
    return e === !1 ? void 0 : typeof e == "string" ? e : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const e of s.keys()) this.hasOwnProperty(e) && (t.set(e, this[e]), delete this[e]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Bt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, e) {
    this._$AK(t, e);
  }
  _$ET(t, s) {
    const e = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, e);
    if (n !== void 0 && e.reflect === !0) {
      const o = (e.converter?.toAttribute !== void 0 ? e.converter : Y).toAttribute(s, e.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const e = this.constructor, n = e._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = e.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Y;
      this._$Em = n;
      const l = r.fromAttribute(s, o.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, s, e, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), e ??= r.getPropertyOptions(t), !((e.hasChanged ?? dt)(o, s) || e.useDefault && e.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, e)))) return;
      this.C(t, s, e);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: e, reflect: n, wrapped: o }, r) {
    e && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || e || (s = void 0), this._$AL.set(t, s)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const e = this.constructor.elementProperties;
      if (e.size > 0) for (const [n, o] of e) {
        const { wrapped: r } = o, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (e) {
      throw t = !1, this._$EM(), e;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[B("elementProperties")] = /* @__PURE__ */ new Map(), D[B("finalized")] = /* @__PURE__ */ new Map(), Zt?.({ ReactiveElement: D }), (et.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht = globalThis, vt = (i) => i, Q = ht.trustedTypes, yt = Q ? Q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Nt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, Dt = "?" + y, Yt = `<${Dt}>`, T = document, q = () => T.createComment(""), G = (i) => i === null || typeof i != "object" && typeof i != "function", pt = Array.isArray, Qt = (i) => pt(i) || typeof i?.[Symbol.iterator] == "function", it = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, xt = /-->/g, wt = />/g, w = RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), At = /'/g, St = /"/g, kt = /^(?:script|style|textarea|title)$/i, te = (i) => (t, ...s) => ({ _$litType$: i, strings: t, values: s }), M = te(1), U = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), Mt = /* @__PURE__ */ new WeakMap(), C = T.createTreeWalker(T, 129);
function Ot(i, t) {
  if (!pt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return yt !== void 0 ? yt.createHTML(t) : t;
}
const ee = (i, t) => {
  const s = i.length - 1, e = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = F;
  for (let l = 0; l < s; l++) {
    const a = i[l];
    let c, d, h = -1, g = 0;
    for (; g < a.length && (r.lastIndex = g, d = r.exec(a), d !== null); ) g = r.lastIndex, r === F ? d[1] === "!--" ? r = xt : d[1] !== void 0 ? r = wt : d[2] !== void 0 ? (kt.test(d[2]) && (n = RegExp("</" + d[2], "g")), r = w) : d[3] !== void 0 && (r = w) : r === w ? d[0] === ">" ? (r = n ?? F, h = -1) : d[1] === void 0 ? h = -2 : (h = r.lastIndex - d[2].length, c = d[1], r = d[3] === void 0 ? w : d[3] === '"' ? St : At) : r === St || r === At ? r = w : r === xt || r === wt ? r = F : (r = w, n = void 0);
    const p = r === w && i[l + 1].startsWith("/>") ? " " : "";
    o += r === F ? a + Yt : h >= 0 ? (e.push(c), a.slice(0, h) + Nt + a.slice(h) + y + p) : a + y + (h === -2 ? l : p);
  }
  return [Ot(i, o + (i[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), e];
};
class W {
  constructor({ strings: t, _$litType$: s }, e) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [c, d] = ee(t, s);
    if (this.el = W.createElement(c, e), C.currentNode = this.el.content, s === 2 || s === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = C.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(Nt)) {
          const g = d[r++], p = n.getAttribute(h).split(y), f = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: f[2], strings: p, ctor: f[1] === "." ? ie : f[1] === "?" ? ne : f[1] === "@" ? re : st }), n.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: o }), n.removeAttribute(h));
        if (kt.test(n.tagName)) {
          const h = n.textContent.split(y), g = h.length - 1;
          if (g > 0) {
            n.textContent = Q ? Q.emptyScript : "";
            for (let p = 0; p < g; p++) n.append(h[p], q()), C.nextNode(), a.push({ type: 2, index: ++o });
            n.append(h[g], q());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Dt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += y.length - 1;
      }
      o++;
    }
  }
  static createElement(t, s) {
    const e = T.createElement("template");
    return e.innerHTML = t, e;
  }
}
function H(i, t, s = i, e) {
  if (t === U) return t;
  let n = e !== void 0 ? s._$Co?.[e] : s._$Cl;
  const o = G(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, s, e)), e !== void 0 ? (s._$Co ??= [])[e] = n : s._$Cl = n), n !== void 0 && (t = H(i, n._$AS(i, t.values), n, e)), t;
}
class se {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: e } = this._$AD, n = (t?.creationScope ?? T).importNode(s, !0);
    C.currentNode = n;
    let o = C.nextNode(), r = 0, l = 0, a = e[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new K(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new oe(o, this, t)), this._$AV.push(c), a = e[++l];
      }
      r !== a?.index && (o = C.nextNode(), r++);
    }
    return C.currentNode = T, n;
  }
  p(t) {
    let s = 0;
    for (const e of this._$AV) e !== void 0 && (e.strings !== void 0 ? (e._$AI(t, e, s), s += e.strings.length - 2) : e._$AI(t[s])), s++;
  }
}
class K {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, e, n) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = e, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = H(this, t, s), G(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && G(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: e } = t, n = typeof e == "number" ? this._$AC(t) : (e.el === void 0 && (e.el = W.createElement(Ot(e.h, e.h[0]), this.options)), e);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const o = new se(n, this), r = o.u(this.options);
      o.p(s), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = Mt.get(t.strings);
    return s === void 0 && Mt.set(t.strings, s = new W(t)), s;
  }
  k(t) {
    pt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let e, n = 0;
    for (const o of t) n === s.length ? s.push(e = new K(this.O(q()), this.O(q()), this, this.options)) : e = s[n], e._$AI(o), n++;
    n < s.length && (this._$AR(e && e._$AB.nextSibling, n), s.length = n);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const e = vt(t).nextSibling;
      vt(t).remove(), t = e;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class st {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, e, n, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = s, this._$AM = n, this.options = o, e.length > 2 || e[0] !== "" || e[1] !== "" ? (this._$AH = Array(e.length - 1).fill(new String()), this.strings = e) : this._$AH = u;
  }
  _$AI(t, s = this, e, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = H(this, t, s, 0), r = !G(t) || t !== this._$AH && t !== U, r && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = H(this, l[e + a], s, a), c === U && (c = this._$AH[a]), r ||= !G(c) || c !== this._$AH[a], c === u ? t = u : t !== u && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ie extends st {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class ne extends st {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class re extends st {
  constructor(t, s, e, n, o) {
    super(t, s, e, n, o), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = H(this, t, s, 0) ?? u) === U) return;
    const e = this._$AH, n = t === u && e !== u || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive, o = t !== u && (e === u || n);
    n && this.element.removeEventListener(this.name, this, e), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class oe {
  constructor(t, s, e) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = e;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    H(this, t);
  }
}
const ae = ht.litHtmlPolyfillSupport;
ae?.(W, K), (ht.litHtmlVersions ??= []).push("3.3.3");
const le = (i, t, s) => {
  const e = s?.renderBefore ?? t;
  let n = e._$litPart$;
  if (n === void 0) {
    const o = s?.renderBefore ?? null;
    e._$litPart$ = n = new K(t.insertBefore(q(), o), o, void 0, s ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut = globalThis;
class O extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = le(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return U;
  }
}
O._$litElement$ = !0, O.finalized = !0, ut.litElementHydrateSupport?.({ LitElement: O });
const ce = ut.litElementPolyfillSupport;
ce?.({ LitElement: O });
(ut.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ut = (i) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = { attribute: !0, type: String, converter: Y, reflect: !1, hasChanged: dt }, he = (i = de, t, s) => {
  const { kind: e, metadata: n } = s;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), e === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(s.name, i), e === "accessor") {
    const { name: r } = s;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, i, l), l;
    } };
  }
  if (e === "setter") {
    const { name: r } = s;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + e);
};
function gt(i) {
  return (t, s) => typeof s == "object" ? he(i, t, s) : ((e, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, e), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function I(i) {
  return gt({ ...i, state: !0, attribute: !1 });
}
const pe = 3440.065, Ht = 0.539957, It = 0.868976, P = (i) => i * Math.PI / 180, ue = (i) => i * 180 / Math.PI;
function ge(i, t, s, e) {
  const n = P(s - i), o = P(e - t), r = Math.sin(n / 2) * Math.sin(n / 2) + Math.cos(P(i)) * Math.cos(P(s)) * Math.sin(o / 2) * Math.sin(o / 2);
  return 2 * pe * Math.asin(Math.min(1, Math.sqrt(r)));
}
function fe(i, t, s, e) {
  const n = P(i), o = P(s), r = P(e - t), l = Math.sin(r) * Math.cos(o), a = Math.cos(n) * Math.sin(o) - Math.sin(n) * Math.cos(o) * Math.cos(r);
  return (ue(Math.atan2(l, a)) + 360) % 360;
}
function me(i) {
  return i / Ht;
}
function _e(i) {
  return i * Ht;
}
function be(i) {
  return i / It;
}
function $e(i) {
  return i * It;
}
function ot(i, t) {
  return t === "km" ? _e(i) : t === "mi" ? $e(i) : i;
}
function k(i, t) {
  return t === "km" ? me(i) : t === "mi" ? be(i) : i;
}
function at(i, t) {
  const s = k(i, t), e = t === "km" ? "km" : t === "mi" ? "mi" : "nm";
  return s < 10 ? `${s.toFixed(1)} ${e}` : `${Math.round(s)} ${e}`;
}
const b = "#2bffa0", X = "#8affce", Ct = "rgba(43, 255, 160, 0.28)", Pt = "rgba(43, 255, 160, 0.12)", nt = 78, A = Math.PI * 2, S = Math.PI / 180, Tt = 240;
function ve(i, t) {
  return Math.abs(i.distanceNm - t.distanceNm) <= 5e-3 && Math.abs(i.bearingDeg - t.bearingDeg) <= 0.05;
}
class ye {
  constructor(t) {
    this.aircraft = [], this.options = {
      rangeNm: 50,
      rings: 4,
      sweepDurationSec: 6,
      distanceUnit: "nm",
      showLabels: !0,
      selectedId: null,
      trailSeconds: 60
    }, this.raf = 0, this.layout = { cx: 0, cy: 0, radius: 0 }, this.trails = /* @__PURE__ */ new Map(), this.states = /* @__PURE__ */ new Map(), this.lastSweepDeg = null, this.canvas = t;
    const s = t.getContext("2d");
    if (!s) throw new Error("Canvas 2D context unavailable");
    this.ctx = s, this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(t), this.resize();
  }
  destroy() {
    cancelAnimationFrame(this.raf), this.resizeObserver.disconnect(), this.trails.clear(), this.states.clear();
  }
  setAircraft(t) {
    this.aircraft = t;
    const s = /* @__PURE__ */ new Set();
    for (const e of t) {
      s.add(e.id);
      const n = this.states.get(e.id);
      if (!n) {
        this.states.set(e.id, {
          display: { distanceNm: e.distanceNm, bearingDeg: e.bearingDeg },
          headingDeg: e.headingDeg,
          pending: {
            distanceNm: e.distanceNm,
            bearingDeg: e.bearingDeg,
            headingDeg: e.headingDeg
          },
          revealDeg: e.bearingDeg,
          visible: !1
        });
        continue;
      }
      const o = n.pending ?? n.display;
      ve(o, e) || (n.pending = {
        distanceNm: e.distanceNm,
        bearingDeg: e.bearingDeg,
        headingDeg: e.headingDeg
      }, n.revealDeg = e.bearingDeg);
    }
    for (const e of this.states.keys())
      s.has(e) || this.states.delete(e);
    this.pruneTrails(performance.now());
  }
  setOptions(t) {
    const s = this.options.trailSeconds;
    this.options = { ...this.options, ...t }, t.trailSeconds !== void 0 && t.trailSeconds !== s && this.pruneTrails(performance.now());
  }
  /**
   * Forget all tracks and contact states (e.g. the radar centre moved or the
   * card reloaded). The next data update starts a clean scope.
   */
  clearHistory() {
    this.trails.clear(), this.states.clear(), this.lastSweepDeg = null;
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
  hitTest(t, s) {
    const { cx: e, cy: n, radius: o } = this.layout;
    if (o <= 0) return null;
    const { rangeNm: r } = this.options;
    let l = null, a = 1 / 0;
    for (const c of this.aircraft) {
      const d = this.states.get(c.id);
      if (!d || !d.visible || d.display.distanceNm > r) continue;
      const h = this.projectPolar(
        d.display.distanceNm,
        d.display.bearingDeg,
        e,
        n,
        o
      ), g = Math.hypot(h.x - t, h.y - s), p = Math.max(16, o * 0.045);
      g < p && g < a && (l = c, a = g);
    }
    return l;
  }
  projectPolar(t, s, e, n, o) {
    const r = t / this.options.rangeNm * o, l = (s - 90) * S;
    return { x: e + r * Math.cos(l), y: n + r * Math.sin(l) };
  }
  /**
   * Paint pending contact updates when the sweep crosses their bearing. This
   * keeps every blip in step with the rotating beam instead of having the
   * whole scope jump at once when a poll completes.
   */
  applyPendingReveals(t, s) {
    const e = this.lastSweepDeg;
    if (this.lastSweepDeg = t, e === null) return;
    const n = (t - e + 360) % 360;
    if (!(n <= 0))
      for (const [o, r] of this.states)
        !r.pending || (r.revealDeg - e + 360) % 360 > n || (r.display = {
          distanceNm: r.pending.distanceNm,
          bearingDeg: r.pending.bearingDeg
        }, r.headingDeg = r.pending.headingDeg, r.pending = null, r.visible = !0, this.pushTrackPoint(o, r.display.distanceNm, r.display.bearingDeg, s));
  }
  /** Append a revealed position to an aircraft's historical track. */
  pushTrackPoint(t, s, e, n) {
    const o = this.options.trailSeconds;
    if (o <= 0) return;
    const r = o * 1e3, l = this.trails.get(t) ?? [], a = l[l.length - 1];
    for ((!a || Math.abs(a.distanceNm - s) > 5e-3 || Math.abs(a.bearingDeg - e) > 0.05) && l.push({ t: n, distanceNm: s, bearingDeg: e }); l.length > 0 && n - l[0].t > r; ) l.shift();
    l.length > Tt && l.splice(0, l.length - Tt), this.trails.set(t, l);
  }
  /** Remove expired historical track samples. */
  pruneTrails(t) {
    const s = this.options.trailSeconds;
    if (s <= 0) {
      this.trails.clear();
      return;
    }
    const e = s * 1e3;
    for (const [n, o] of this.trails) {
      const r = o.filter((l) => t - l.t <= e);
      r.length === 0 ? this.trails.delete(n) : r.length !== o.length && this.trails.set(n, r);
    }
  }
  resize() {
    const t = this.canvas.getBoundingClientRect(), s = Math.min(window.devicePixelRatio || 1, 2.5), e = Math.max(1, Math.round(t.width)), n = Math.max(1, Math.round(t.height));
    (this.canvas.width !== e * s || this.canvas.height !== n * s) && (this.canvas.width = e * s, this.canvas.height = n * s);
  }
  draw() {
    const { ctx: t, canvas: s } = this, e = Math.min(window.devicePixelRatio || 1, 2.5), n = s.width / e, o = s.height / e;
    if (n < 10 || o < 10) return;
    t.setTransform(e, 0, 0, e, 0, 0), t.clearRect(0, 0, n, o);
    const r = n / 2, l = o / 2, a = Math.min(n, o) / 2 - 26;
    this.layout = { cx: r, cy: l, radius: a };
    const c = performance.now(), d = c / 1e3 / this.options.sweepDurationSec * 360 % 360;
    this.applyPendingReveals(d, c), this.drawBackground(r, l, a), this.drawGrid(r, l, a), this.drawRim(r, l, a), this.drawSweep(r, l, a, d, c), this.drawTrails(r, l, a, c), this.drawBlips(r, l, a, d, c), this.drawHome(r, l);
  }
  drawBackground(t, s, e) {
    const { ctx: n } = this, o = n.createRadialGradient(t, s, 0, t, s, e);
    o.addColorStop(0, "#04281a"), o.addColorStop(0.75, "#02180f"), o.addColorStop(1, "#010f09"), n.fillStyle = o, n.beginPath(), n.arc(t, s, e, 0, A), n.fill();
  }
  drawGrid(t, s, e) {
    const { ctx: n, options: o } = this;
    n.save(), n.strokeStyle = Pt, n.lineWidth = 1;
    for (let a = 0; a < 360; a += 30) {
      const c = (a - 90) * S;
      n.beginPath(), n.moveTo(t, s), n.lineTo(t + e * Math.cos(c), s + e * Math.sin(c)), n.stroke();
    }
    n.strokeStyle = Ct, n.beginPath(), n.moveTo(t - e, s), n.lineTo(t + e, s), n.moveTo(t, s - e), n.lineTo(t, s + e), n.stroke();
    const r = Math.max(1, Math.round(o.rings));
    for (let a = 1; a <= r; a++)
      n.strokeStyle = a === r ? Ct : Pt, n.lineWidth = a === r ? 2 : 1, n.beginPath(), n.arc(t, s, e * a / r, 0, A), n.stroke();
    n.fillStyle = "rgba(43, 255, 160, 0.55)", n.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.textAlign = "left";
    const l = -45 * S;
    for (let a = 1; a <= r; a++) {
      const c = e * a / r, d = t + c * Math.cos(l) + 4, h = s + c * Math.sin(l) - 2;
      n.fillText(at(o.rangeNm * a / r, o.distanceUnit), d, h);
    }
    n.restore();
  }
  drawRim(t, s, e) {
    const { ctx: n } = this;
    n.save(), n.strokeStyle = b, n.lineWidth = 2, n.shadowColor = b, n.shadowBlur = 12, n.beginPath(), n.arc(t, s, e, 0, A), n.stroke(), n.restore(), n.save(), n.strokeStyle = b, n.fillStyle = b, n.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.textAlign = "center", n.textBaseline = "middle";
    for (let o = 0; o < 360; o += 5) {
      const r = o % 30 === 0, l = o % 90 === 0, a = (o - 90) * S, c = e + (r ? 12 : 6), d = e + (r ? 22 : 11);
      if (n.lineWidth = r ? 2 : 1, n.beginPath(), n.moveTo(t + c * Math.cos(a), s + c * Math.sin(a)), n.lineTo(t + d * Math.cos(a), s + d * Math.sin(a)), n.stroke(), r) {
        const h = e + 22, g = t + h * Math.cos(a), p = s + h * Math.sin(a);
        l ? (n.font = "bold 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.fillStyle = X, n.fillText(["N", "E", "S", "W"][o / 90], g, p), n.font = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace") : (n.fillStyle = "rgba(43, 255, 160, 0.75)", n.fillText(String(o).padStart(3, "0"), g, p));
      }
    }
    n.restore();
  }
  drawSweep(t, s, e, n, o) {
    const { ctx: r } = this, l = (n - 90) * S, a = (n - nt - 90) * S, c = nt / 360, d = r.createConicGradient(a, t, s);
    d.addColorStop(0, "rgba(43, 255, 160, 0)"), d.addColorStop(c * 0.55, "rgba(43, 255, 160, 0.10)"), d.addColorStop(c * 0.85, "rgba(43, 255, 160, 0.22)"), d.addColorStop(c, "rgba(120, 255, 200, 0.55)"), d.addColorStop(Math.min(1, c + 2e-3), "rgba(43, 255, 160, 0)"), d.addColorStop(1, "rgba(43, 255, 160, 0)"), r.save(), r.beginPath(), r.moveTo(t, s), r.arc(t, s, e, a, l), r.closePath(), r.fillStyle = d, r.fill();
    const h = (o / 1e3 / this.options.sweepDurationSec % 1 + 1) % 1;
    r.strokeStyle = `rgba(43, 255, 160, ${(0.16 * (1 - h)).toFixed(3)})`, r.lineWidth = 2, r.beginPath(), r.arc(t, s, h * e, 0, A), r.stroke(), r.strokeStyle = X, r.shadowColor = b, r.shadowBlur = 14, r.lineWidth = 2.5, r.beginPath(), r.moveTo(t, s), r.lineTo(t + e * Math.cos(l), s + e * Math.sin(l)), r.stroke(), r.restore();
  }
  /**
   * Historical track: a fading phosphor line through the last
   * `trailSeconds` of sampled positions (default one minute).
   */
  drawTrails(t, s, e, n) {
    const { ctx: o, options: r } = this, l = r.trailSeconds;
    if (l <= 0 || this.trails.size === 0) return;
    const a = l * 1e3;
    o.save(), o.beginPath(), o.arc(t, s, e, 0, A), o.clip(), o.lineCap = "round", o.lineJoin = "round", o.strokeStyle = b;
    for (const [c, d] of this.trails) {
      if (d.length < 2) continue;
      const h = r.selectedId === c, g = h ? 0.62 : 0.34;
      o.lineWidth = h ? 1.8 : 1.2;
      for (let p = 1; p < d.length; p++) {
        const f = d[p - 1], z = d[p], V = n - z.t;
        if (V > a) continue;
        const R = Math.max(0, 1 - V / a);
        if (R <= 0) continue;
        const L = this.projectPolar(f.distanceNm, f.bearingDeg, t, s, e), x = this.projectPolar(z.distanceNm, z.bearingDeg, t, s, e);
        o.globalAlpha = g * R, o.beginPath(), o.moveTo(L.x, L.y), o.lineTo(x.x, x.y), o.stroke();
      }
    }
    o.restore();
  }
  drawBlips(t, s, e, n, o) {
    const { ctx: r, options: l } = this, a = Math.max(6, Math.min(10, e * 0.032));
    r.save(), r.textBaseline = "middle";
    for (const c of this.aircraft) {
      const d = this.states.get(c.id);
      if (!d || !d.visible) continue;
      const { distanceNm: h, bearingDeg: g } = d.display;
      if (h > l.rangeNm) continue;
      const { x: p, y: f } = this.projectPolar(h, g, t, s, e), z = (n - g + 360) % 360, V = Math.max(0, 1 - z / nt), R = Math.pow(V, 1.7), L = 0.2 + 0.8 * R, x = l.selectedId === c.id;
      if (c.onGround) {
        r.strokeStyle = `rgba(255, 210, 110, ${(0.35 + 0.5 * R).toFixed(3)})`, r.lineWidth = 1.5;
        const _ = a * 0.75;
        r.strokeRect(p - _ / 2, f - _ / 2, _, _);
      } else {
        const _ = r.createRadialGradient(p, f, 0, p, f, a * 2.6);
        if (_.addColorStop(0, `rgba(120, 255, 200, ${(0.75 * L).toFixed(3)})`), _.addColorStop(1, "rgba(43, 255, 160, 0)"), r.fillStyle = _, r.beginPath(), r.arc(p, f, a * 2.6, 0, A), r.fill(), r.save(), r.translate(p, f), r.rotate((d.headingDeg ?? g) * S), r.fillStyle = `rgba(140, 255, 205, ${L.toFixed(3)})`, r.shadowColor = b, r.shadowBlur = x ? 16 : 6 + 10 * R, this.tracePlane(a), r.fill(), r.restore(), x) {
          const J = a + 7 + Math.sin(o / 300) * 1.5;
          r.strokeStyle = X, r.lineWidth = 1.6, r.setLineDash([5, 4]), r.lineDashOffset = -o / 40, r.beginPath(), r.arc(p, f, J, 0, A), r.stroke(), r.setLineDash([]);
        }
      }
      if (l.showLabels) {
        const _ = p >= t, J = a + 4;
        r.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", r.textAlign = _ ? "right" : "left", r.fillStyle = x ? "#d7ffeb" : "rgba(160, 255, 210, 0.88)", r.shadowColor = b, r.shadowBlur = x ? 8 : 4, r.fillText(c.callsign, p + (_ ? -J : J), f), r.shadowBlur = 0;
      }
    }
    r.restore();
  }
  /** Simple top-view plane silhouette, nose pointing up (north), centered on origin. */
  tracePlane(t) {
    const { ctx: s } = this, e = t / 10;
    s.beginPath(), s.moveTo(0, -9 * e), s.lineTo(1.6 * e, -4 * e), s.lineTo(7.5 * e, 2.5 * e), s.lineTo(7.5 * e, 4.5 * e), s.lineTo(1.9 * e, 3.2 * e), s.lineTo(1.4 * e, 6.5 * e), s.lineTo(3.6 * e, 8.8 * e), s.lineTo(3.6 * e, 10 * e), s.lineTo(0, 9 * e), s.lineTo(-3.6 * e, 10 * e), s.lineTo(-3.6 * e, 8.8 * e), s.lineTo(-1.4 * e, 6.5 * e), s.lineTo(-1.9 * e, 3.2 * e), s.lineTo(-7.5 * e, 4.5 * e), s.lineTo(-7.5 * e, 2.5 * e), s.lineTo(-1.6 * e, -4 * e), s.closePath();
  }
  /** Simple house silhouette for the radar centre (home location). */
  traceHouse(t) {
    const { ctx: s } = this, e = t / 10;
    s.beginPath(), s.moveTo(-9 * e, -1 * e), s.lineTo(0, -9 * e), s.lineTo(9 * e, -1 * e), s.lineTo(7 * e, -1 * e), s.lineTo(7 * e, 9 * e), s.lineTo(2.5 * e, 9 * e), s.lineTo(2.5 * e, 3 * e), s.lineTo(-2.5 * e, 3 * e), s.lineTo(-2.5 * e, 9 * e), s.lineTo(-7 * e, 9 * e), s.lineTo(-7 * e, -1 * e), s.closePath();
  }
  drawHome(t, s) {
    const { ctx: e } = this;
    e.save(), e.translate(t, s), e.strokeStyle = X, e.lineWidth = 1.6, e.lineJoin = "round", e.shadowColor = b, e.shadowBlur = 8, this.traceHouse(8), e.stroke(), e.restore();
  }
}
const xe = jt`
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
    width: 100%;
    /* Fixed scope height keeps the card compact on wide dashboards. Without
       --radar-h the scope falls back to a square sized from the card width. */
    height: var(--radar-h, auto);
    aspect-ratio: 1 / 1;
    background: radial-gradient(circle at center, #04281a 0%, #02180f 75%, #010f09 100%);
  }

  canvas {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    /* Stay square and centred inside a wider card instead of stretching. */
    width: min(100%, var(--radar-h, 100%));
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
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    width: min(calc(100% - 20px), calc(var(--radar-h, 100%) - 20px));
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
`, zt = 250, Lt = 5, we = {
  "adsb.lol": { name: "adsb.lol", url: "https://adsb.lol" },
  "adsb.fi": { name: "adsb.fi", url: "https://adsb.fi" }
};
function m(i) {
  return typeof i == "number" && Number.isFinite(i) ? i : typeof i == "string" && i.trim() !== "" && Number.isFinite(Number(i)) ? Number(i) : null;
}
function j(i) {
  if (typeof i != "string") return null;
  const t = i.trim();
  return t === "" ? null : t;
}
function Ae(i, t, s) {
  const e = m(i?.lat), n = m(i?.lon);
  if (e === null || n === null) return null;
  const o = j(i?.hex) ?? `${e.toFixed(3)}:${n.toFixed(3)}`, r = j(i?.flight), l = i?.alt_baro, a = typeof l == "string" && l.toLowerCase() === "ground", c = a ? null : m(l) ?? m(i?.alt_geom), d = m(i?.track) ?? m(i?.true_heading) ?? m(i?.nav_heading) ?? m(i?.mag_heading);
  return {
    id: o,
    callsign: r ?? o.toUpperCase(),
    typeCode: j(i?.t) ?? j(i?.category),
    altitudeFt: c !== null ? Math.round(c) : null,
    onGround: a,
    speedKt: m(i?.gs) ?? m(i?.tas) ?? m(i?.ias),
    headingDeg: d !== null ? (d % 360 + 360) % 360 : null,
    lat: e,
    lon: n,
    verticalRateFpm: m(i?.baro_rate) ?? m(i?.vert_rate),
    squawk: j(i?.squawk),
    rssi: m(i?.rssi),
    distanceNm: ge(t, s, e, n),
    bearingDeg: fe(t, s, e, n)
  };
}
function Se(i) {
  if (i && typeof i.error == "string")
    throw new Error(i.error);
  return Array.isArray(i?.ac) ? i.ac : [];
}
async function Me(i, t, s, e, n, o) {
  const r = Math.min(zt, Math.max(Lt, Math.ceil(n))), l = `lat=${s}&lon=${e}&radius=${r}&provider=${encodeURIComponent(t)}`;
  let a;
  if (o) {
    const c = o.includes("?") ? "&" : "?", d = await fetch(`${o}${c}${l}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(12e3)
    });
    if (!d.ok)
      throw new Error(`${o} returned HTTP ${d.status}`);
    a = await d.json();
  } else
    a = await i.callApi("GET", `plane_radar/aircraft?${l}`);
  return Se(a).map((c) => Ae(c, s, e)).filter((c) => c !== null).sort((c, d) => c.distanceNm - d.distanceNm);
}
function Ce(i, t) {
  return t ? "GND" : i === null ? "—" : `${Math.round(i).toLocaleString()} ft`;
}
function Pe(i) {
  return i === null ? "—" : `${Math.round(i)} kt`;
}
function Te(i) {
  return i === null ? "—" : `${String(Math.round(i)).padStart(3, "0")}°`;
}
function Ee(i) {
  return i === null ? "—" : Math.abs(i) < 64 ? "0 fpm" : `${i > 0 ? "▲" : "▼"} ${Math.abs(Math.round(i))} fpm`;
}
function Re(i) {
  return i.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
var Ne = Object.defineProperty, De = Object.getOwnPropertyDescriptor, ft = (i, t, s, e) => {
  for (var n = e > 1 ? void 0 : e ? De(t, s) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (e ? r(t, s, n) : r(n)) || n);
  return e && n && Ne(t, s, n), n;
};
const ke = {
  title: "Title",
  location_mode: "Radar position",
  latitude: "Latitude",
  longitude: "Longitude",
  provider: "Data provider (via Plane Radar integration)",
  api_url: "API base URL override (advanced)",
  distance_unit: "Distance unit (range, rings & details)",
  range: "Range",
  rings: "Range rings",
  update_interval: "Update interval (seconds)",
  sweep_duration: "Sweep duration (seconds / revolution)",
  trail_seconds: "Historical track (seconds)",
  height: "Radar height (px, 0 = fit card width)",
  show_labels: "Show callsign labels"
}, Oe = {
  nm: { min: 5, max: 250, step: 5 },
  mi: { min: 6, max: 290, step: 5 },
  km: { min: 10, max: 465, step: 10 }
}, Et = 50;
function rt(i) {
  return Math.round(i * 10) / 10;
}
let tt = class extends O {
  constructor() {
    super(...arguments), this._computeLabel = (i) => ke[i.name] ?? i.name;
  }
  setConfig(i) {
    this._config = i;
  }
  _currentUnit() {
    const i = this._config?.distance_unit;
    return i === "km" || i === "mi" ? i : "nm";
  }
  _valueChanged(i) {
    const s = { ...i.detail.value }, e = this._currentUnit(), n = s.distance_unit === "km" || s.distance_unit === "mi" ? s.distance_unit : "nm";
    if (n !== e) {
      const o = typeof s.range == "number" ? s.range : typeof s.range_nm == "number" ? k(s.range_nm, e) : Et;
      s.range = rt(k(ot(o, e), n));
    }
    s.distance_unit = n, typeof s.range != "number" && typeof s.range_nm == "number" && (s.range = rt(k(s.range_nm, n))), delete s.range_nm, this._config = s, this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: s }, bubbles: !0, composed: !0 })
    );
  }
  _schema() {
    const i = this._config?.location_mode === "manual", t = this._currentUnit(), s = Oe[t], e = [
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
    return i && e.push(
      { name: "latitude", selector: { number: { min: -90, max: 90, step: 1e-4, mode: "box" } } },
      { name: "longitude", selector: { number: { min: -180, max: 180, step: 1e-4, mode: "box" } } }
    ), e.push(
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
      {
        name: "distance_unit",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "nm", label: "Nautical miles (nm)" },
              { value: "mi", label: "Miles (mi)" },
              { value: "km", label: "Kilometers (km)" }
            ]
          }
        }
      },
      {
        name: "range",
        selector: {
          number: { min: s.min, max: s.max, step: s.step, mode: "slider" }
        }
      },
      { name: "rings", selector: { number: { min: 1, max: 8, step: 1, mode: "slider" } } },
      { name: "update_interval", selector: { number: { min: 5, max: 300, step: 5, mode: "slider" } } },
      { name: "sweep_duration", selector: { number: { min: 2, max: 20, step: 0.5, mode: "slider" } } },
      { name: "trail_seconds", selector: { number: { min: 0, max: 300, step: 10, mode: "slider" } } },
      { name: "height", selector: { number: { min: 0, max: 800, step: 20, mode: "slider" } } },
      { name: "show_labels", selector: { boolean: {} } },
      { name: "api_url", selector: { text: { type: "url", placeholder: "https://my-proxy.example.com/aircraft" } } }
    ), e;
  }
  render() {
    if (!this._config) return u;
    const i = this._config, t = this._currentUnit(), s = typeof i.range == "number" ? i.range : typeof i.range_nm == "number" ? rt(k(i.range_nm, t)) : Et, e = {
      update_interval: 10,
      sweep_duration: 6,
      rings: 4,
      trail_seconds: 60,
      height: 360,
      provider: "adsb.lol",
      location_mode: "ha",
      show_labels: !0,
      ...i,
      distance_unit: t,
      range: s
    };
    return M`
      <ha-form
        .hass=${this.hass}
        .data=${e}
        .schema=${this._schema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p style="font-size: 12px; opacity: 0.7; margin: 8px 4px 0;">
        “Home Assistant home location” uses <code>zone.home</code> (falling back to the system
        location from your HA configuration). Manual mode lets you point the radar at any
        coordinates. The distance unit applies to the range setting, ring labels and flight
        details. Historical tracks show the last <code>trail_seconds</code> (0 disables them)
        and reset whenever the card is reloaded. <code>height</code> caps the radar scope
        height so the card stays compact on wide dashboards — set it to 0 to size the scope
        from the card width instead. By default aircraft data is relayed by the
        <b>Plane Radar integration</b> (required). <code>api_url</code> is an advanced override
        for a custom compatible proxy — it receives
        <code>?lat=&amp;lon=&amp;radius=&amp;provider=</code> and must return readsb-style
        <code>{ ac: [...] }</code> JSON.
      </p>
    `;
  }
};
ft([
  gt({ attribute: !1 })
], tt.prototype, "hass", 2);
ft([
  I()
], tt.prototype, "_config", 2);
tt = ft([
  Ut("plane-radar-card-editor")
], tt);
var Ue = Object.defineProperty, He = Object.getOwnPropertyDescriptor, E = (i, t, s, e) => {
  for (var n = e > 1 ? void 0 : e ? He(t, s) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (e ? r(t, s, n) : r(n)) || n);
  return e && n && Ue(t, s, n), n;
};
const Ie = "1.0.0", v = {
  title: "AIRSPACE RADAR",
  location_mode: "ha",
  provider: "adsb.lol",
  range: 50,
  rings: 4,
  update_interval: 10,
  sweep_duration: 6,
  distance_unit: "nm",
  trail_seconds: 60,
  height: 360,
  show_labels: !0
};
let $ = class extends O {
  constructor() {
    super(...arguments), this._aircraft = [], this._selected = null, this._error = null, this._lastUpdated = null, this._renderer = null, this._pollTimer = null, this._fetching = !1, this._hassNudged = !1, this._lastCenterKey = null;
  }
  setConfig(i) {
    if (!i || typeof i != "object")
      throw new Error("Invalid configuration");
    const t = { ...v, ...i };
    if (t.location_mode === "manual") {
      const { latitude: n, longitude: o } = t;
      if (typeof n != "number" || !Number.isFinite(n) || n < -90 || n > 90 || typeof o != "number" || !Number.isFinite(o) || o < -180 || o > 180)
        throw new Error('Manual location mode requires a valid "latitude" (-90..90) and "longitude" (-180..180)');
    }
    const s = t.distance_unit === "km" || t.distance_unit === "mi" ? t.distance_unit : "nm";
    t.distance_unit = s;
    let e;
    typeof i.range == "number" && Number.isFinite(i.range) ? e = ot(i.range, s) : typeof i.range_nm == "number" && Number.isFinite(i.range_nm) ? e = i.range_nm : e = ot(v.range, s), t.range_nm = N(e, Lt, zt), t.range = Math.round(k(t.range_nm, s) * 10) / 10, t.rings = N(Math.round(t.rings ?? v.rings), 1, 8), t.update_interval = N(t.update_interval ?? v.update_interval, 5, 300), t.sweep_duration = N(t.sweep_duration ?? v.sweep_duration, 2, 20), t.trail_seconds = N(Math.round(t.trail_seconds ?? v.trail_seconds), 0, 300), t.height = N(Math.round(t.height ?? v.height), 0, 1200), this._config = t, this._applyRendererOptions(), this._restartPolling();
  }
  getCardSize() {
    const i = this._config?.height ?? v.height;
    return i ? Math.max(2, Math.ceil((i + 80) / 50)) : 7;
  }
  static getStubConfig() {
    return {
      location_mode: "ha",
      range: 50,
      distance_unit: "nm",
      rings: 4,
      provider: "adsb.lol",
      height: 360
    };
  }
  static getConfigElement() {
    return document.createElement("plane-radar-card-editor");
  }
  connectedCallback() {
    super.connectedCallback(), this._ensureRenderer(), this._restartPolling();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopPolling(), this._renderer?.destroy(), this._renderer = null, this._lastCenterKey = null;
  }
  firstUpdated() {
    this._ensureRenderer(), this._restartPolling();
  }
  updated() {
    this._ensureRenderer(), this._applyRendererOptions(), this.hass && !this._hassNudged && !this._lastUpdated && !this._fetching && (this._hassNudged = !0, this._poll());
  }
  _ensureRenderer() {
    if (this._renderer) return;
    const i = this.renderRoot.querySelector("canvas");
    i && (this._renderer = new ye(i), this._applyRendererOptions(), this._renderer.setAircraft(this._aircraft), this._renderer.start());
  }
  _applyRendererOptions() {
    !this._renderer || !this._config || this._renderer.setOptions({
      rangeNm: this._config.range_nm,
      rings: this._config.rings,
      sweepDurationSec: this._config.sweep_duration,
      distanceUnit: this._config.distance_unit ?? "nm",
      showLabels: this._config.show_labels ?? !0,
      selectedId: this._selected?.id ?? null,
      trailSeconds: this._config.trail_seconds ?? 60
    });
  }
  _resolveLocation() {
    const i = this._config;
    if (!i) return null;
    if (i.location_mode === "manual")
      return { latitude: i.latitude, longitude: i.longitude, source: "manual" };
    const t = this.hass?.states?.["zone.home"], s = t?.attributes?.latitude, e = t?.attributes?.longitude;
    if (typeof s == "number" && typeof e == "number")
      return { latitude: s, longitude: e, source: "zone.home" };
    const n = this.hass?.config?.latitude, o = this.hass?.config?.longitude;
    return typeof n == "number" && typeof o == "number" ? { latitude: n, longitude: o, source: "hass.config" } : null;
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
    if (!t || !this.hass) return;
    const s = `${t.latitude.toFixed(5)},${t.longitude.toFixed(5)}`;
    this._lastCenterKey !== null && this._lastCenterKey !== s && this._renderer?.clearHistory(), this._lastCenterKey = s, this._fetching = !0;
    try {
      const e = await Me(
        this.hass,
        i.provider ?? "adsb.lol",
        t.latitude,
        t.longitude,
        i.range_nm,
        i.api_url
      );
      if (this._aircraft = e, this._renderer?.setAircraft(e), this._lastUpdated = /* @__PURE__ */ new Date(), this._error = null, this._selected) {
        const n = e.find((o) => o.id === this._selected.id);
        this._selected = n ?? null;
      }
    } catch (e) {
      this._error = e instanceof Error ? e.message : String(e);
    } finally {
      this._fetching = !1;
    }
  }
  _onCanvasClick(i) {
    if (!this._renderer) return;
    const s = i.currentTarget.getBoundingClientRect(), e = this._renderer.hitTest(i.clientX - s.left, i.clientY - s.top);
    this._selected = e && e.id !== this._selected?.id ? e : null, this._applyRendererOptions();
  }
  render() {
    if (!this._config) return u;
    const i = this._config, t = this._resolveLocation(), s = i.distance_unit ?? "nm", e = we[i.provider ?? "adsb.lol"], n = this._aircraft.filter((o) => o.distanceNm <= i.range_nm).length;
    return M`
      <ha-card>
        <div class="header">
          <div class="title">${i.title}</div>
          <div class="contacts">${n} CONTACT${n === 1 ? "" : "S"}</div>
        </div>
        <div class="radar-wrap" style=${i.height ? `--radar-h: ${i.height}px` : ""}>
          <canvas @click=${this._onCanvasClick}></canvas>
          <div class="scanlines"></div>
          <div class="vignette"></div>
          ${t === null ? M`
                <div class="notice">
                  <div>⚠ NO RADAR POSITION</div>
                  <div>
                    ${i.location_mode === "manual" ? "Set a valid latitude and longitude in the card configuration." : M`Home location unavailable. Set <code>location_mode: manual</code> with
                          <code>latitude</code> and <code>longitude</code>, or enable the Home location zone in Home Assistant.`}
                  </div>
                </div>` : u}
          ${this._selected ? this._renderDetails(this._selected, s) : u}
        </div>
        <div class="footer">
          <span class="seg">SRC ${e.name.toUpperCase()} · RNG ${at(i.range_nm, s)}</span>
          <span class="seg">
            ${t ? `${t.latitude.toFixed(3)}° / ${t.longitude.toFixed(3)}° · ${t.source.toUpperCase()}` : "NO POSITION"}
          </span>
          <span class="seg ${this._error ? "error" : ""}">
            ${this._error ? "LINK LOST – RETRYING" : this._lastUpdated ? `UPDATED ${Re(this._lastUpdated)}` : "ACQUIRING…"}
          </span>
        </div>
      </ha-card>
    `;
  }
  _renderDetails(i, t) {
    const s = [
      ["Altitude", Ce(i.altitudeFt, i.onGround)],
      ["Ground speed", Pe(i.speedKt)],
      ["Track", Te(i.headingDeg)],
      ["Vert. rate", Ee(i.verticalRateFpm)],
      ["Distance", at(i.distanceNm, t)],
      ["Bearing", `${String(Math.round(i.bearingDeg)).padStart(3, "0")}°`],
      ["Squawk", i.squawk ?? "—"],
      ["RSSI", i.rssi !== null ? `${i.rssi.toFixed(1)} dBFS` : "—"]
    ];
    return M`
      <div class="details" @click=${(e) => e.stopPropagation()}>
        <div class="details-head">
          <div>
            <span class="callsign">${i.callsign}</span>
            ${i.typeCode ? M`<span class="type">${i.typeCode}</span>` : u}
          </div>
          <button class="close" @click=${() => {
      this._selected = null, this._applyRendererOptions();
    }}>
            CLOSE
          </button>
        </div>
        <div class="grid">
          ${s.map(
      ([e, n]) => M`
              <div class="field">
                <label>${e}</label>
                <span>${n}</span>
              </div>`
    )}
        </div>
      </div>
    `;
  }
};
$.styles = xe;
E([
  gt({ attribute: !1 })
], $.prototype, "hass", 2);
E([
  I()
], $.prototype, "_config", 2);
E([
  I()
], $.prototype, "_aircraft", 2);
E([
  I()
], $.prototype, "_selected", 2);
E([
  I()
], $.prototype, "_error", 2);
E([
  I()
], $.prototype, "_lastUpdated", 2);
$ = E([
  Ut("plane-radar-card")
], $);
function N(i, t, s) {
  return Math.min(s, Math.max(t, i));
}
window.customCards ??= [];
window.customCards.push({
  type: "plane-radar-card",
  name: "Plane Radar Card",
  description: "Military-style sweeping ADS-B radar of the aircraft around your home.",
  preview: "false"
});
console.info(`%c PLANE-RADAR-CARD %c v${Ie} `, "background:#04281a;color:#2bffa0;font-weight:bold", "background:#2bffa0;color:#04281a;font-weight:bold");
export {
  $ as PlaneRadarCard
};
