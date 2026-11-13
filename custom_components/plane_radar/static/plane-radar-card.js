/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, rt = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), ft = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (rt && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ft.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ft.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Lt = (i) => new Et(typeof i == "string" ? i : i + "", void 0, ot), zt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, n, o) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + i[o + 1], i[0]);
  return new Et(e, i, ot);
}, Ft = (i, t) => {
  if (rt) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), n = V.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = e.cssText, i.appendChild(s);
  }
}, gt = rt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Lt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: jt, defineProperty: Bt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: qt, getOwnPropertySymbols: Wt, getPrototypeOf: Kt } = Object, Y = globalThis, mt = Y.trustedTypes, Vt = mt ? mt.emptyScript : "", Jt = Y.reactiveElementPolyfillSupport, j = (i, t) => i, J = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Vt : null;
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
} }, at = (i, t) => !jt(i, t), _t = { attribute: !0, type: String, converter: J, reflect: !1, useDefault: !1, hasChanged: at };
Symbol.metadata ??= Symbol("metadata"), Y.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = _t) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, e);
      n !== void 0 && Bt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: n, set: o } = Gt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get: n, set(r) {
      const l = n?.call(this);
      o?.call(this, r), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? _t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const t = Kt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const e = this.properties, s = [...qt(e), ...Wt(e)];
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
      for (const n of s) e.unshift(gt(n));
    } else t !== void 0 && e.push(gt(t));
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
    return Ft(t, this.constructor.elementStyles), t;
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
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : J).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = s.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : J;
      this._$Em = n;
      const l = r.fromAttribute(e, o.type);
      this[n] = l ?? this._$Ej?.get(n) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), s ??= r.getPropertyOptions(t), !((s.hasChanged ?? at)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: n, wrapped: o }, r) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? e ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: r } = o, l = this[n];
        r !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[j("elementProperties")] = /* @__PURE__ */ new Map(), k[j("finalized")] = /* @__PURE__ */ new Map(), Jt?.({ ReactiveElement: k }), (Y.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = globalThis, bt = (i) => i, X = lt.trustedTypes, $t = X ? X.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Rt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Tt = "?" + v, Xt = `<${Tt}>`, E = document, B = () => E.createComment(""), G = (i) => i === null || typeof i != "object" && typeof i != "function", ct = Array.isArray, Zt = (i) => ct(i) || typeof i?.[Symbol.iterator] == "function", tt = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vt = /-->/g, yt = />/g, A = RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), xt = /'/g, At = /"/g, Nt = /^(?:script|style|textarea|title)$/i, Yt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), M = Yt(1), D = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), wt = /* @__PURE__ */ new WeakMap(), C = E.createTreeWalker(E, 129);
