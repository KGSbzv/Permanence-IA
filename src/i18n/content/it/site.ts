// Messaggi trasversali (banner di prova, badge, nota sui prezzi). Le cifre arrivano dal mercato.
import type { SITE_TEXT as FR_SITE_TEXT } from '../fr/site';

export const SITE_TEXT: typeof FR_SITE_TEXT = {
  trialLine: (days: number, minutes: number) => `${days} giorni di prova gratuita — ${minutes} minuti inclusi — prezzi IVA esclusa — senza vincoli`,
  trialBadges: (days: number, minutes: number) => [`${days} giorni di prova gratuita`, `${minutes} minuti inclusi`, 'Nessun addebito durante la prova', 'Senza vincoli'],
  growthLines: ['Aggiunga minuti in qualsiasi momento', 'Passi al piano superiore quando il Suo volume cresce'],
  priceNote: (numberFrom: string) => `Prezzi in dollari USA (USD), IVA esclusa — eventuali imposte locali in aggiunta. Acquisto di un numero dedicato a partire da ${numberFrom} IVA esclusa al mese, a seconda del paese.`,
  skipToContent: 'Vai al contenuto',
  languageLabel: 'Lingua',
  payg: (rate: string) => `Non è ancora pronto per un piano? Paghi a consumo: ${rate} IVA esclusa al minuto, senza abbonamento. Aggiunge credito quando vuole (Add credits); non scade. Un piano costa meno appena le chiamate sono regolari.`,
  rechargeFreeAmount: 'L’importo è libero: lo inserisca nella Sua area clienti (Add credits). Gli importi sopra sono esempi.',
};
