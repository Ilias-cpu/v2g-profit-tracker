from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import json
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("v2g_model_v2.pkl", "rb") as f:
    model = pickle.load(f)

with open("v2g_encoders_v2.json", "r") as f:
    encoders = json.load(f)

class SimulationInput(BaseModel):
    region: str
    capacite_kwh: float
    sante_pct: float
    tarif_achat: float
    tarif_revente: float
    km_quotidiens: float
    heures_v2g: float
    recharge_domicile: int
    type_logement: str
    v2g_compatible: int

@app.get("/")
def root():
    return {"status": "V2G API v2 operationnelle", "modele": "XGBoost v2 - EV Database 602 vehicules"}

@app.get("/regions")
def get_regions():
    return {"regions": encoders["regions"]}

@app.post("/predict")
def predict(data: SimulationInput):
    region_enc   = encoders["regions"].index(data.region)
    logement_enc = encoders["logements"].index(data.type_logement)

    X = np.array([[
        region_enc,
        data.capacite_kwh,
        data.sante_pct,
        data.tarif_achat,
        data.tarif_revente,
        data.km_quotidiens,
        data.heures_v2g,
        data.recharge_domicile,
        logement_enc,
        data.v2g_compatible
    ]])

    pred  = model.predict(X)[0]
    proba = model.predict_proba(X)[0]
    label = encoders["labels"][pred]

    # Calcul métriques financières
    energie_v2g_an  = data.capacite_kwh * (data.sante_pct/100) * 0.8 * data.heures_v2g * 365 * 0.7
    revenu_brut     = energie_v2g_an * (data.tarif_revente - data.tarif_achat * 0.3)
    degradation     = 0.020 * (1 + (data.heures_v2g * 365 / (data.capacite_kwh / 7)) / 200)
    cout_degradation = degradation * 15000
    revenu_net      = revenu_brut - cout_degradation
    if data.v2g_compatible == 0:
        revenu_net *= 0.7
    roi_mois = round(2500 / (revenu_net / 12), 1) if revenu_net > 0 else 999

    # Verdict texte
    verdicts = {
        "rentable":     "Excellent potentiel V2G",
        "moyen":        "Potentiel V2G modéré",
        "non_rentable": "Potentiel V2G faible"
    }

    return {
        "label":            label,
        "verdict":          verdicts[label],
        "confiance":        round(float(max(proba)) * 100, 1),
        "revenu_net_an":    round(revenu_net, 2),
        "roi_mois":         roi_mois,
        "degradation_pct":  round(degradation * 100, 3),
        "energie_v2g_kwh":  round(energie_v2g_an, 0),
        "v2g_natif":        bool(data.v2g_compatible)
    }
