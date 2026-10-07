# Domaine e-mail Stripe : permanenceia.com (7 octobre 2026)

Les reçus, factures, relances et rappels de fin d'essai de Stripe (compte Permanence IA) partiront de `@permanenceia.com` (par exemple `receipts@permanenceia.com`) au lieu de `stripe.com`. Les réponses des clients arrivent à l'e-mail de support des « Public details » de Stripe.

Domaine ajouté dans Stripe → Settings → Customer emails → Your custom email domains (statut « Verifying »).

## Enregistrements DNS à créer dans Cloudflare (zone permanenceia.com)

Les CNAME doivent rester en **DNS only** (nuage gris), sinon Stripe ne peut pas les vérifier.

| Type | Nom | Valeur |
|---|---|---|
| TXT | `@` | `stripe-verification=2496e15e7f6d90cf0125cc87f8af1e9d6936842e39455636b495e2ec12e18a71` |
| CNAME | `bwnon64fru2vaegvdxjrhzymh5x2hitj._domainkey` | `bwnon64fru2vaegvdxjrhzymh5x2hitj.dkim.custom-email-domain.stripe.com` |
| CNAME | `dblrlwzjfdwu3h3ywx42ao3xpz6iqz5d._domainkey` | `dblrlwzjfdwu3h3ywx42ao3xpz6iqz5d.dkim.custom-email-domain.stripe.com` |
| CNAME | `lyq6izsxfizjmhpqy5aaos2dvx6a6hmg._domainkey` | `lyq6izsxfizjmhpqy5aaos2dvx6a6hmg.dkim.custom-email-domain.stripe.com` |
| CNAME | `mbqtdcp5kygvcplyo3fcj3ygj3eqderq._domainkey` | `mbqtdcp5kygvcplyo3fcj3ygj3eqderq.dkim.custom-email-domain.stripe.com` |
| CNAME | `tutxg75awyo6zm6e2ybzojs3hojcinns._domainkey` | `tutxg75awyo6zm6e2ybzojs3hojcinns.dkim.custom-email-domain.stripe.com` |
| CNAME | `xc2ekv746xhei3vjbovqc365zib525ky._domainkey` | `xc2ekv746xhei3vjbovqc365zib525ky.dkim.custom-email-domain.stripe.com` |
| CNAME | `bounce` | `custom-email-domain.stripe.com` |

Déjà en place, à ne pas toucher : SPF Zoho (`v=spf1 include:zohomail.com ~all`), MX Zoho, DKIM Zoho (`zmail._domainkey`), DMARC `v=DMARC1; p=none; rua=mailto:contact@permanenceia.com` (compatible avec Stripe : pas de `aspf=s`).

Ensuite : Stripe → Customer emails → permanenceia.com → « Try verifying now » (jusqu'à 72 h). Une fois « Verified », Stripe envoie depuis ce domaine ; un e-mail de test est possible depuis le menu « ⋯ ».
