#!/bin/bash
# Pose un jeton des webhooks dans les outils Autocalls (en-tête x-webhook-token, jeton retiré de l'adresse) et dans le
# relais « Relais fin d'échange → site (PermanenceAI) ». Le jeton et la clé Autocalls sont lus dans Secret Manager et
# ne sont jamais affichés. Rien n'est modifié si le site n'accepte pas encore le jeton (route /api/webhooks/ping).
# Autocalls limite le nombre de requêtes (réponse 429) : pause entre les appels et nouvelles tentatives espacées.
#   bash scripts/jeton-webhooks.sh                  # jeton WEBHOOK_TOKEN_NEXT (passage à l'en-tête)
#   bash scripts/jeton-webhooks.sh WEBHOOK_TOKEN    # même chose avec un autre secret, par exemple après la rotation
set -uo pipefail
cd "$(dirname "$0")/.."
SECRET="${1:-WEBHOOK_TOKEN_NEXT}"
P=snarecore-cacrs
API=https://app.autocalls.ai/api/user
TOOLS="${TOOLS:-6241 6176 6177 6178 6182 6240 6242 6246 6247 6248 6243}"

T="$(gcloud secrets versions access latest --secret "$SECRET" --project "$P" 2>/dev/null)" || { echo "Secret $SECRET illisible : rien n'a été modifié."; exit 1; }
K="$(gcloud secrets versions access latest --secret AUTOCALLS_API_KEY --project "$P" 2>/dev/null)" || { echo "Clé Autocalls illisible : rien n'a été modifié."; exit 1; }
export T

# api MÉTHODE URL [CORPS] : affiche le corps de la réponse puis, sur la dernière ligne, le code HTTP.
# Sur 429, attend 15 s, 30 s, 45 s… (5 tentatives). Le corps envoyé passe par l'entrée standard, jamais par la ligne de commande.
api() {
  local i out st
  for i in 1 2 3 4 5; do
    sleep 2
    if [ $# -ge 3 ]; then
      out=$(printf %s "$3" | curl -s -w '\n%{http_code}' -X "$1" -H "Authorization: Bearer $K" -H 'Accept: application/json' -H 'Content-Type: application/json' --data-binary @- "$2")
    else
      out=$(curl -s -w '\n%{http_code}' -X "$1" -H "Authorization: Bearer $K" -H 'Accept: application/json' "$2")
    fi
    st=${out##*$'\n'}
    [ "$st" != "429" ] && { printf '%s' "$out"; return 0; }
    sleep $((i * 15))
  done
  printf '%s' "$out"
}
status() { printf %s "${1##*$'\n'}"; }
content() { printf %s "${1%$'\n'*}"; }

code=$(curl -s -o /dev/null -w '%{http_code}' -H "x-webhook-token: $T" https://www.permanenceia.com/api/webhooks/ping)
if [ "$code" != "200" ]; then echo "Le site n'accepte pas encore ce jeton (code $code) : rien n'a été modifié."; exit 1; fi
echo "Site : jeton accepté."

ok=0; ko=0
for id in $TOOLS; do
  r=$(api GET "$API/tools/$id")
  body=$(content "$r" | python3 -c '
import json, os, sys, urllib.parse as u
d = json.load(sys.stdin); d = d.get("data", d)
p = u.urlsplit(d["endpoint"])
if p.netloc != "www.permanenceia.com": sys.exit("hôte inattendu")
q = [(k, v) for k, v in u.parse_qsl(p.query, keep_blank_values=True) if k != "token"]
# {{assistant_id}} (?aid=) gardé tel quel : Autocalls le remplace par l’identifiant de l’agent ; encodé, il ne le serait plus.
ep = u.urlunsplit((p.scheme, p.netloc, p.path, u.urlencode(q, safe="{}"), p.fragment))
print(json.dumps({"endpoint": ep, "headers": [{"name": "Content-Type", "value": "application/json"}, {"name": "x-webhook-token", "value": os.environ["T"]}]}))
' 2>/dev/null) || { echo "Outil $id : lecture impossible (code $(status "$r")), laissé tel quel."; ko=$((ko+1)); continue; }
  res=$(status "$(api PUT "$API/tools/$id" "$body")")
  path=$(printf %s "$body" | python3 -c 'import json,sys,urllib.parse as u; print(u.urlsplit(json.load(sys.stdin)["endpoint"]).path)')
  if [ "$res" = "200" ]; then echo "Outil $id : OK ($path, jeton dans l'en-tête)"; ok=$((ok+1)); else echo "Outil $id : ÉCHEC (code $res), laissé tel quel"; ko=$((ko+1)); fi
done

r=$(api GET "$API/automate/flows")
fid=$(content "$r" | python3 -c '
import json, sys
want = "Relais fin d" + chr(39) + "échange → site (PermanenceAI)"
try: d = json.load(sys.stdin)
except Exception: print(""); sys.exit()
rows = d.get("data", d) if isinstance(d, dict) else d
rows = rows if isinstance(rows, list) else []
m = [f.get("id") for f in rows if isinstance(f, dict) and (f.get("name") or f.get("displayName")) == want]
print(m[0] if len(m) == 1 else "")
')
if [ -z "$fid" ]; then echo "Relais : introuvable (liste des automatisations : code $(status "$r")), non modifié."; else
  payload=$(python3 -c '
import json, os
d = json.load(open("scripts/relais-webhooks.json"))
h = d["flow"]["trigger"]["nextAction"]["nextAction"]["onSuccessAction"]["settings"]["input"]["headers"]
h["x-webhook-token"] = os.environ["T"]
print(json.dumps({"flow": d["flow"], "sample": d["sample"], "confirm_side_effects": True}))
')
  r=$(api PUT "$API/automate/flows/$fid" "$payload")
  rel=$(content "$r" | python3 -c '
import json, sys
try: d = json.load(sys.stdin); print(d.get("status", "?"), (d.get("test") or {}).get("run_status", "?"))
except Exception: print("réponse illisible")
')
  echo "Relais : $rel, code $(status "$r") (attendu : active SUCCEEDED, code 200)"
fi
unset T K payload body
echo "Terminé : $ok outil(s) mis à jour, $ko non modifié(s). Prévenez Claude, qui vérifiera dans les journaux."
