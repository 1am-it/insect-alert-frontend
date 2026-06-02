/**
 * ⚠️ TEMPORARY COPY for Sprint 2.
 *
 * Copied from backend src/data/regulations.js. Keep in sync manually until
 * 1AM-250 consolidates pattern data sources.
 *
 * Source of truth remains backend: 1am-it/insect-alert/src/data/regulations.js
 * Replace with /api/regulations endpoint or shared package in v0.5.
 *
 * See Linear ticket 1AM-250 for consolidation plan.
 *
 * NOTE: Only `approvedInsects` is copied here — that is all the ListCard
 * (1AM-245) needs for the `approved_insects` topic. The backend file also
 * contains `regulationItems` (contextual concepts), which route to the
 * decoder-card, not the list-card; copy those when a component needs them.
 *
 * Last manual sync: 2026-05-31.
 *
 * ---
 *
 * EU regulation reference dataset for InsectAlert.
 *
 * approvedInsects: insect species authorised in the EU food chain, either
 * under the Novel Food Regulation (2015/2283) or, for the historic case of
 * carmine/E120, under the Food Additives Regulation (1333/2008).
 *
 * All facts here must be verifiable on EUR-Lex or EFSA. Do not let an LLM
 * mutate the values. Updates are human-only.
 *
 * Tickets: 1AM-228 (umbrella) · 1AM-229 (ontology) · 1AM-230 (source file)
 */

export type RegulationStatus = "approved" | "pending";
export type RegulationConfidence = "high" | "medium" | "low";

export interface ApprovedInsect {
  id: string;
  nlName: string;
  latinName: string;
  approvalDate: string | null;
  approvalNote: string | null;
  regulationCode: string;
  regulationUrl: string;
  allowedCategories: string[];
  efsaAssessmentStarted: string | null;
  efsaAssessmentPositive: string | null;
  status: RegulationStatus;
  source: string;
  confidence: RegulationConfidence;
}

export const approvedInsects: ApprovedInsect[] = [
  {
    id: "gele-meelworm",
    nlName: "Gele meelworm",
    latinName: "Tenebrio molitor",
    approvalDate: "2021-06-01",
    approvalNote:
      "Eerste insect goedgekeurd als novel food in de EU. UV-treated powder van Tenebrio molitor is later separaat uitgebreid via Uitvoeringsverordening (EU) 2025/89 voor brood, pasta, koekjes, kaasproducten en fruitcompote.",
    regulationCode: "EU 2021/882",
    regulationUrl: "https://eur-lex.europa.eu/eli/reg_impl/2021/882/oj",
    allowedCategories: ["Pasta", "Koekjes", "Brood", "Vleesvervangers"],
    efsaAssessmentStarted: "2018",
    efsaAssessmentPositive: "2021-01",
    status: "approved",
    source: "Uitvoeringsverordening (EU) 2021/882",
    confidence: "high",
  },
  {
    id: "treksprinkhaan",
    nlName: "Treksprinkhaan",
    latinName: "Locusta migratoria",
    approvalDate: "2021-11-12",
    approvalNote: null,
    regulationCode: "EU 2021/1975",
    regulationUrl: "https://eur-lex.europa.eu/eli/reg_impl/2021/1975/oj",
    allowedCategories: ["Meergranenbrood", "Peulvruchtenproducten"],
    efsaAssessmentStarted: "2019",
    efsaAssessmentPositive: "2021-05",
    status: "approved",
    source: "Uitvoeringsverordening (EU) 2021/1975",
    confidence: "high",
  },
  {
    id: "huiskrekel",
    nlName: "Huiskrekel",
    latinName: "Acheta domesticus",
    approvalDate: "2022-02-10",
    approvalNote:
      "Partially defatted powder van Acheta domesticus is later separaat uitgebreid via Uitvoeringsverordening (EU) 2023/5.",
    regulationCode: "EU 2022/188",
    regulationUrl: "https://eur-lex.europa.eu/eli/reg_impl/2022/188/oj",
    allowedCategories: [
      "Meergranenbrood",
      "Koekjes",
      "Pasta",
      "Granenrepen",
      "Eiwitproducten",
    ],
    efsaAssessmentStarted: "2018",
    efsaAssessmentPositive: "2021-07",
    status: "approved",
    source: "Uitvoeringsverordening (EU) 2022/188",
    confidence: "high",
  },
  {
    id: "kleine-meelworm",
    nlName: "Kleine meelworm",
    latinName: "Alphitobius diaperinus",
    approvalDate: "2023-01-05",
    approvalNote:
      "Internationaal ook bekend als buffaloworm. Toelating betreft larvae in bevroren, paste, gedroogde en poedervorm.",
    regulationCode: "EU 2023/58",
    regulationUrl: "https://eur-lex.europa.eu/eli/reg_impl/2023/58/oj",
    allowedCategories: ["Brood", "Pasta", "Koekjes"],
    efsaAssessmentStarted: "2020",
    efsaAssessmentPositive: "2022-07",
    status: "approved",
    source: "Uitvoeringsverordening (EU) 2023/58",
    confidence: "high",
  },
  {
    id: "schildluis",
    nlName: "Schildluis (karmijn / E120)",
    latinName: "Dactylopius coccus",
    approvalDate: null,
    approvalNote:
      "Pre-1997: historisch toegestaan als levensmiddelenkleurstof E120 (karmijn). Valt onder de Additievenverordening (EG) 1333/2008, niet onder de Novel Food Verordening.",
    regulationCode: "EG 1333/2008",
    regulationUrl: "https://eur-lex.europa.eu/eli/reg/2008/1333/oj",
    allowedCategories: [
      "Rode/roze zuiveldranken",
      "Rood snoep",
      "Roze koeken",
      "Banket",
      "Aperitieven",
    ],
    efsaAssessmentStarted: null,
    efsaAssessmentPositive: null,
    status: "approved",
    source:
      "Verordening (EG) Nr. 1333/2008 — levensmiddelenadditieven; E120 als toegestane kleurstof opgenomen",
    confidence: "high",
  },
];
