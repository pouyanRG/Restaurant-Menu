"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, SendIcon } from "./Icons";
import { products } from "@/data/products";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const QUICK = ["ارزون‌ترین غذا چیه؟", "What's the best pizza?", "یه چیز سبک"];
const MAX_LEN = 500;

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
  const [messages, setMessages] = useState([
    { role: "model", text: "سلام! درباره منو هر سوالی داری بپرس" }
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

  // تکست‌اریا با تایپ بزرگ می‌شود
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
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

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
  }

  return (
    <section className="chat" aria-label="Chat">
      <div className="chat-list" dir="rtl" role="log" aria-live="polite">
        {messages.map((message, index) => {
          const isTyping = index === typingIndex;
          const text = isTyping ? Array.from(message.text).slice(0, shown).join("") : message.text;
          const cards = message.role === "model" && index > 0 && !isTyping ? findMentioned(message.text) : [];
          return (
            <div key={index} className="chat-row">
              <div dir="auto" className={`bubble ${message.role === "user" ? "me" : "bot"}`}>
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

      <p className="chat-privacy" dir="auto">برای پاسخ‌گویی، پیام‌ها به Google ارسال می‌شوند؛ اطلاعات شخصی ننویس.</p>

      <div className="chat-quick">
        {QUICK.map((question) => (
          <button key={question} type="button" className="chip" onClick={() => send(question)} disabled={busy}>
            {question}
          </button>
        ))}
      </div>

      {SITE_KEY && <div ref={widgetBox} className="chat-captcha" />}

      <form className="chat-form" dir="rtl" onSubmit={handleSubmit}>
        <textarea
          ref={taRef}
          dir="auto"
          rows={1}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="پیام بنویس..."
          aria-label="Message"
          maxLength={MAX_LEN}
        />
        <span className="cnt">{input.length}/{MAX_LEN}</span>
        <button type="submit" className="snd" aria-label="Send" disabled={busy || !input.trim()}>
          <SendIcon />
        </button>
      </form>
    </section>
  );
}