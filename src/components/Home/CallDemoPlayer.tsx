import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, PhoneIncoming, User, Bot, CheckCircle2, Clock } from 'lucide-react';

interface DialogTurn {
  speaker: 'caller' | 'agent';
  text: string;
  time: string;
  badge?: string;
}

const DEMO_TRANSCRIPT: DialogTurn[] = [
  {
    speaker: 'caller',
    text: "Bonjour, j'ai une fuite importante sous mon évier de cuisine, l'eau commence à déborder !",
    time: '00:03',
  },
  {
    speaker: 'agent',
    text: "Bonjour ! Ne vous inquiétez pas, je prends immédiatement en charge votre urgence. Dans quelle ville ou code postal êtes-vous situé ?",
    time: '00:07',
    badge: 'Urgence détectée',
  },
  {
    speaker: 'caller',
    text: "Je suis à Lyon 3ème, rue Paul Bert. Est-ce que quelqu'un peut intervenir ce matin ?",
    time: '00:13',
  },
  {
    speaker: 'agent',
    text: "Parfait. J'ai un créneau d'astreinte disponible dans 45 minutes avec notre technicien Thomas. Puis-je avoir votre numéro pour vous envoyer la confirmation par SMS ?",
    time: '00:19',
    badge: 'Créneau réservé',
  },
  {
    speaker: 'caller',
    text: "Oui, je vous le communique : c'est au nom de Dupont.",
    time: '00:25',
  },
  {
    speaker: 'agent',
    text: "C'est noté M. Dupont. Le dossier est ouvert, Thomas est en route et le récapitulatif vient d'être envoyé par SMS. À tout de suite !",
    time: '00:31',
    badge: 'Fiche CRM créée',
  },
];

export default function CallDemoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DEMO_TRANSCRIPT.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleToggle = () => {
    if (currentStep >= DEMO_TRANSCRIPT.length) {
      setCurrentStep(1);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
  };

  return (
    <div className="relative rounded-2xl bg-white dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 shadow-brand overflow-hidden">
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#111722] border-b border-gray-200 dark:border-navy-light/40">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-mono text-navy/60 dark:text-gray-400 flex items-center gap-1.5">
            <PhoneIncoming className="w-3.5 h-3.5 text-primary" /> Démonstration simulée &bull; exemple de conversation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary dark:text-accent-glow font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> IA Active
          </span>
        </div>
      </div>

      {/* Simulated Audio Waveform Bar */}
      <div className="px-5 py-3.5 bg-gray-100/70 dark:bg-[#0D141D] flex items-center justify-between gap-4 border-b border-gray-200/60 dark:border-navy-light/30">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            type="button"
            className="w-10 h-10 rounded-full bg-primary hover:bg-[#3dbbb2] text-navy flex items-center justify-center transition-all shadow-sm transform hover:scale-105"
            aria-label={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-navy" /> : <Play className="w-4 h-4 fill-navy ml-0.5" />}
          </button>
          <div>
            <div className="text-xs font-semibold text-navy dark:text-white">Simulation en temps réel</div>
            <div className="text-[11px] text-navy/60 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Durée d&apos;appel : {DEMO_TRANSCRIPT[Math.min(currentStep, DEMO_TRANSCRIPT.length) - 1]?.time || '00:00'}
            </div>
          </div>
        </div>

        {/* Dynamic Voice Bars */}
        <div className="flex items-center gap-1">
          {[16, 28, 40, 24, 32, 18, 30, 22, 38, 14, 26, 36].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-primary transition-all duration-300 ${
                isPlaying ? 'opacity-100' : 'opacity-35'
              }`}
              style={{
                height: isPlaying ? `${Math.max(8, (h * ((i % 3) + 1.2)) % 32)}px` : `${Math.max(6, h * 0.4)}px`,
              }}
            />
          ))}
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-navy/60 dark:text-gray-400 hover:text-navy dark:hover:text-white flex items-center gap-1"
          title="Recommencer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rejouer</span>
        </button>
      </div>

      {/* Transcript Body */}
      <div className="p-5 space-y-4 max-h-[360px] overflow-y-auto">
        {DEMO_TRANSCRIPT.slice(0, currentStep).map((turn, index) => {
          const isAgent = turn.speaker === 'agent';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 transition-all duration-300 ${
                isAgent ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isAgent
                    ? 'bg-primary text-navy'
                    : 'bg-navy dark:bg-navy-light text-white'
                }`}
              >
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  isAgent
                    ? 'bg-gray-100 dark:bg-navy-light/70 text-navy dark:text-gray-100 border border-gray-200/80 dark:border-navy-subtle rounded-tl-sm'
                    : 'bg-primary/15 dark:bg-primary/20 text-navy dark:text-white border border-primary/20 rounded-tr-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[11px] font-semibold text-navy/60 dark:text-gray-400">
                    {isAgent ? 'Permanence IA' : 'Appelant'}
                  </span>
                  <span className="text-[10px] font-mono text-navy/50 dark:text-gray-400">
                    {turn.time}
                  </span>
                </div>
                <p className="leading-relaxed">{turn.text}</p>
                {turn.badge && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{turn.badge}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 bg-gray-50/80 dark:bg-[#111722]/80 border-t border-gray-200 dark:border-navy-light/40 flex items-center justify-between text-xs text-navy/60 dark:text-gray-400">
        <span className="font-mono">Latence vocale: ~720ms &bull; Transcription instantanée</span>
        <span className="font-semibold text-primary">Prise de RDV Google Calendar &amp; SMS</span>
      </div>
    </div>
  );
}
