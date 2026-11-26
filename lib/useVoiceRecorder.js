"use client";
import { useCallback, useEffect, useRef, useState } from "react";

function pickMime() {
  if (typeof MediaRecorder === "undefined") return "";
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

export default function useVoiceRecorder({ onFinish, onError, maxSeconds = 60 }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const discardRef = useRef(false);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const cbRef = useRef({ onFinish, onError });

  useEffect(() => { cbRef.current = { onFinish, onError }; });
  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(animationRef.current);
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recRef.current = null;
    setRecording(false);
    setSeconds(0);
  }, []);

  const start = useCallback(async () => {
    if (recRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      cbRef.current.onError?.("unsupported");
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMime();
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      discardRef.current = false;
      rec.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || mimeType || "audio/webm" });
        const discard = discardRef.current;
        cleanup();
        if (!discard && blob.size > 0) cbRef.current.onFinish?.(blob);
      };
      rec.start();
      streamRef.current = stream;
      recRef.current = rec;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const audioContext = new AudioCtx();
          audioContextRef.current = audioContext;
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          audioContext.createMediaStreamSource(stream).connect(analyser);
          analyserRef.current = analyser;
        }
      } catch {
        analyserRef.current = null;
        audioContextRef.current?.close().catch(() => {});
        audioContextRef.current = null;
      }
      setRecording(true);
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        setSeconds(elapsed);
        if (elapsed >= maxSeconds && rec.state !== "inactive") rec.stop();
      }, 250);
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      cbRef.current.onError?.(error?.name === "NotAllowedError" ? "denied" : "failed");
    }
  }, [cleanup, maxSeconds]);

  const stop = useCallback(() => {
    if (recRef.current?.state === "recording") recRef.current.stop();
  }, []);
  const cancel = useCallback(() => {
    discardRef.current = true;
    if (recRef.current?.state === "recording") recRef.current.stop();
  }, []);

  useEffect(() => () => {
    discardRef.current = true;
    if (recRef.current?.state === "recording") recRef.current.stop();
    cleanup();
  }, [cleanup]);

  return { recording, seconds, analyserRef, start, stop, cancel };
}
