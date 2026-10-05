import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { Search, ChevronDown, Sparkles, MessageSquare, ShieldCheck, Zap, CreditCard, Headphones, Code } from 'lucide-react';

interface FaqCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  items: { q: string; a: string }[];
}

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const categories: FaqCategory[] = [
    {
      id: 'features',
      name: 'Fonctionnalité & IA',
      icon: MessageSquare,
      items: [
        {
          q: 'Comment l’agent vocal comprend-il les besoins spécifiques de mes appelants ?',
          a: 'Notre moteur combine des modèles de langage de pointe (LLM vocaux) entraînés spécifiquement sur le vocabulaire métier français (dépannage, terminologie médicale, immobilier, droit). Lors de votre paramétrage en 5 minutes, vous fournissez les règles de votre entreprise, vos consignes et vos tarifs usuels.',
        },
        {
          q: 'L’IA peut-elle gérer plusieurs appels en même temps ?',
          a: 'Oui, simultanément et sans aucune saturation. Que vous receviez 1 ou 50 appels en même temps lors d’un pic d’activité, chaque appelant est accueilli instantanément à la seconde sonnerie, sans mise en attente.',
        },
        {
          q: 'Comment sait-elle si l’appel est une urgence ?',
          a: 'Vous définissez vos critères d’urgence (ex: dégât des eaux, rage de dent aiguë, acheteur au comptant). Dès que ces déclencheurs sont détectés ou que l’interlocuteur exprime une détresse, l’IA active le protocole d’escalade : transfert immédiat vers votre mobile ou envoi d’un SMS d’alerte prioritaire.',
        },
        {
          q: 'Peut-elle proposer un rendez-vous sans que j’intervienne ?',
          a: 'Absolument. Connectée à votre agenda (Google Calendar, Outlook, Calendly ou Doctolib), elle vérifie vos créneaux libres en temps réel, propose 2 alternatives adaptées au client, et pose le rendez-vous immédiatement avec envoi de confirmation.',
        },
      ],
    },
    {
      id: 'integrations',
      name: 'Intégrations & Outils',
      icon: Zap,
      items: [
        {
          q: 'Fonctionne-t-elle avec Calendly, Google Calendar et Outlook ?',
          a: 'Oui, nativement. La synchronisation s’effectue en 2 clics via OAuth sécurisé. Dès qu’un créneau est réservé par l’IA, il est bloqué sur votre calendrier pour éviter tout doublon.',
        },
        {
          q: 'Comment connecter l’agent à mon CRM (HubSpot, Salesforce, Pipedrive) ?',
          a: 'Nous disposons de connecteurs natifs ainsi que d’intégrations via Zapier et Make. À la fin de chaque appel, une nouvelle fiche contact ou opportunité est créée avec le récapitulatif textuel et les coordonnées vérifiées.',
        },
        {
          q: 'J’ai un logiciel maison ou un ERP spécifique, pouvez-vous l’intégrer ?',
          a: 'Oui ! Notre pack Centre d’appels inclut l’accès à notre API REST et à des webhooks configurables en temps réel pour pousser les données d’appels directement sur votre serveur ou base de données.',
        },
      ],
    },
    {
      id: 'compliance',
      name: 'Conformité RGPD & Sécurité',
      icon: ShieldCheck,
      items: [
        {
          q: 'Vos appels sont-ils conformes au RGPD ?',
          a: 'Parfaitement. Nous respectons le principe de minimisation des données. Un message d’information légal peut être activé en début d’appel. Les données sont hébergées exclusivement en Union Européenne (AWS Irlande / Allemagne).',
        },
        {
          q: 'Enregistrez-vous les conversations audio ?',
          a: 'Par défaut, l’audio est transcrit en texte en temps réel, puis le fichier audio brut peut être automatiquement détruit pour préserver l’anonymat si vous le souhaitez. Vous gardez le contrôle total sur la conservation.',
        },
        {
          q: 'Quelle est la durée de conservation des données ?',
          a: 'La durée légale par défaut est de 12 mois pour les historiques, paramétrable jusqu’à 3 ans ou purgeable sur simple clic ou appel API.',
        },
        {
          q: 'Je suis un établissement de santé, êtes-vous compatibles avec le secret médical ?',
          a: 'Oui. Nous signons des accords de traitement de données (DPA) avec engagement de confidentialité stricte conforme aux exigences du Conseil de l’Ordre.',
        },
      ],
    },
    {
      id: 'pricing',
      name: 'Tarifs & Facturation',
      icon: CreditCard,
      items: [
        {
          q: 'Comment passe-t-on de l’essai gratuit au forfait payant ?',
          a: 'Pendant vos 7 jours d’essai, aucune carte bancaire n’est requise. Si vous êtes convaincu, vous saisissez votre moyen de paiement (CB, SEPA) sur Stripe depuis votre tableau de bord avant la fin des 7 jours pour continuer sans interruption.',
        },
        {
          q: 'Puis-je changer de forfait sans pénalité ?',
          a: 'Oui, à tout moment en 1 clic. Le changement prend effet immédiatement avec calcul prorata temporis.',
        },
        {
          q: 'J’utilise moins de 100 minutes par mois, est-ce rentable ?',
          a: 'Pour un artisan, médecin ou agent immobilier, un seul contrat ou acte sauvé rapporte en moyenne 250 € à 1 500 €. Le forfait à 99 € est donc rentabilisé dès le premier appel récupéré.',
        },
      ],
    },
    {
      id: 'technical',
      name: 'Performance & Technique',
      icon: Code,
      items: [
        {
          q: 'Quel est le temps de latence de réponse ?',
          a: 'Notre architecture vocale ultra-optimisée atteint une latence inférieure à 800 millisecondes, offrant une sensation de fluidité identique à un échange téléphonique naturel avec un humain.',
        },
        {
          q: 'Comment rediriger mes appels existants vers l’IA ?',
          a: 'C’est aussi simple qu’un transfert d’appel standard : tapez *21* suivi de votre numéro Permanence IA sur votre téléphone, ou programmez un transfert uniquement lorsque vous êtes occupé ou en non-réponse.',
        },
      ],
    },
  ];

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = categories
    .map((cat) => {
      const items = cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.a.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...cat, items };
    })
    .filter((cat) => {
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
      return cat.items.length > 0;
    });

  return (
    <Layout
      title="FAQ & Centre d'aide | Permanence IA"
      description="Toutes les réponses à vos questions sur notre standard téléphonique IA : fonctionnement, intégrations d'agendas, conformité RGPD, latence et tarifs."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              Centre d&apos;assistance &amp; Réponses
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy dark:text-white tracking-tight">
              Questions fréquentes
            </h1>
            <p className="text-base sm:text-lg text-navy/70 dark:text-gray-300">
              Découvrez en détail le fonctionnement, les fonctionnalités techniques et les garanties de Permanence IA.
            </p>

            {/* Search Input */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-navy/40 dark:text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une question (ex: RGPD, Doctolib, latence, tarifs)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white placeholder-navy/40 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-navy font-bold'
                    : 'bg-gray-100 dark:bg-navy-light/40 text-navy/70 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-light'
                }`}
              >
                Toutes les catégories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-primary text-navy font-bold'
                      : 'bg-gray-100 dark:bg-navy-light/40 text-navy/70 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-light'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-10">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12 text-navy/60 dark:text-gray-400">
                Aucune question ne correspond à votre recherche &laquo; {searchTerm} &raquo;.
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-lg">
                      <Icon className="w-5 h-5" />
                      <h2 className="text-navy dark:text-white">{cat.name}</h2>
                    </div>

                    <div className="space-y-3">
                      {cat.items.map((item, idx) => {
                        const key = `${cat.id}-${idx}`;
                        const isOpen = openItems[key] ?? (searchTerm.length > 0);
                        return (
                          <div
                            key={idx}
                            className="rounded-2xl border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-[#161F2B] overflow-hidden shadow-sm transition-all"
                          >
                            <button
                              type="button"
                              onClick={() => toggleItem(key)}
                              className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-navy dark:text-white hover:text-primary dark:hover:text-accent-glow transition-colors"
                            >
                              <span>{item.q}</span>
                              <ChevronDown
                                className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-200 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-5 pt-1 text-sm text-navy/70 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-navy-light/30">
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Help contact */}
          <div className="p-8 rounded-2xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 text-center space-y-4">
            <h3 className="text-xl font-bold text-navy dark:text-white">Vous avez une question particulière ?</h3>
            <p className="text-sm text-navy/70 dark:text-gray-300 max-w-lg mx-auto">
              Notre équipe d&apos;ingénieurs et spécialistes voix est disponible pour répondre à vos exigences d&apos;infrastructure ou de sécurité.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:contact@permanenceia.com"
                className="px-6 py-3 rounded-xl bg-navy dark:bg-primary text-white dark:text-navy text-sm font-bold shadow hover:opacity-90"
              >
                Envoyer un email à l&apos;équipe
              </a>
              <Link
                href="/essai-gratuit"
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-navy-light text-navy dark:text-white text-sm font-semibold hover:bg-gray-100 dark:hover:bg-navy-light/40"
              >
                Tester directement en direct
              </Link>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
