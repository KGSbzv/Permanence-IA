#!/bin/bash
# Pose un jeton des webhooks dans les outils Autocalls (en-tête x-webhook-token, jeton retiré de l'adresse) et dans le
# relais « Relais fin d'échange → site (PermanenceAI) ». Le jeton et la clé Autocalls sont lus dans Secret Manager et
# ne sont jamais affichés. Rien n'est modifié si le site n'accepte pas encore le jeton (route /api/webhooks/ping).
#   bash scripts/jeton-webhooks.sh                  # jeton WEBHOOK_TOKEN_NEXT (passage à l'en-tête)
#   bash scripts/jeton-webhooks.sh WEBHOOK_TOKEN    # même chose avec un autre secret, par exemple après la rotation
set -uo pipefail
cd "$(dirname "$0")/.."
SECRET="${1:-WEBHOOK_TOKEN_NEXT}"
P=snarecore-cacrs
API=https://app.autocalls.ai/api/user
TOOLS="6241 6176 6177 6178 6182 6240 6242 6246 6247 6248 6243"

T="$(gcloud secrets versions access latest --secret "$SECRET" --project "$P" 2>/dev/null)" || { echo "Secret $SECRET illisible : rien n'a été modifié."; exit 1; }
K="$(gcloud secrets versions access latest --secret AUTOCALLS_API_KEY --project "$P" 2>/dev/null)" || { echo "Clé Autocalls illisible : rien n'a été modifié."; exit 1; }
export T

code=$(curl -s -o /dev/null -w '%{http_code}' -H "x-webhook-token: $T" https://www.permanenceia.com/api/webhooks/ping)
if [ "$code" != "200" ]; then echo "Le site n'accepte pas encore ce jeton (code $code) : rien n'a été modifié."; exit 1; fi
echo "Site : jeton accepté."

ok=0; ko=0
for id in $TOOLS; do
  cur=$(curl -s -H "Authorization: Bearer $K" -H 'Accept: application/json' "$API/tools/$id")
  body=$(printf %s "$cur" | python3 -c '
import json, os, sys, urllib.parse as u
d = json.load(sys.stdin); d = d.get("data", d)
p = u.urlsplit(d["endpoint"])
if p.netloc != "www.permanenceia.com": sys.exit("hôte inattendu")
q = [(k, v) for k, v in u.parse_qsl(p.query, keep_blank_values=True) if k != "token"]
ep = u.urlunsplit((p.scheme, p.netloc, p.path, u.urlencode(q), p.fragment))
print(json.dumps({"endpoint": ep, "headers": [{"name": "Content-Type", "value": "application/json"}, {"name": "x-webhook-token", "value": os.environ["T"]}]}))
' 2>/dev/null) || { echo "Outil $id : lecture impossible, laissé tel quel."; ko=$((ko+1)); continue; }
  res=$(printf %s "$body" | curl -s -o /dev/null -w '%{http_code}' -X PUT -H "Authorization: Bearer $K" -H 'Content-Type: application/json' -H 'Accept: application/json' --data-binary @- "$API/tools/$id")
  path=$(printf %s "$body" | python3 -c 'import json,sys,urllib.parse as u; print(u.urlsplit(json.load(sys.stdin)["endpoint"]).path)')
  if [ "$res" = "200" ]; then echo "Outil $id : OK ($path, jeton dans l'en-tête)"; ok=$((ok+1)); else echo "Outil $id : ÉCHEC (code $res), laissé tel quel"; ko=$((ko+1)); fi
done

fid=$(curl -s -H "Authorization: Bearer $K" -H 'Accept: application/json' "$API/automate/flows" | python3 -c '
import json, sys
d = json.load(sys.stdin); m = [f["id"] for f in d.get("data", []) if f.get("name") == "Relais fin d’échange → site (PermanenceAI)".replace("’", "\x27")]
print(m[0] if len(m) == 1 else "")
')
if [ -z "$fid" ]; then echo "Relais : introuvable (ou en double), non modifié."; else
  rel=$(python3 -c '
import json, os
d = json.load(open("scripts/relais-webhooks.json"))
h = d["flow"]["trigger"]["nextAction"]["nextAction"]["onSuccessAction"]["settings"]["input"]["headers"]
h["x-webhook-token"] = os.environ["T"]
print(json.dumps({"flow": d["flow"], "sample": d["sample"], "confirm_side_effects": True}))
' | curl -s -X PUT -H "Authorization: Bearer $K" -H 'Content-Type: application/json' -H 'Accept: application/json' --data-binary @- "$API/automate/flows/$fid" | python3 -c '
import json, sys
try: d = json.load(sys.stdin); print(d.get("status", "?"), (d.get("test") or {}).get("run_status", "?"))
except Exception: print("réponse illisible")
')
  echo "Relais : $rel (attendu : active SUCCEEDED)"
fi
unset T K
echo "Terminé : $ok outil(s) mis à jour, $ko non modifié(s). Prévenez Claude, qui vérifiera dans les journaux."
