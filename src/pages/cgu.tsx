import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function CGU() {
  return (
    <Layout
      title="Conditions Générales d'Utilisation (CGU) | Permanence IA"
      description="Consultez les conditions générales d'utilisation et de vente applicables aux forfaits et services de standard téléphonique IA Permanence IA."
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              Conditions contractuelles
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy dark:text-white">
              Conditions Générales d&apos;Utilisation &amp; de Vente (CGU/CGV)
            </h1>
            <p className="text-xs text-navy/60 dark:text-gray-400">
              Applicables aux professionnels et entreprises &bull; Dernière mise à jour : 29 Septembre 2026
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-8 text-sm sm:text-base text-navy/80 dark:text-gray-300 leading-relaxed">
            
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                Article 1 &mdash; Objet du service
              </h2>
              <p>
                Les présentes Conditions Générales régissent l&apos;accès et l&apos;utilisation de la plateforme logicielle et des services de téléphonie par agent conversationnel d&apos;intelligence artificielle commercialisés sous la marque <strong>Permanence IA</strong> par la société SINAY STRATEGIC LLC.
              </p>
              <p>
                Le service permet aux entreprises de déléguer l&apos;accueil téléphonique entrant, la qualification des interlocuteurs et la prise de rendez-vous synchronisée 24 heures sur 24 et 7 jours sur 7.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                Article 2 &mdash; Modalités de l&apos;Essai Gratuit 7 Jours
              </h2>
              <p>
                Chaque nouvel utilisateur bénéficie d&apos;une période d&apos;essai gratuit d&apos;une durée de sept (7) jours calendaires consécutifs à compter de la création de son compte :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Aucune carte bancaire requise :</strong> Aucun renseignement de moyen de paiement n&apos;est exigé pour démarrer l&apos;essai.</li>
                <li><strong>Arrêt automatique :</strong> À l&apos;issue des 7 jours, si l&apos;utilisateur ne choisit pas d&apos;activer un abonnement payant, le service s&apos;interrompt de plein droit sans qu&apos;aucune somme ne soit débitée.</li>
                <li><strong>Usage loyal :</strong> L&apos;essai gratuit est limité à un seul par entité juridique / numéro SIREN.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                Article 3 &mdash; Droit de rétractation &amp; Garantie Sérénité 14 jours
              </h2>
              <p>
                Bien que les contrats conclus entre professionnels ne bénéficient pas légalement du droit de rétractation consommateur, Permanence IA accorde à titre commercial une <strong>garantie de remboursement intégral sous 14 jours</strong> suivant la première souscription payante.
              </p>
              <p>
                Sur simple notification par email à <strong>contact@permanenceia.com</strong> dans les 14 jours suivant le premier paiement, l&apos;intégralité de la mensualité est remboursée sans justification.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                Article 4 &mdash; Facturation, Tarifs &amp; Résiliation
              </h2>
              <p>
                Les règlements sont opérés mensuellement ou annuellement via notre prestataire de paiement sécurisé Stripe. L&apos;abonnement est reconduit tacitement pour des périodes successives de même durée.
              </p>
              <p>
                Le client peut résilier son abonnement à tout moment et sans préavis depuis son tableau de bord <strong>app.permanenceia.com</strong>. La résiliation prendra effet au terme de la période mensuelle ou annuelle déjà acquittée.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                Article 5 &mdash; Responsabilité et nature de l&apos;obligation
              </h2>
              <p>
                Permanence IA est tenue à une <strong>obligation de moyens</strong> quant à la disponibilité et au traitement technique des flux d&apos;appels. L&apos;utilisateur reconnaît que les modèles d&apos;intelligence artificielle générative et de synthèse vocale peuvent occasionnellement produire des réponses approximatives ou inexactes.
              </p>
              <p>
                En aucun cas la responsabilité de Permanence IA ne saurait être engagée pour des pertes d&apos;exploitation indirectes, manques à gagner ou préjudices commerciaux. Dans tous les cas, le plafond maximal d&apos;indemnisation est expressément limité au montant hors taxes versé par le client au cours du mois précédant le fait générateur.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                Article 6 &mdash; Usages interdits &amp; Suspension
              </h2>
              <p>
                Sont strictement prohibés : les campagnes de démarchage téléphonique non sollicité (spam vocal abusif), les activités frauduleuses, les propos diffamatoires, discriminatoires ou illicites. En cas de constat d&apos;usage abusif, Permanence IA se réserve le droit de suspendre l&apos;accès à la ligne dédiée sans indemnité.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-navy dark:text-white border-b border-gray-200 dark:border-navy-light/60 pb-2">
                Article 7 &mdash; Droit applicable et juridiction compétente
              </h2>
              <p>
                Les présentes CGU/CGV sont soumises au droit français. En cas de litige relatif à leur interprétation ou exécution, compétence expresse est attribuée au Tribunal de Commerce de Paris.
              </p>
            </section>

          </div>

        </div>
      </div>
    </Layout>
  );
}
