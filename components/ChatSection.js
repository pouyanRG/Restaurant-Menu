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
  const [pendingImage, setPendingImage] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [imageStatus, setImageStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState(null);
  const [shown, setShown] = useState(0);
  const busy = loading || typingIndex !== null;
  const endRef = useRef(null);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const imageRequestRef = useRef(0);
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

  function handleImageSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const requestId = ++imageRequestRef.current;
    setPendingImage(null);

    if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
      setProcessingImage(false);
      setImageStatus("لطفاً یک عکس غذا انتخاب کن.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setProcessingImage(false);
      setImageStatus("حجم عکس باید کمتر از ۱۲ مگابایت باشد.");
      return;
    }

    setProcessingImage(true);
    setImageStatus("");
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      if (requestId !== imageRequestRef.current) return;
      setProcessingImage(false);
      if (!image.naturalWidth || !image.naturalHeight) {
        setImageStatus("این عکس باز نشد. لطفاً عکس دیگری انتخاب کن.");
        return;
      }
      const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        setProcessingImage(false);
        setImageStatus("پردازش عکس انجام نشد. دوباره امتحان کن.");
        return;
      }
      let dataUrl;
      try {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      } catch {
        setProcessingImage(false);
        setImageStatus("پردازش عکس انجام نشد. لطفاً عکس دیگری انتخاب کن.");
        return;
      }
      if (dataUrl.length > 3_500_000) {
        setProcessingImage(false);
        setImageStatus("حجم عکس زیاد است. یک عکس کوچک‌تر انتخاب کن.");
        return;
      }
      setPendingImage({ dataUrl, mimeType: "image/jpeg", name: file.name });
      setProcessingImage(false);
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      if (requestId !== imageRequestRef.current) return;
      setProcessingImage(false);
      setImageStatus("این عکس باز نشد. لطفاً عکس دیگری انتخاب کن.");
    };
    image.src = imageUrl;
  }

  async function send(text, image = null) {
    const content = text.trim() || (image ? "این غذا شبیه کدام مورد از منو است؟" : "");
    if ((!content && !image) || busy || processingImage) return;

    if (SITE_KEY && !tokenRef.current) {
      setMessages((current) => [
        ...current,
        { role: "model", text: "لطفاً چند ثانیه صبر کن تا تایید امنیتی انجام شود." }
      ]);
      return;
    }

    const next = [...messages, { role: "user", text: content, ...(image ? { image: image.dataUrl } : {}) }];
    setMessages(next);
    setInput("");
    setPendingImage(null);
    setProcessingImage(false);
    setImageStatus("");
    setLoading(true);

    try {
      const requestMessages = next.map((message, index) => {
        const textMessage = { ...message };
        delete textMessage.image;
        if (image && index === next.length - 1) {
          return {
            ...textMessage,
            image: {
              mimeType: image.mimeType,
              data: image.dataUrl.slice(image.dataUrl.indexOf(",") + 1)
            }
          };
        }
        return textMessage;
      });
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages, token: tokenRef.current })
      });
      const data = await response.json().catch(() => ({}));
      const reply = response.status === 429
        ? "تعداد پیام‌ها زیاد است، کمی بعد دوباره تلاش کن."
        : response.status === 503
          ? "سرویس چت موقتاً در دسترس نیست، کمی بعد امتحان کن."
          : response.status === 504
            ? "پاسخ دیر شد، دوباره تلاش کن."
            : response.status === 413
              ? "حجم عکس زیاد است. یک عکس کوچک‌تر انتخاب کن."
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
    send(input, pendingImage);
  }

  function removePendingImage() {
    imageRequestRef.current += 1;
    setPendingImage(null);
    setProcessingImage(false);
    setImageStatus("");
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
                {message.image && <img className="chat-photo" src={message.image} alt="عکس غذای ارسال‌شده" />}
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
        {!pendingImage && !messages.some((message) => message.role === "user") && (
          <div className="chat-quick" role="group" aria-label="Suggested questions">
            {QUICK.map((question) => (
              <button key={question} type="button" className="chip" dir="auto" onMouseDown={(event) => event.preventDefault()} onClick={() => send(question)} aria-disabled={busy}>
                {question}
              </button>
            ))}
          </div>
        )}

        {SITE_KEY && <div ref={widgetBox} className="chat-captcha" />}

        {processingImage && <p className="chat-image-status is-processing" role="status">در حال آماده‌سازی عکس…</p>}
        {imageStatus && <p className="chat-image-status" role="alert">{imageStatus}</p>}
        {pendingImage && (
          <div className="chat-image-preview" dir="rtl">
            <img src={pendingImage.dataUrl} alt="پیش‌نمایش عکس غذا" />
            <span>{pendingImage.name}</span>
            <button type="button" onClick={removePendingImage} aria-label="حذف عکس انتخاب‌شده" disabled={busy}>×</button>
          </div>
        )}

        <form className={`chat-form${composerExpanded ? " is-expanded" : ""}`} dir="rtl" style={{ height: composerHeight }} onSubmit={handleSubmit}>
          <input ref={fileRef} className="chat-file-input" type="file" accept="image/*" onChange={handleImageSelect} tabIndex={-1} aria-label="انتخاب عکس غذا" />
          <button
            type="button"
            className="composer-icon composer-plus"
            onClick={() => fileRef.current?.click()}
            aria-label="ارسال عکس غذا"
            title="ارسال عکس غذا"
            disabled={busy}
          ><PlusIcon /></button>
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
          <button type="submit" className={`snd${input.trim() || pendingImage ? " is-ready" : ""}`} aria-label="Send" onMouseDown={(event) => event.preventDefault()} aria-disabled={busy || processingImage || (!input.trim() && !pendingImage)}>
            <SendIcon />
          </button>
        </form>
      </div>
    </section>
  );
}
