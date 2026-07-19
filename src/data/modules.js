import { LOCATIONS } from "./locations";

export const MODULES = [
  {
    id: "algemeen",
    name: "Amsterdam - algemeen",
    locationIds: [
      "dam", "leidseplein", "rembrandtplein", "museumplein", "waterlooplein", "nieuwmarkt",
      "spui", "muntplein", "thorbeckeplein", "frederiksplein", "noordermarkt", "westermarkt",
      "koningsplein", "mercatorplein",
      "kalverstraat", "nieuwendijk", "damrak", "rokin", "leidsestraat", "utrechtsestraat",
      "pchooftstraat", "spuistraat", "warmoesstraat", "zeedijk", "haarlemmerstraat",
      "haarlemmerdijk", "prinsengracht", "herengracht", "keizersgracht", "singel",
      "nzvoorburgwal", "ozvoorburgwal", "ozachterburgwal", "brouwersgracht", "bloemgracht",
      "egelantiersgracht", "elandsgracht", "rozengracht", "westerstraat", "jodenbreestraat",
      "weesperstraat", "sarphatistraat", "plantagemiddenlaan", "overtoom", "vanbaerlestraat",
      "ferdinandbolstraat", "albertcuypstraat", "ceintuurbaan", "vijzelstraat",
      "reguliersbreestraat",
    ],
  },
  {
    id: "centrum",
    name: "Amsterdam Centrum",
    locationIds: [
      "dam", "leidseplein", "rembrandtplein", "nieuwmarkt", "spui", "muntplein",
      "westermarkt", "waterlooplein", "kalverstraat", "nieuwendijk", "damrak", "rokin",
      "leidsestraat", "zeedijk", "prinsengracht", "herengracht", "keizersgracht", "singel",
      "brouwersgracht", "noordermarkt",
    ],
  },
  {
    id: "noord",
    name: "Amsterdam Noord",
    locationIds: [
      "vanderpekstraat", "ndsmplein", "buiksloterweg", "mosplein", "nieuwendammerdijk",
      "meeuwenlaan", "distelweg", "klaprozenweg", "waddenweg", "adelaarsweg", "papaverweg",
      "loenermarkt", "motorkade", "tolhuisweg", "ranonkelkade", "statenjachtstraat",
      "kadoelenweg", "schellingwouderdijk", "ijdoornlaan", "zamenhofstraat",
    ],
  },
  {
    id: "oost",
    name: "Amsterdam Oost",
    locationIds: [
      "javastraat", "dapperstraat", "linnaeusstraat", "czaarpeterstraat", "wibautstraat",
      "beukenplein", "kruislaan", "middenweg", "insulindeweg", "molukkenstraat", "ringdijk",
      "eerstevanswindenstraat", "pretoriusstraat", "ijburglaan", "zeeburgerdijk", "polderweg",
      "sumatraplantsoen", "alexanderplein", "hogeweg", "javaplein",
    ],
  },
  {
    id: "zuid",
    name: "Amsterdam Zuid",
    locationIds: [
      "museumplein", "pchooftstraat", "vanbaerlestraat", "ferdinandbolstraat",
      "albertcuypstraat", "ceintuurbaan", "apollolaan", "beethovenstraat",
      "cornelisschuytstraat", "willemsparkweg", "roelofhartplein", "amstelveenseweg",
      "minervalaan", "churchilllaan", "rijnstraat", "stadionplein", "europaplein",
      "gustavmahlerlaan", "scheldestraat", "ruysdaelkade",
    ],
  },
  {
    id: "west",
    name: "Amsterdam West",
    locationIds: [
      "mercatorplein", "overtoom", "kinkerstraat", "janpieterheijestraat", "bilderdijkstraat",
      "tenkatestraat", "janevertsenstraat", "postjesweg", "hoofdweg", "declercqstraat",
      "admiraalderuijterweg", "boslommerweg", "baarsjesweg", "surinameplein", "vanhallstraat",
      "spaarndammerstraat", "frederikhendrikstraat", "nassaukade", "dacostastraat",
      "willemdezwijgerlaan",
    ],
  },
  {
    id: "zuidoost",
    name: "Amsterdam Zuidoost",
    locationIds: [
      "antondekomplein", "bijlmerplein", "arenaboulevard", "karspeldreef", "bijlmerdreef",
      "gooiseweg", "ganzenhoef", "kraaiennest", "holendrechtstraat", "daalwijkdreef",
      "flierbosdreef", "foppingadreef", "hoogoorddreef", "kikkenstein", "guldenkruis",
      "grubbehoeve", "kelbergen", "hoekenrode", "bullewijkpad", "loosdrechtdreef",
    ],
  },
  {
    id: "nieuw-west",
    name: "Amsterdam Nieuw-West",
    locationIds: [
      "osdorpplein", "johanhuizingalaan", "slotermeerlaan", "plesmanlaan", "sloterweg",
      "meerenvaart", "anderlechtlaan", "cornelislelylaan", "badenpowellweg", "delflandplein",
      "alettajacobslaan", "pietercalandlaan", "osdorperweg", "sierplein",
      "burgemeesterdevlugtlaan", "jantooropstraat", "dijkgraafplein", "meervaart",
      "tussenmeer", "ookmeerweg",
    ],
  },
];

export function getModuleLocations(moduleId) {
  const mod = MODULES.find((m) => m.id === moduleId);
  if (!mod) return [];
  const byId = new Map(LOCATIONS.map((l) => [l.id, l]));
  return mod.locationIds.map((id) => byId.get(id)).filter(Boolean);
}
