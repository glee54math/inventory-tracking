import { useEffect, useRef, useState } from "react";
import type { Student, SubmittedAction } from "../../utils/types";
import { loadStudentsFromDB } from "../../utils/inventoryService";
import { parseVoiceCommand, buildActionFromParsedCommand, type ParsedVoiceCommand } from "../../utils/voiceCommandParser";

interface VoiceCommandBarProps {
  onActionCreated: (
    action: SubmittedAction,
    meta: {
      transcript: string;
      originalTranscript: string | null;
      transcriptEdited: boolean;
      parsed: ParsedVoiceCommand;
    }
  ) => void;
}

// The Web Speech API has no official TS lib entry (and Safari/Firefox don't
// implement it at all) — this is a minimal shape covering only what's used here.
interface SpeechRecognitionResultLike {
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onsoundstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onnomatch: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

function VoiceCommandBar({ onActionCreated }: VoiceCommandBarProps) {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [transcript, setTranscript] = useState("");
  // The raw text speech recognition produced, frozen at that point — never
  // touched by manual edits to the textarea below. null means voice was never
  // used this session (e.g. typed straight into the fallback box), so there's
  // no STT baseline to compare against.
  const [originalTranscript, setOriginalTranscript] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [micLevel, setMicLevel] = useState<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const micTestRef = useRef<{ stream: MediaStream; audioCtx: AudioContext; raf: number } | null>(null);
  const speechSupported = getSpeechRecognitionCtor() !== null;
  const isSecureContext = typeof window !== "undefined" && window.isSecureContext;

  useEffect(() => {
    const getStudents = async () => {
      setAllStudents(await loadStudentsFromDB("san-ramon"));
    };
    getStudents();
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
      stopMicTest();
    };
  }, []);

  const stopMicTest = () => {
    const current = micTestRef.current;
    if (current) {
      cancelAnimationFrame(current.raf);
      current.stream.getTracks().forEach((track) => track.stop());
      current.audioCtx.close();
      micTestRef.current = null;
    }
    setMicLevel(null);
  };

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sumSquares = 0;
        for (let i = 0; i < data.length; i++) {
          const normalized = (data[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / data.length);
        setMicLevel(Math.min(100, Math.round(rms * 400)));
        const raf = requestAnimationFrame(tick);
        if (micTestRef.current) micTestRef.current.raf = raf;
      };
      const raf = requestAnimationFrame(tick);
      micTestRef.current = { stream, audioCtx, raf };
    } catch (err) {
      console.error("Mic level test failed:", err);
      setStatusMessage(`Mic test failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const logEvent = (label: string) => {
    const line = `${new Date().toLocaleTimeString()} — ${label}`;
    console.log("SpeechRecognition:", label);
    setDebugLog((prev) => [...prev, line]);
  };

  const startListening = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    // Keep listening through brief pauses instead of ending the session the
    // moment the user stops talking to think — they explicitly hit Stop when done.
    recognition.continuous = true;

    recognition.onstart = () => {
      setStatusMessage("Listening…");
      logEvent("onstart (recognition session began)");
    };
    recognition.onaudiostart = () => logEvent("onaudiostart (mic audio capture began)");
    recognition.onsoundstart = () => logEvent("onsoundstart (some sound detected)");
    recognition.onspeechstart = () => logEvent("onspeechstart (recognized as speech)");
    recognition.onspeechend = () => logEvent("onspeechend");
    recognition.onnomatch = () => logEvent("onnomatch (heard speech, couldn't transcribe it)");
    recognition.onresult = (event) => {
      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript;
      }
      logEvent(`onresult: "${combined}"`);
      setTranscript(combined);
      setOriginalTranscript(combined);
    };
    recognition.onerror = (event) => {
      console.error("SpeechRecognition error:", event.error, event.message);
      logEvent(`onerror: ${event.error}${event.message ? ` — ${event.message}` : ""}`);
      setStatusMessage(`Error: ${event.error}${event.message ? ` — ${event.message}` : ""}`);
      setIsListening(false);
    };
    recognition.onend = () => {
      logEvent("onend (recognition session ended)");
      setStatusMessage("Idle");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setParseErrors([]);
    setTranscript("");
    setOriginalTranscript(null);
    setStatusMessage(null);
    setDebugLog([]);

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Failed to start SpeechRecognition:", err);
      setStatusMessage(`Failed to start: ${err instanceof Error ? err.message : String(err)}`);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop?.();
    setIsListening(false);
  };

  const handleCreateAction = () => {
    if (!transcript.trim()) return;

    const parsed = parseVoiceCommand(transcript, allStudents);
    const action = buildActionFromParsedCommand(parsed);
    const transcriptEdited = originalTranscript !== null && transcript.trim() !== originalTranscript.trim();
    setParseErrors(parsed.errors);
    onActionCreated(action, { transcript, originalTranscript, transcriptEdited, parsed });
  };

  return (
    <div className="flex flex-col gap-2 p-3 border rounded bg-gray-50">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          disabled={!speechSupported}
          title={speechSupported ? undefined : "Voice input isn't supported in this browser — type the command below instead."}
          className={`border rounded px-3 py-1 ${
            isListening ? "bg-red-200 outline-1 outline-red-500" : "bg-white outline-1 outline-gray-400"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isListening ? "⏹ Stop" : "🎙 Speak Command"}
        </button>
        <span className="text-sm text-gray-500">
          {speechSupported
            ? "Speak, then review/edit the transcript below before creating the action."
            : "Voice input isn't supported in this browser — type the command instead."}
        </span>
      </div>

      {speechSupported && !isSecureContext && (
        <p className="text-sm text-amber-700">
          This page isn't running in a secure context (HTTPS or localhost) — the browser will likely block microphone access.
        </p>
      )}

      {statusMessage && (
        <p className={`text-sm ${statusMessage.startsWith("Error") || statusMessage.startsWith("Failed") ? "text-red-600" : "text-gray-600"}`}>
          {statusMessage}
        </p>
      )}

      {debugLog.length > 0 && (
        <pre className="text-xs bg-white border rounded p-2 max-h-32 overflow-y-auto whitespace-pre-wrap">
          {debugLog.join("\n")}
        </pre>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={micLevel === null ? startMicTest : stopMicTest}
          className="border rounded px-2 py-0.5 text-sm bg-white outline-1 outline-gray-400"
        >
          {micLevel === null ? "Test Mic Level" : "Stop Mic Test"}
        </button>
        {micLevel !== null && (
          <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-green-500 transition-[width] duration-75"
              style={{ width: `${micLevel}%` }}
            />
          </div>
        )}
      </div>
      {micLevel !== null && (
        <p className="text-xs text-gray-500">
          Speak — this bar should move if the browser is actually receiving audio from your mic (independent of speech recognition).
        </p>
      )}

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder='e.g. "Assign 1 copy of MG4 41-70 to Connor Kim from the Back Inventory."'
        className="border rounded p-2 w-full text-sm"
        rows={2}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCreateAction}
          disabled={!transcript.trim()}
          className="border outline-1 outline-blue-500 rounded bg-blue-200 px-4 py-1 hover:!bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Action from Command
        </button>
      </div>

      {parseErrors.length > 0 && (
        <ul className="text-sm text-amber-700 list-disc list-inside">
          {parseErrors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VoiceCommandBar;
