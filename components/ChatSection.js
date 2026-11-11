"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, PlusIcon, SendIcon } from "./Icons";
import { products } from "@/data/products";
import useKeyboardInset from "@/lib/useKeyboardInset";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const QUICK = ["What's the most popular dish?", "What do you recommend?","What's the best pizza?","What are the vegan options?","What's your best dessert?","What can I get under $10?"];
const MAX_LEN = 500;
const MIN_TEXTAREA_HEIGHT = 36;
const MAX_TEXTAREA_HEIGHT = 136;
const COMPACT_COMPOSER_HEIGHT = 54;
const COMPOSER_CONTROLS_HEIGHT = 62;

// اسم غذاهای ذکرشده در جواب بات را پیدا می‌کند تا کارت نشان بدهیم
function findMentioned(text) {
  let rest = text.toLowerCase();
  const found = [];
  [...products]
    .sort((a, b) => b.name.length - a.name.length) // اول اسم‌های بلندتر (Pepperoni Pizza قبل از Pizza)
    .forEach((p) => {
      const name = p.name.toLowerCase();
      const i = rest.indexOf(name);
      if (i === -1) return;
      found.push({ p, i });
      rest = rest.slice(0, i) + " ".repeat(name.length) + rest.slice(i + name.length);
    });
  return found.sort((a, b) => a.i - b.i).slice(0, 3).map((f) => f.p);
}

function MiniCard({ product }) {
  const final = product.price * (1 - product.discount / 100);
  return (
    <Link href={`/food/${product.id}`} className={`mc theme-${product.theme}`}>
      <img className="mc-img" src={product.image} alt="" draggable="false" />
      <span className="mc-tx">
        <b>{product.name}</b>
        <small>{product.time} min · {product.calories} kcal</small>
      </span>
      <span className="mc-price">${final.toFixed(2)}</span>
      <span className="mc-go" aria-hidden="true"><ChevronRight /></span>
    </Link>
  );
}

