import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';
import { CallbackForm } from './ui';

export default function CallbackModal() {
  const { isOpen, options, closeCallbackModal } = useCallbackModal();
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>('input,select,textarea,button')?.focus();
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCallbackModal(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; prev?.focus(); };
  }, [isOpen, closeCallbackModal]);

  if (!isOpen) return null;
  const support = options.type === 'support';
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-night/60 p-0 sm:items-center sm:p-4" onClick={closeCallbackModal}>
      <div
        ref={dialog} role="dialog" aria-modal="true" aria-labelledby="cb-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-float sm:rounded-3xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="cb-title" className="font-display text-2xl font-bold">{support ? 'Demander un rappel du support' : 'Laissez votre numéro, on vous rappelle'}</h2>
            <p className="mt-1 text-[15px]">Choisissez votre créneau. Nous ne publions aucun numéro : c’est nous qui vous rappelons.</p>
          </div>
          <button type="button" onClick={closeCallbackModal} aria-label="Fermer" className="rounded-md p-1.5 text-slate hover:bg-paper"><X className="h-5 w-5" /></button>
        </div>
        <CallbackForm type={options.type || 'commercial'} sector={options.sector} />
      </div>
    </div>
  );
}
