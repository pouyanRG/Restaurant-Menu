"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, PlusIcon, SendIcon, MicIcon, StopIcon } from "./Icons";
import { products } from "@/data/products";
import useKeyboardInset from "@/lib/useKeyboardInset";
import useVoiceRecorder from "@/lib/useVoiceRecorder";
import { blobToWav16k } from "@/lib/audio";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const QUICK = ["What's the most popular dish?", "What do you recommend?","What's the best pizza?","What are the vegan options?","What's your best dessert?","What can I get under $10?"];
const STT_ERRORS = {
  400: "فایل صوتی معتبر نبود، دوباره ضبط کن.",
  403: "تأیید امنیتی یا دسترسی سرور رد شد.",
  413: "ضبط خیلی طولانی است، کوتاه‌تر ضبط کن.",
  429: "تعداد درخواست‌ها زیاد است، کمی بعد دوباره تلاش کن.",
  503: "سرویس تبدیل صدا موقتاً در دسترس نیست.",
  504: "تبدیل صدا زیاد طول کشید، دوباره تلاش کن."
};

const CHAT_ERRORS = {
  400: "درخواست معتبر نبود. دوباره تلاش کن.",
  403: "دسترسی یا تأیید امنیتی رد شد.",
  413: "حجم عکس زیاد است. یک عکس کوچک‌تر انتخاب کن.",
  429: "تعداد پیام‌ها زیاد است، کمی بعد دوباره تلاش کن.",
  503: "سرویس چت موقتاً در دسترس نیست، کمی بعد امتحان کن.",
  504: "پاسخ دیر شد، دوباره تلاش کن."
};
const MAX_LEN = 500;
const MIN_TEXTAREA_HEIGHT = 36;
const MAX_TEXTAREA_HEIGHT = 136;
const COMPACT_COMPOSER_HEIGHT = 54;
const COMPOSER_CONTROLS_HEIGHT = 62;