function kt(i, t) {
  if (!ct(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $t !== void 0 ? $t.createHTML(t) : t;
}
const Qt = (i, t) => {
  const e = i.length - 1, s = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = L;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let c, d, h = -1, u = 0;
    for (; u < a.length && (r.lastIndex = u, d = r.exec(a), d !== null); ) u = r.lastIndex, r === L ? d[1] === "!--" ? r = vt : d[1] !== void 0 ? r = yt : d[2] !== void 0 ? (Nt.test(d[2]) && (n = RegExp("</" + d[2], "g")), r = A) : d[3] !== void 0 && (r = A) : r === A ? d[0] === ">" ? (r = n ?? L, h = -1) : d[1] === void 0 ? h = -2 : (h = r.lastIndex - d[2].length, c = d[1], r = d[3] === void 0 ? A : d[3] === '"' ? At : xt) : r === At || r === xt ? r = A : r === vt || r === yt ? r = L : (r = A, n = void 0);
    const f = r === A && i[l + 1].startsWith("/>") ? " " : "";
    o += r === L ? a + Xt : h >= 0 ? (s.push(c), a.slice(0, h) + Rt + a.slice(h) + v + f) : a + v + (h === -2 ? l : f);
  }
  return [kt(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class q {
  constructor({ strings: t, _$litType$: e }, s) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const l = t.length - 1, a = this.parts, [c, d] = Qt(t, e);
    if (this.el = q.createElement(c, s), C.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = C.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(Rt)) {
          const u = d[r++], f = n.getAttribute(h).split(v), _ = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: o, name: _[2], strings: f, ctor: _[1] === "." ? ee : _[1] === "?" ? se : _[1] === "@" ? ie : Q }), n.removeAttribute(h);
        } else h.startsWith(v) && (a.push({ type: 6, index: o }), n.removeAttribute(h));
        if (Nt.test(n.tagName)) {
          const h = n.textContent.split(v), u = h.length - 1;
          if (u > 0) {
            n.textContent = X ? X.emptyScript : "";
            for (let f = 0; f < u; f++) n.append(h[f], B()), C.nextNode(), a.push({ type: 2, index: ++o });
            n.append(h[u], B());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Tt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(v, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += v.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = E.createElement("template");
    return s.innerHTML = t, s;
  }
}
function H(i, t, e = i, s) {
  if (t === D) return t;
  let n = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = G(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(i), n._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = n : e._$Cl = n), n !== void 0 && (t = H(i, n._$AS(i, t.values), n, s)), t;
}
class te {
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
    const { el: { content: e }, parts: s } = this._$AD, n = (t?.creationScope ?? E).importNode(e, !0);
    C.currentNode = n;
    let o = C.nextNode(), r = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let c;
        a.type === 2 ? c = new W(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new ne(o, this, t)), this._$AV.push(c), a = s[++l];
      }
      r !== a?.index && (o = C.nextNode(), r++);
    }
    return C.currentNode = E, n;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class W {
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
    t = H(this, t, e), G(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== D && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && G(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = q.createElement(kt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === n) this._$AH.p(e);
    else {
      const o = new te(n, this), r = o.u(this.options);
      o.p(e), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = wt.get(t.strings);
    return e === void 0 && wt.set(t.strings, e = new q(t)), e;
  }
  k(t) {
    ct(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, n = 0;
    for (const o of t) n === e.length ? e.push(s = new W(this.O(B()), this.O(B()), this, this.options)) : s = e[n], s._$AI(o), n++;
    n < e.length && (this._$AR(s && s._$AB.nextSibling, n), e.length = n);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = bt(t).nextSibling;
      bt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, n, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = e, this._$AM = n, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(t, e = this, s, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = H(this, t, e, 0), r = !G(t) || t !== this._$AH && t !== D, r && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = H(this, l[s + a], e, a), c === D && (c = this._$AH[a]), r ||= !G(c) || c !== this._$AH[a], c === p ? t = p : t !== p && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ee extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class se extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class ie extends Q {
  constructor(t, e, s, n, o) {
    super(t, e, s, n, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = H(this, t, e, 0) ?? p) === D) return;
    const s = this._$AH, n = t === p && s !== p || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== p && (s === p || n);
    n && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ne {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    H(this, t);
  }
}
const re = lt.litHtmlPolyfillSupport;
re?.(q, W), (lt.litHtmlVersions ??= []).push("3.3.3");
const oe = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = n = new W(t.insertBefore(B(), o), o, void 0, e ?? {});
  }
  return n._$AI(i), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis;
class U extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = oe(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return D;
  }
}
U._$litElement$ = !0, U.finalized = !0, dt.litElementHydrateSupport?.({ LitElement: U });
const ae = dt.litElementPolyfillSupport;
ae?.({ LitElement: U });
(dt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ot = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le = { attribute: !0, type: String, converter: J, reflect: !1, hasChanged: at }, ce = (i = le, t, e) => {
  const { kind: s, metadata: n } = e;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: r } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(r, a, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(r, void 0, i, l), l;
    } };
  }
  if (s === "setter") {
    const { name: r } = e;
    return function(l) {
      const a = this[r];
      t.call(this, l), this.requestUpdate(r, a, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function ht(i) {
  return (t, e) => typeof e == "object" ? ce(i, t, e) : ((s, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, s), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function I(i) {
  return ht({ ...i, state: !0, attribute: !1 });
}
const de = 3440.065, Ut = 0.539957, Dt = 0.868976, P = (i) => i * Math.PI / 180, he = (i) => i * 180 / Math.PI;
function pe(i, t, e, s) {
  const n = P(e - i), o = P(s - t), r = Math.sin(n / 2) * Math.sin(n / 2) + Math.cos(P(i)) * Math.cos(P(e)) * Math.sin(o / 2) * Math.sin(o / 2);
  return 2 * de * Math.asin(Math.min(1, Math.sqrt(r)));
}
function ue(i, t, e, s) {
  const n = P(i), o = P(e), r = P(s - t), l = Math.sin(r) * Math.cos(o), a = Math.cos(n) * Math.sin(o) - Math.sin(n) * Math.cos(o) * Math.cos(r);
  return (he(Math.atan2(l, a)) + 360) % 360;
}
function fe(i) {
  return i / Ut;
}
function ge(i) {
  return i * Ut;
}
function me(i) {
  return i / Dt;
}
function _e(i) {
  return i * Dt;
}
function it(i, t) {
  return t === "km" ? ge(i) : t === "mi" ? _e(i) : i;
}
function O(i, t) {
  return t === "km" ? fe(i) : t === "mi" ? me(i) : i;
}
function nt(i, t) {
  const e = O(i, t), s = t === "km" ? "km" : t === "mi" ? "mi" : "nm";
  return e < 10 ? `${e.toFixed(1)} ${s}` : `${Math.round(e)} ${s}`;
}
const b = "#2bffa0", K = "#8affce", St = "rgba(43, 255, 160, 0.28)", Mt = "rgba(43, 255, 160, 0.12)", et = 78, w = Math.PI * 2, S = Math.PI / 180, Ct = 240;
class be {
  constructor(t) {
    this.aircraft = [], this.options = {
      rangeNm: 50,
      rings: 4,
      sweepDurationSec: 6,
      distanceUnit: "nm",
      showLabels: !0,
      selectedId: null,
      trailSeconds: 60
    }, this.raf = 0, this.layout = { cx: 0, cy: 0, radius: 0 }, this.trails = /* @__PURE__ */ new Map(), this.canvas = t;
    const e = t.getContext("2d");
    if (!e) throw new Error("Canvas 2D context unavailable");
    this.ctx = e, this.resizeObserver = new ResizeObserver(() => this.resize()), this.resizeObserver.observe(t), this.resize();
  }
  destroy() {
    cancelAnimationFrame(this.raf), this.resizeObserver.disconnect(), this.trails.clear();
  }
  setAircraft(t) {
    this.aircraft = t, this.recordTracks(t);
  }
  setOptions(t) {
    const e = this.options.trailSeconds;
    this.options = { ...this.options, ...t }, t.trailSeconds !== void 0 && t.trailSeconds !== e && this.recordTracks(this.aircraft);
  }
  /** Forget all historical tracks (e.g. the radar centre moved or the card reloaded). */
  clearHistory() {
    this.trails.clear();
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
    const { cx: s, cy: n, radius: o } = this.layout;
    if (o <= 0) return null;
    const { rangeNm: r } = this.options;
    let l = null, a = 1 / 0;
    for (const c of this.aircraft) {
      if (c.distanceNm > r) continue;
      const d = this.project(c, s, n, o), h = Math.hypot(d.x - t, d.y - e), u = Math.max(16, o * 0.045);
      h < u && h < a && (l = c, a = h);
    }
    return l;
  }
  project(t, e, s, n) {
    return this.projectPolar(t.distanceNm, t.bearingDeg, e, s, n);
  }
  projectPolar(t, e, s, n, o) {
    const r = t / this.options.rangeNm * o, l = (e - 90) * S;
    return { x: s + r * Math.cos(l), y: n + r * Math.sin(l) };
  }
  /**
   * Append the latest reported position to each aircraft's track and prune
   * samples older than `trailSeconds`. Tracks live only in memory, so a page
   * reload (or a new renderer) starts with a clean scope.
   */
  recordTracks(t) {
    const e = this.options.trailSeconds;
    if (e <= 0) {
      this.trails.clear();
      return;
    }
    const s = performance.now(), n = e * 1e3, o = /* @__PURE__ */ new Set();
    for (const r of t) {
      o.add(r.id);
      const l = this.trails.get(r.id) ?? [], a = l[l.length - 1];
      for ((!a || Math.abs(a.distanceNm - r.distanceNm) > 5e-3 || Math.abs(a.bearingDeg - r.bearingDeg) > 0.05) && (!a || s - a.t >= 1e3) && l.push({ t: s, distanceNm: r.distanceNm, bearingDeg: r.bearingDeg }); l.length > 0 && s - l[0].t > n; ) l.shift();
      l.length > Ct && l.splice(0, l.length - Ct), this.trails.set(r.id, l);
    }
    for (const [r, l] of this.trails)
      if (!o.has(r)) {
        const a = l.filter((c) => s - c.t <= n);
        a.length === 0 ? this.trails.delete(r) : a.length !== l.length && this.trails.set(r, a);
      }
  }
  resize() {
    const t = this.canvas.getBoundingClientRect(), e = Math.min(window.devicePixelRatio || 1, 2.5), s = Math.max(1, Math.round(t.width)), n = Math.max(1, Math.round(t.height));
    (this.canvas.width !== s * e || this.canvas.height !== n * e) && (this.canvas.width = s * e, this.canvas.height = n * e);
  }
  draw() {
    const { ctx: t, canvas: e } = this, s = Math.min(window.devicePixelRatio || 1, 2.5), n = e.width / s, o = e.height / s;
    if (n < 10 || o < 10) return;
    t.setTransform(s, 0, 0, s, 0, 0), t.clearRect(0, 0, n, o);
    const r = n / 2, l = o / 2, a = Math.min(n, o) / 2 - 26;
    this.layout = { cx: r, cy: l, radius: a };
    const c = performance.now(), d = c / 1e3 / this.options.sweepDurationSec * 360 % 360;
    this.drawBackground(r, l, a), this.drawGrid(r, l, a), this.drawRim(r, l, a), this.drawSweep(r, l, a, d, c), this.drawTrails(r, l, a, c), this.drawBlips(r, l, a, d, c), this.drawOwnship(r, l);
  }
  drawBackground(t, e, s) {
    const { ctx: n } = this, o = n.createRadialGradient(t, e, 0, t, e, s);
    o.addColorStop(0, "#04281a"), o.addColorStop(0.75, "#02180f"), o.addColorStop(1, "#010f09"), n.fillStyle = o, n.beginPath(), n.arc(t, e, s, 0, w), n.fill();
  }
  drawGrid(t, e, s) {
    const { ctx: n, options: o } = this;
    n.save(), n.strokeStyle = Mt, n.lineWidth = 1;
    for (let a = 0; a < 360; a += 30) {
      const c = (a - 90) * S;
      n.beginPath(), n.moveTo(t, e), n.lineTo(t + s * Math.cos(c), e + s * Math.sin(c)), n.stroke();
    }
    n.strokeStyle = St, n.beginPath(), n.moveTo(t - s, e), n.lineTo(t + s, e), n.moveTo(t, e - s), n.lineTo(t, e + s), n.stroke();
    const r = Math.max(1, Math.round(o.rings));
    for (let a = 1; a <= r; a++)
      n.strokeStyle = a === r ? St : Mt, n.lineWidth = a === r ? 2 : 1, n.beginPath(), n.arc(t, e, s * a / r, 0, w), n.stroke();
    n.fillStyle = "rgba(43, 255, 160, 0.55)", n.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.textAlign = "left";
    const l = -45 * S;
    for (let a = 1; a <= r; a++) {
      const c = s * a / r, d = t + c * Math.cos(l) + 4, h = e + c * Math.sin(l) - 2;
      n.fillText(nt(o.rangeNm * a / r, o.distanceUnit), d, h);
    }
    n.restore();
  }
  drawRim(t, e, s) {
    const { ctx: n } = this;
    n.save(), n.strokeStyle = b, n.lineWidth = 2, n.shadowColor = b, n.shadowBlur = 12, n.beginPath(), n.arc(t, e, s, 0, w), n.stroke(), n.restore(), n.save(), n.strokeStyle = b, n.fillStyle = b, n.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.textAlign = "center", n.textBaseline = "middle";
    for (let o = 0; o < 360; o += 5) {
      const r = o % 30 === 0, l = o % 90 === 0, a = (o - 90) * S, c = s + (r ? 12 : 6), d = s + (r ? 22 : 11);
      if (n.lineWidth = r ? 2 : 1, n.beginPath(), n.moveTo(t + c * Math.cos(a), e + c * Math.sin(a)), n.lineTo(t + d * Math.cos(a), e + d * Math.sin(a)), n.stroke(), r) {
        const h = s + 22, u = t + h * Math.cos(a), f = e + h * Math.sin(a);
        l ? (n.font = "bold 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", n.fillStyle = K, n.fillText(["N", "E", "S", "W"][o / 90], u, f), n.font = "9px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace") : (n.fillStyle = "rgba(43, 255, 160, 0.75)", n.fillText(String(o).padStart(3, "0"), u, f));
      }
    }
    n.restore();
  }
  drawSweep(t, e, s, n, o) {
    const { ctx: r } = this, l = (n - 90) * S, a = (n - et - 90) * S, c = et / 360, d = r.createConicGradient(a, t, e);
    d.addColorStop(0, "rgba(43, 255, 160, 0)"), d.addColorStop(c * 0.55, "rgba(43, 255, 160, 0.10)"), d.addColorStop(c * 0.85, "rgba(43, 255, 160, 0.22)"), d.addColorStop(c, "rgba(120, 255, 200, 0.55)"), d.addColorStop(Math.min(1, c + 2e-3), "rgba(43, 255, 160, 0)"), d.addColorStop(1, "rgba(43, 255, 160, 0)"), r.save(), r.beginPath(), r.moveTo(t, e), r.arc(t, e, s, a, l), r.closePath(), r.fillStyle = d, r.fill();
    const h = (o / 1e3 / this.options.sweepDurationSec % 1 + 1) % 1;
    r.strokeStyle = `rgba(43, 255, 160, ${(0.16 * (1 - h)).toFixed(3)})`, r.lineWidth = 2, r.beginPath(), r.arc(t, e, h * s, 0, w), r.stroke(), r.strokeStyle = K, r.shadowColor = b, r.shadowBlur = 14, r.lineWidth = 2.5, r.beginPath(), r.moveTo(t, e), r.lineTo(t + s * Math.cos(l), e + s * Math.sin(l)), r.stroke(), r.restore();
  }
  /**
   * Historical track: a fading phosphor line through the last
   * `trailSeconds` of sampled positions (default one minute).
   */
  drawTrails(t, e, s, n) {
    const { ctx: o, options: r } = this, l = r.trailSeconds;
    if (l <= 0 || this.trails.size === 0) return;
    const a = l * 1e3;
    o.save(), o.beginPath(), o.arc(t, e, s, 0, w), o.clip(), o.lineCap = "round", o.lineJoin = "round", o.strokeStyle = b;
    for (const [c, d] of this.trails) {
      if (d.length < 2) continue;
      const h = r.selectedId === c, u = h ? 0.62 : 0.34;
      o.lineWidth = h ? 1.8 : 1.2;
      for (let f = 1; f < d.length; f++) {
        const _ = d[f - 1], T = d[f], y = n - T.t;
        if (y > a) continue;
        const g = Math.max(0, 1 - y / a);
        if (g <= 0) continue;
        const x = this.projectPolar(_.distanceNm, _.bearingDeg, t, e, s), ut = this.projectPolar(T.distanceNm, T.bearingDeg, t, e, s);
        o.globalAlpha = u * g, o.beginPath(), o.moveTo(x.x, x.y), o.lineTo(ut.x, ut.y), o.stroke();
      }
    }
    o.restore();
  }
  drawBlips(t, e, s, n, o) {
    const { ctx: r, options: l } = this, a = Math.max(6, Math.min(10, s * 0.032));
    r.save(), r.textBaseline = "middle";
    for (const c of this.aircraft) {
      if (c.distanceNm > l.rangeNm) continue;
      const { x: d, y: h } = this.project(c, t, e, s), u = (n - c.bearingDeg + 360) % 360, f = Math.max(0, 1 - u / et), _ = Math.pow(f, 1.7), T = 0.2 + 0.8 * _, y = l.selectedId === c.id;
      if (c.onGround) {
        r.strokeStyle = `rgba(255, 210, 110, ${(0.35 + 0.5 * _).toFixed(3)})`, r.lineWidth = 1.5;
        const g = a * 0.75;
        r.strokeRect(d - g / 2, h - g / 2, g, g);
      } else {
        const g = r.createRadialGradient(d, h, 0, d, h, a * 2.6);
        if (g.addColorStop(0, `rgba(120, 255, 200, ${(0.75 * T).toFixed(3)})`), g.addColorStop(1, "rgba(43, 255, 160, 0)"), r.fillStyle = g, r.beginPath(), r.arc(d, h, a * 2.6, 0, w), r.fill(), r.save(), r.translate(d, h), r.rotate((c.headingDeg ?? c.bearingDeg) * S), r.fillStyle = `rgba(140, 255, 205, ${T.toFixed(3)})`, r.shadowColor = b, r.shadowBlur = y ? 16 : 6 + 10 * _, this.tracePlane(a), r.fill(), r.restore(), y) {
          const x = a + 7 + Math.sin(o / 300) * 1.5;
          r.strokeStyle = K, r.lineWidth = 1.6, r.setLineDash([5, 4]), r.lineDashOffset = -o / 40, r.beginPath(), r.arc(d, h, x, 0, w), r.stroke(), r.setLineDash([]);
        }
      }
      if (l.showLabels) {
        const g = d >= t, x = a + 4;
        r.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", r.textAlign = g ? "right" : "left", r.fillStyle = y ? "#d7ffeb" : "rgba(160, 255, 210, 0.88)", r.shadowColor = b, r.shadowBlur = y ? 8 : 4, r.fillText(c.callsign, d + (g ? -x : x), h), r.shadowBlur = 0;
      }
    }
    r.restore();
  }
  /** Simple top-view plane silhouette, nose pointing up (north), centered on origin. */
  tracePlane(t) {
    const { ctx: e } = this, s = t / 10;
    e.beginPath(), e.moveTo(0, -9 * s), e.lineTo(1.6 * s, -4 * s), e.lineTo(7.5 * s, 2.5 * s), e.lineTo(7.5 * s, 4.5 * s), e.lineTo(1.9 * s, 3.2 * s), e.lineTo(1.4 * s, 6.5 * s), e.lineTo(3.6 * s, 8.8 * s), e.lineTo(3.6 * s, 10 * s), e.lineTo(0, 9 * s), e.lineTo(-3.6 * s, 10 * s), e.lineTo(-3.6 * s, 8.8 * s), e.lineTo(-1.4 * s, 6.5 * s), e.lineTo(-1.9 * s, 3.2 * s), e.lineTo(-7.5 * s, 4.5 * s), e.lineTo(-7.5 * s, 2.5 * s), e.lineTo(-1.6 * s, -4 * s), e.closePath();
  }
  drawOwnship(t, e) {
    const { ctx: s } = this;
    s.save(), s.translate(t, e), s.strokeStyle = K, s.lineWidth = 1.6, s.shadowColor = b, s.shadowBlur = 8, this.tracePlane(7), s.stroke(), s.restore();
  }
}
const $e = zt`
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
`, Ht = 250, It = 5, ve = {
  "adsb.lol": { name: "adsb.lol", url: "https://adsb.lol" },
  "adsb.fi": { name: "adsb.fi", url: "https://adsb.fi" }
};
function m(i) {
  return typeof i == "number" && Number.isFinite(i) ? i : typeof i == "string" && i.trim() !== "" && Number.isFinite(Number(i)) ? Number(i) : null;
}
function z(i) {
  if (typeof i != "string") return null;
  const t = i.trim();
  return t === "" ? null : t;
}
function ye(i, t, e) {
  const s = m(i?.lat), n = m(i?.lon);
  if (s === null || n === null) return null;
  const o = z(i?.hex) ?? `${s.toFixed(3)}:${n.toFixed(3)}`, r = z(i?.flight), l = i?.alt_baro, a = typeof l == "string" && l.toLowerCase() === "ground", c = a ? null : m(l) ?? m(i?.alt_geom), d = m(i?.track) ?? m(i?.true_heading) ?? m(i?.nav_heading) ?? m(i?.mag_heading);
  return {
    id: o,
    callsign: r ?? o.toUpperCase(),
    typeCode: z(i?.t) ?? z(i?.category),
    altitudeFt: c !== null ? Math.round(c) : null,
    onGround: a,
    speedKt: m(i?.gs) ?? m(i?.tas) ?? m(i?.ias),
    headingDeg: d !== null ? (d % 360 + 360) % 360 : null,
    lat: s,
    lon: n,
    verticalRateFpm: m(i?.baro_rate) ?? m(i?.vert_rate),
    squawk: z(i?.squawk),
    rssi: m(i?.rssi),
    distanceNm: pe(t, e, s, n),
    bearingDeg: ue(t, e, s, n)
  };
}
function xe(i) {
  if (i && typeof i.error == "string")
    throw new Error(i.error);
  return Array.isArray(i?.ac) ? i.ac : [];
}
async function Ae(i, t, e, s, n, o) {
  const r = Math.min(Ht, Math.max(It, Math.round(n))), l = `lat=${e}&lon=${s}&radius=${r}&provider=${encodeURIComponent(t)}`;
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
  return xe(a).map((c) => ye(c, e, s)).filter((c) => c !== null).sort((c, d) => c.distanceNm - d.distanceNm);
}
function we(i, t) {
  return t ? "GND" : i === null ? "—" : `${Math.round(i).toLocaleString()} ft`;
}
function Se(i) {
  return i === null ? "—" : `${Math.round(i)} kt`;
}
function Me(i) {
  return i === null ? "—" : `${String(Math.round(i)).padStart(3, "0")}°`;
}
function Ce(i) {
  return i === null ? "—" : Math.abs(i) < 64 ? "0 fpm" : `${i > 0 ? "▲" : "▼"} ${Math.abs(Math.round(i))} fpm`;
}
function Pe(i) {
  return i.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
var Ee = Object.defineProperty, Re = Object.getOwnPropertyDescriptor, pt = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Re(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && Ee(t, e, n), n;
};
const Te = {
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
  show_labels: "Show callsign labels"
}, Ne = {
  nm: { min: 5, max: 250, step: 5 },
  mi: { min: 6, max: 290, step: 5 },
  km: { min: 10, max: 465, step: 10 }
}, Pt = 50;
function st(i) {
  return Math.round(i * 10) / 10;
}
let Z = class extends U {
  constructor() {
    super(...arguments), this._computeLabel = (i) => Te[i.name] ?? i.name;
  }
  setConfig(i) {
    this._config = i;
  }
  _currentUnit() {
    const i = this._config?.distance_unit;
    return i === "km" || i === "mi" ? i : "nm";
  }
  _valueChanged(i) {
    const e = { ...i.detail.value }, s = this._currentUnit(), n = e.distance_unit === "km" || e.distance_unit === "mi" ? e.distance_unit : "nm";
    if (n !== s) {
      const o = typeof e.range == "number" ? e.range : typeof e.range_nm == "number" ? O(e.range_nm, s) : Pt;
      e.range = st(O(it(o, s), n));
    }
    e.distance_unit = n, typeof e.range != "number" && typeof e.range_nm == "number" && (e.range = st(O(e.range_nm, n))), delete e.range_nm, this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: e }, bubbles: !0, composed: !0 })
    );
  }
  _schema() {
    const i = this._config?.location_mode === "manual", t = this._currentUnit(), e = Ne[t], s = [
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
    return i && s.push(
      { name: "latitude", selector: { number: { min: -90, max: 90, step: 1e-4, mode: "box" } } },
      { name: "longitude", selector: { number: { min: -180, max: 180, step: 1e-4, mode: "box" } } }
    ), s.push(
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
          number: { min: e.min, max: e.max, step: e.step, mode: "slider" }
        }
      },
      { name: "rings", selector: { number: { min: 1, max: 8, step: 1, mode: "slider" } } },
      { name: "update_interval", selector: { number: { min: 5, max: 300, step: 5, mode: "slider" } } },
      { name: "sweep_duration", selector: { number: { min: 2, max: 20, step: 0.5, mode: "slider" } } },
      { name: "trail_seconds", selector: { number: { min: 0, max: 300, step: 10, mode: "slider" } } },
      { name: "show_labels", selector: { boolean: {} } },
      { name: "api_url", selector: { text: { type: "url", placeholder: "https://my-proxy.example.com/aircraft" } } }
    ), s;
  }
  render() {
    if (!this._config) return p;
    const i = this._config, t = this._currentUnit(), e = typeof i.range == "number" ? i.range : typeof i.range_nm == "number" ? st(O(i.range_nm, t)) : Pt, s = {
      update_interval: 10,
      sweep_duration: 6,
      rings: 4,
      trail_seconds: 60,
      provider: "adsb.lol",
      location_mode: "ha",
      show_labels: !0,
      ...i,
      distance_unit: t,
      range: e
    };
    return M`
      <ha-form
        .hass=${this.hass}
        .data=${s}
        .schema=${this._schema()}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p style="font-size: 12px; opacity: 0.7; margin: 8px 4px 0;">
        “Home Assistant home location” uses <code>zone.home</code> (falling back to the system
        location from your HA configuration). Manual mode lets you point the radar at any
        coordinates. The distance unit applies to the range setting, ring labels and flight
        details. Historical tracks show the last <code>trail_seconds</code> (0 disables them)
        and reset whenever the card is reloaded. By default aircraft data is relayed by the
        <b>Plane Radar integration</b> (required). <code>api_url</code> is an advanced override
        for a custom compatible proxy — it receives
        <code>?lat=&amp;lon=&amp;radius=&amp;provider=</code> and must return readsb-style
        <code>{ ac: [...] }</code> JSON.
      </p>
    `;
  }
};
pt([
  ht({ attribute: !1 })
], Z.prototype, "hass", 2);
pt([
  I()
], Z.prototype, "_config", 2);
Z = pt([
  Ot("plane-radar-card-editor")
], Z);
var ke = Object.defineProperty, Oe = Object.getOwnPropertyDescriptor, R = (i, t, e, s) => {
  for (var n = s > 1 ? void 0 : s ? Oe(t, e) : t, o = i.length - 1, r; o >= 0; o--)
    (r = i[o]) && (n = (s ? r(t, e, n) : r(n)) || n);
  return s && n && ke(t, e, n), n;
};
const Ue = "0.2.0", N = {
  title: "AIRSPACE RADAR",
  location_mode: "ha",
  provider: "adsb.lol",
  range: 50,
  rings: 4,
  update_interval: 10,
  sweep_duration: 6,
  distance_unit: "nm",
  trail_seconds: 60,
  show_labels: !0
};
let $ = class extends U {
  constructor() {
    super(...arguments), this._aircraft = [], this._selected = null, this._error = null, this._lastUpdated = null, this._renderer = null, this._pollTimer = null, this._fetching = !1, this._hassNudged = !1, this._lastCenterKey = null;
  }
  setConfig(i) {
    if (!i || typeof i != "object")
      throw new Error("Invalid configuration");
    const t = { ...N, ...i };
    if (t.location_mode === "manual") {
      const { latitude: n, longitude: o } = t;
      if (typeof n != "number" || !Number.isFinite(n) || n < -90 || n > 90 || typeof o != "number" || !Number.isFinite(o) || o < -180 || o > 180)
        throw new Error('Manual location mode requires a valid "latitude" (-90..90) and "longitude" (-180..180)');
    }
    const e = t.distance_unit === "km" || t.distance_unit === "mi" ? t.distance_unit : "nm";
    t.distance_unit = e;
    let s;
    typeof i.range == "number" && Number.isFinite(i.range) ? s = it(i.range, e) : typeof i.range_nm == "number" && Number.isFinite(i.range_nm) ? s = i.range_nm : s = it(N.range, e), t.range_nm = F(s, It, Ht), t.range = Math.round(O(t.range_nm, e) * 10) / 10, t.rings = F(Math.round(t.rings ?? N.rings), 1, 8), t.update_interval = F(t.update_interval ?? N.update_interval, 5, 300), t.sweep_duration = F(t.sweep_duration ?? N.sweep_duration, 2, 20), t.trail_seconds = F(Math.round(t.trail_seconds ?? N.trail_seconds), 0, 300), this._config = t, this._applyRendererOptions(), this._restartPolling();
  }
  getCardSize() {
    return 7;
  }
  static getStubConfig() {
    return { location_mode: "ha", range: 50, distance_unit: "nm", rings: 4, provider: "adsb.lol" };
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
    i && (this._renderer = new be(i), this._applyRendererOptions(), this._renderer.setAircraft(this._aircraft), this._renderer.start());
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
    const t = this.hass?.states?.["zone.home"], e = t?.attributes?.latitude, s = t?.attributes?.longitude;
    if (typeof e == "number" && typeof s == "number")
      return { latitude: e, longitude: s, source: "zone.home" };
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
    const e = `${t.latitude.toFixed(5)},${t.longitude.toFixed(5)}`;
    this._lastCenterKey !== null && this._lastCenterKey !== e && this._renderer?.clearHistory(), this._lastCenterKey = e, this._fetching = !0;
    try {
      const s = await Ae(
        this.hass,
        i.provider ?? "adsb.lol",
        t.latitude,
        t.longitude,
        i.range_nm,
        i.api_url
      );
      if (this._aircraft = s, this._renderer?.setAircraft(s), this._lastUpdated = /* @__PURE__ */ new Date(), this._error = null, this._selected) {
        const n = s.find((o) => o.id === this._selected.id);
        this._selected = n ?? null;
      }
    } catch (s) {
      this._error = s instanceof Error ? s.message : String(s);
    } finally {
      this._fetching = !1;
    }
  }
  _onCanvasClick(i) {
    if (!this._renderer) return;
    const e = i.currentTarget.getBoundingClientRect(), s = this._renderer.hitTest(i.clientX - e.left, i.clientY - e.top);
    this._selected = s && s.id !== this._selected?.id ? s : null, this._applyRendererOptions();
  }
  render() {
    if (!this._config) return p;
    const i = this._config, t = this._resolveLocation(), e = i.distance_unit ?? "nm", s = ve[i.provider ?? "adsb.lol"], n = this._aircraft.filter((o) => o.distanceNm <= i.range_nm).length;
    return M`
      <ha-card>
        <div class="header">
          <div class="title">${i.title}</div>
          <div class="contacts">${n} CONTACT${n === 1 ? "" : "S"}</div>
        </div>
        <div class="radar-wrap">
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
                </div>` : p}
          ${this._selected ? this._renderDetails(this._selected, e) : p}
        </div>
        <div class="footer">
          <span class="seg">SRC ${s.name.toUpperCase()} · RNG ${nt(i.range_nm, e)}</span>
          <span class="seg">
            ${t ? `${t.latitude.toFixed(3)}° / ${t.longitude.toFixed(3)}° · ${t.source.toUpperCase()}` : "NO POSITION"}
          </span>
          <span class="seg ${this._error ? "error" : ""}">
            ${this._error ? "LINK LOST – RETRYING" : this._lastUpdated ? `UPDATED ${Pe(this._lastUpdated)}` : "ACQUIRING…"}
          </span>
        </div>
      </ha-card>
    `;
  }
  _renderDetails(i, t) {
    const e = [
      ["Altitude", we(i.altitudeFt, i.onGround)],
      ["Ground speed", Se(i.speedKt)],
      ["Track", Me(i.headingDeg)],
      ["Vert. rate", Ce(i.verticalRateFpm)],
      ["Distance", nt(i.distanceNm, t)],
      ["Bearing", `${String(Math.round(i.bearingDeg)).padStart(3, "0")}°`],
      ["Squawk", i.squawk ?? "—"],
      ["RSSI", i.rssi !== null ? `${i.rssi.toFixed(1)} dBFS` : "—"]
    ];
    return M`
      <div class="details" @click=${(s) => s.stopPropagation()}>
        <div class="details-head">
          <div>
            <span class="callsign">${i.callsign}</span>
            ${i.typeCode ? M`<span class="type">${i.typeCode}</span>` : p}
          </div>
          <button class="close" @click=${() => {
      this._selected = null, this._applyRendererOptions();
    }}>
            CLOSE
          </button>
        </div>
        <div class="grid">
          ${e.map(
      ([s, n]) => M`
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
$.styles = $e;
R([
  ht({ attribute: !1 })
], $.prototype, "hass", 2);
R([
  I()
], $.prototype, "_config", 2);
R([
  I()
], $.prototype, "_aircraft", 2);
R([
  I()
], $.prototype, "_selected", 2);
R([
  I()
], $.prototype, "_error", 2);
R([
  I()
], $.prototype, "_lastUpdated", 2);
$ = R([
  Ot("plane-radar-card")
], $);
function F(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
window.customCards ??= [];
window.customCards.push({
  type: "plane-radar-card",
  name: "Plane Radar Card",
  description: "Military-style sweeping ADS-B radar of the aircraft around your home.",
  preview: "false"
});
console.info(`%c PLANE-RADAR-CARD %c v${Ue} `, "background:#04281a;color:#2bffa0;font-weight:bold", "background:#2bffa0;color:#04281a;font-weight:bold");
export {
  $ as PlaneRadarCard
};