export default function ChatSection() {
  const [typing, setTyping] = useState(false);
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [composerHeight, setComposerHeight] = useState(COMPACT_COMPOSER_HEIGHT);
  useKeyboardInset(typing);

  const [messages, setMessages] = useState([
    { role: "model", text: "Hi" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState(null);
  const [shown, setShown] = useState(0);
  const busy = loading || typingIndex !== null;
  const endRef = useRef(null);
  const taRef = useRef(null);
  const widgetBox = useRef(null);
  const widgetId = useRef(null);
  const tokenRef = useRef("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: typingIndex !== null ? "auto" : "smooth" });
  }, [messages, loading, shown, typingIndex]);

  useEffect(() => {
    if (typingIndex === null) return undefined;

    const total = Array.from(messages[typingIndex]?.text || "").length;
    const step = Math.max(1, Math.ceil(total / 150));
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + step, total);
      setShown(current);
      if (current >= total) {
        clearInterval(id);
        setTypingIndex(null);
      }
    }, 25);

    return () => clearInterval(id);
  }, [typingIndex, messages]);

  // Measure in the expanded layout so wrapping does not change the mode after it expands.
  useLayoutEffect(() => {
    const el = taRef.current;
    if (!el) return;
    const form = el.form;
    const wasExpanded = form.classList.contains("is-expanded");
    form.classList.add("is-expanded");
    const textareaStyle = getComputedStyle(el);
    const singleLineHeight = Number.parseFloat(textareaStyle.lineHeight)
      + Number.parseFloat(textareaStyle.paddingTop)
      + Number.parseFloat(textareaStyle.paddingBottom);
    const previousHeight = el.style.height;
    const previousMinHeight = el.style.minHeight;
    el.style.height = "0px";
    el.style.minHeight = "0px";
    const contentHeight = el.scrollHeight;
    el.style.height = previousHeight;
    el.style.minHeight = previousMinHeight;
    if (!wasExpanded) form.classList.remove("is-expanded");

    const expanded = contentHeight > singleLineHeight + 1;
    const textareaHeight = expanded
      ? Math.min(Math.max(contentHeight, MIN_TEXTAREA_HEIGHT), MAX_TEXTAREA_HEIGHT)
      : MIN_TEXTAREA_HEIGHT;
    const height = expanded
      ? textareaHeight + COMPOSER_CONTROLS_HEIGHT
      : COMPACT_COMPOSER_HEIGHT;

    el.style.overflowY = contentHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
    setComposerExpanded(expanded);
    setComposerHeight(height);
  }, [input]);

  useEffect(() => {
    if (!SITE_KEY) return undefined;

    const renderWidget = () => {
      if (!window.turnstile || !widgetBox.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(widgetBox.current, {
        sitekey: SITE_KEY,
        callback: (token) => { tokenRef.current = token; },
        "expired-callback": () => { tokenRef.current = ""; },
        "error-callback": () => { tokenRef.current = ""; }
      });
    };

    let script = document.querySelector("script[data-turnstile]");
    const createdScript = !script;
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = "1";
    }

    script.addEventListener("load", renderWidget, { once: true });
    if (createdScript) document.head.appendChild(script);
    renderWidget();

    return () => {
      script.removeEventListener("load", renderWidget);
      if (window.turnstile && widgetId.current !== null) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  async function send(text) {
    const content = text.trim();
    if (!content || busy) return;

    if (SITE_KEY && !tokenRef.current) {
      setMessages((current) => [
        ...current,
        { role: "model", text: "لطفاً چند ثانیه صبر کن تا تایید امنیتی انجام شود." }
      ]);
      return;
    }

    const next = [...messages, { role: "user", text: content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, token: tokenRef.current })
      });
      const data = await response.json().catch(() => ({}));
      const reply = response.status === 429
        ? "تعداد پیام‌ها زیاد است، کمی بعد دوباره تلاش کن."
        : response.status === 503
          ? "سرویس چت موقتاً در دسترس نیست، کمی بعد امتحان کن."
          : response.status === 504
            ? "پاسخ دیر شد، دوباره تلاش کن."
            : response.ok
              ? data.reply
              : "خطا در دریافت پاسخ";
      setMessages([...next, { role: "model", text: reply || "پاسخی دریافت نشد." }]);
      setShown(0);
      setTypingIndex(next.length);
    } catch {
      setMessages([...next, { role: "model", text: "خطا در اتصال. دوباره تلاش کن." }]);
      setShown(0);
      setTypingIndex(next.length);
    } finally {
      setLoading(false);
      if (SITE_KEY && window.turnstile && widgetId.current !== null) {
        tokenRef.current = "";
        window.turnstile.reset(widgetId.current);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    send(input);
  }

  const inputUsesArabicScript = /\p{Script=Arabic}/u.test(input);

  return (
    <section className={`chat${typing ? " is-typing" : ""}`} aria-label="Chat">
      <div className="chat-list" dir="rtl" role="log" aria-live="polite">
        {messages.map((message, index) => {
          const isTyping = index === typingIndex;
          const text = isTyping ? Array.from(message.text).slice(0, shown).join("") : message.text;
          const cards = message.role === "model" && index > 0 && !isTyping ? findMentioned(message.text) : [];
          const usesPersianFont = /\p{Script=Arabic}/u.test(text);
          return (
            <div key={index} className="chat-row">
              <div dir="auto" className={`bubble ${message.role === "user" ? "me" : "bot"} ${usesPersianFont ? "is-persian" : "is-english"}`}>
                {text}
              </div>
              {cards.length > 0 && (
                <div className="mc-list">
                  {cards.map((p) => <MiniCard key={p.id} product={p} />)}
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="bubble bot thinking" role="status" aria-label="Thinking">
            <span /><span /><span />
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className={`chat-dock${typing ? " is-typing" : ""}`}>
        {!messages.some((message) => message.role === "user") && (
          <div className="chat-quick" role="group" aria-label="Suggested questions">
            {QUICK.map((question) => (
              <button key={question} type="button" className="chip" dir="auto" onMouseDown={(event) => event.preventDefault()} onClick={() => send(question)} aria-disabled={busy}>
                {question}
              </button>
            ))}
          </div>
        )}

        {SITE_KEY && <div ref={widgetBox} className="chat-captcha" />}

        <form className={`chat-form${composerExpanded ? " is-expanded" : ""}`} dir="rtl" style={{ height: composerHeight }} onSubmit={handleSubmit}>
          <span className="composer-icon composer-plus" aria-hidden="true"><PlusIcon /></span>
          <textarea
            ref={taRef}
            className={inputUsesArabicScript ? "is-persian" : "is-english"}
            dir="auto"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onFocus={() => setTyping(true)}
            onBlur={() => setTyping(false)}
            placeholder="Ask ai ..."
            aria-label="Message"
            aria-describedby="chat-message-count"
            maxLength={MAX_LEN}
          />
          <span id="chat-message-count" className="cnt">{input.length}/{MAX_LEN}</span>
          <span className="composer-icon composer-mic" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="12" rx="3" />
              <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6" />
            </svg>
          </span>
          <button type="submit" className={`snd${input.trim() ? " is-ready" : ""}`} aria-label="Send" onMouseDown={(event) => event.preventDefault()} aria-disabled={busy || !input.trim()}>
            <SendIcon />
          </button>
        </form>
      </div>
    </section>
  );
}