function VoiceWaveform({ analyserRef }) {
  const barsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const analyser = analyserRef.current;
    if (!analyser) return undefined;

    const values = new Uint8Array(analyser.frequencyBinCount);
    const smoothed = Array(28).fill(3);
    let frameId;
    let previousFrame = 0;

    const draw = (time) => {
      if (!containerRef.current?.isConnected) return;
      analyser.getByteFrequencyData(values);
      if (time - previousFrame >= 1000 / 30) {
        const minBin = 1;
        const maxBin = Math.min(values.length, 180);
        const binScale = (maxBin / minBin) ** (1 / smoothed.length);
        for (let index = 0; index < smoothed.length; index++) {
          const from = Math.floor(minBin * binScale ** index);
          const to = Math.min(maxBin, Math.max(from + 1, Math.floor(minBin * binScale ** (index + 1))));
          let energy = 0;
          for (let bin = from; bin < to; bin++) energy += (values[bin] / 255) ** 2;
          const rms = Math.sqrt(energy / (to - from));
          const target = Math.min(38, Math.max(3, 3 + rms * 145));
          const factor = target > smoothed[index] ? 0.32 : 0.14;
          smoothed[index] += (target - smoothed[index]) * factor;
          const bar = barsRef.current[index];
          if (bar) bar.style.height = `${smoothed[index].toFixed(1)}px`;
        }
        previousFrame = time;
      }
      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [analyserRef]);

  return (
    <span ref={containerRef} className="chat-voice-wave" role="img" aria-label="Live microphone audio waveform">
      {Array.from({ length: 28 }, (_, index) => <i key={index} ref={(bar) => { barsRef.current[index] = bar; }} />)}
    </span>
  );
}

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
  const [streaming, setStreaming] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const busy = loading || streaming || transcribing;
  const endRef = useRef(null);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const imageRequestRef = useRef(0);
  const widgetBox = useRef(null);
  const widgetId = useRef(null);
  const tokenRef = useRef("");

  function resetCaptcha() {
    if (SITE_KEY && window.turnstile && widgetId.current !== null) {
      tokenRef.current = "";
      window.turnstile.reset(widgetId.current);
    }
  }

  async function transcribeBlob(blob) {
    if (SITE_KEY && !tokenRef.current) {
      setVoiceNote("لطفاً چند ثانیه صبر کن تا تایید امنیتی انجام شود و دوباره ضبط کن.");
      return;
    }
    setTranscribing(true);
    setVoiceNote("");
    try {
      const wav = await blobToWav16k(blob);
      const form = new FormData();
      form.append("audio", wav, "voice.wav");
      form.append("token", tokenRef.current);
      const response = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error("Transcribe error:", response.status, data);
        setVoiceNote(STT_ERRORS[response.status] || "تبدیل صدا به متن انجام نشد، دوباره تلاش کن.");
        return;
      }
      const text = (data.text || "").trim();
      if (!text) { setVoiceNote("صدایی تشخیص داده نشد."); return; }
      setInput((current) => (current ? `${current} ${text}` : text).slice(0, MAX_LEN));
      taRef.current?.focus();
    } catch (error) {
      console.error("Voice processing failed:", error);
      setVoiceNote("پردازش صدا انجام نشد، دوباره تلاش کن.");
    } finally {
      setTranscribing(false);
      resetCaptcha();
    }
  }

  const { recording, analyserRef, start, stop, cancel } = useVoiceRecorder({
    onFinish: transcribeBlob,
    onError: (code) => setVoiceNote(
      code === "denied" ? "دسترسی به میکروفون داده نشد. از تنظیمات مرورگر اجازه بده."
        : code === "unsupported" ? "این مرورگر ضبط صدا را پشتیبانی نمی‌کند."
          : code === "empty" ? "صدایی ضبط نشد، دوباره تلاش کن."
            : "ضبط صدا شروع نشد.")
  });
  const canSend = Boolean(input.trim() || pendingImage) && !busy && !recording && !processingImage;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: streaming ? "auto" : "smooth" });
  }, [messages, loading, streaming]);

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
    if ((!content && !image) || busy || recording || processingImage) return;

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
    setVoiceNote("");
    setLoading(true);

    const setReply = (reply) => setMessages([...next, { role: "model", text: reply }]);

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

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("Chat error:", response.status, data);
        setReply(CHAT_ERRORS[response.status] || "خطا در دریافت پاسخ");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        if (!full) continue;
        setLoading(false);
        setStreaming(true);
        setReply(full);
      }
      full += decoder.decode();
      setReply(full.trim() || "پاسخی دریافت نشد.");
    } catch (error) {
      console.error("Chat request failed:", error);
      setReply("خطا در اتصال. دوباره تلاش کن.");
    } finally {
      setLoading(false);
      setStreaming(false);
      resetCaptcha();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    send(input, pendingImage);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input, pendingImage);
    }
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
          const isStreamingMsg = streaming && index === messages.length - 1;
          const text = message.text;
          const cards = message.role === "model" && index > 0 && !isStreamingMsg ? findMentioned(text) : [];
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
              <button key={question} type="button" className="chip" dir="auto" onMouseDown={(event) => event.preventDefault()} onClick={() => send(question)} disabled={busy || recording}>
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

        {transcribing && <p className="chat-image-status is-processing" role="status">در حال تبدیل صدا به متن…</p>}
        {voiceNote && <p className="voice-note" role="alert" dir="auto">{voiceNote}</p>}
        <form className={`chat-form${composerExpanded ? " is-expanded" : ""}${recording ? " is-recording" : ""}`} dir="rtl" style={{ height: composerHeight }} onSubmit={handleSubmit}>
          <input ref={fileRef} className="chat-file-input" type="file" accept="image/*" onChange={handleImageSelect} tabIndex={-1} aria-label="Choose food image" />
          <button type="button" className={`snd attach${recording ? " is-cancel" : ""}`} onClick={() => { if (recording) cancel(); else fileRef.current?.click(); }} aria-label={recording ? "Cancel voice recording" : "Attach food image"} title={recording ? "Cancel voice recording" : "Attach food image"}><PlusIcon /></button>
          {recording && <>
            <VoiceWaveform analyserRef={analyserRef} />
            <button type="button" className="snd rec-stop" aria-label="Stop and transcribe" onClick={stop}><StopIcon /></button>
          </>}
          <button type="submit" className={`snd send-action${canSend || recording ? " is-ready" : ""}`} aria-label="Send" onMouseDown={(event) => event.preventDefault()} disabled={!canSend}><SendIcon /></button>
          <textarea ref={taRef} className={inputUsesArabicScript ? "is-persian" : "is-english"} dir="auto" rows={1} hidden={recording} value={input}
            onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown}
            onFocus={() => setTyping(true)} onBlur={() => setTyping(false)}
            placeholder={transcribing ? "Transcribing audio..." : "Ask ai menu..."}
            aria-label="Message" maxLength={MAX_LEN} readOnly={transcribing} />
          <span className="cnt" hidden={recording}>{input.length}/{MAX_LEN}</span>
          <button type="button" className="snd mic" aria-label="Voice recording" hidden={recording}
            onMouseDown={(event) => event.preventDefault()} onClick={() => {
              if (busy) { setVoiceNote("صبر کن تا کار قبلی تمام شود."); return; }
              setVoiceNote("");
              start();
            }}><MicIcon /></button>
        </form>
      </div>
    </section>
  );
}
