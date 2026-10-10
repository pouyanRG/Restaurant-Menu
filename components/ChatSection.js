"use client";
import { useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const QUICK = ["یه چیز سبک پیشنهاد بده", "What's the best pizza?", "ارزون‌ترین غذا چیه؟"];

export default function ChatSection() {
  const [messages, setMessages] = useState([
    { role: "model", text: "سلام! درباره منو هر سوالی داری بپرس 🍕" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const widgetBox = useRef(null);
  const widgetId = useRef(null);
  const tokenRef = useRef("");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
    if (!content || loading) return;

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
    } catch {
      setMessages([...next, { role: "model", text: "خطا در اتصال. دوباره تلاش کن." }]);
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

  return (
    <section className="chat" aria-label="Chat">
      <div className="chat-list" role="log" aria-live="polite">
        {messages.map((message, index) => (
          <div key={index} dir="auto" className={`bubble ${message.role === "user" ? "me" : "bot"}`}>
            {message.text}
          </div>
        ))}
        {loading && <div className="bubble bot">...</div>}
        <div ref={endRef} />
      </div>
      <p className="chat-privacy" dir="auto">برای پاسخ‌گویی، پیام‌ها به Google ارسال می‌شوند؛ اطلاعات شخصی ننویس.</p>
      <div className="chat-quick">
        {QUICK.map((question) => (
          <button key={question} type="button" className="chip" onClick={() => send(question)} disabled={loading}>
            {question}
          </button>
        ))}
      </div>
      {SITE_KEY && <div ref={widgetBox} className="chat-captcha" />}
      <form className="chat-form glass" onSubmit={handleSubmit}>
        <input
          dir="auto"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="پیام بنویس..."
          aria-label="Message"
          maxLength={500}
        />
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
    </section>
  );
}