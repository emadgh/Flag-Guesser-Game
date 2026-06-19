const fs = require('fs');

async function run() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/mledoze/countries/master/countries.json');
    const data = await res.json();
    
    if (!Array.isArray(data)) {
        console.error("Not an array");
        return;
    }
    
    const knownEasy = ['us', 'gb', 'fr', 'de', 'it', 'es', 'cn', 'jp', 'in', 'br', 'ru', 'ca', 'au', 'mx', 'za', 'kr', 'ar', 'sa', 'eg', 'tr', 'se', 'no', 'fi', 'dk', 'ch', 'nl', 'be', 'at', 'gr'];
    const knownHard = ['ao', 'so', 'bn', 'km', 'xk', 'tv', 'nr', 'bi', 'dj', 'gq', 'er', 'gw', 'ls', 'mw', 'sc', 'st', 'sz', 'tg', 'ki', 'mh', 'fm', 'pw', 'ws', 'to', 'vu', 'ag', 'dm', 'kn', 'lc', 'vc', 'ms', 'nu', 'pn', 'tk', 'wf', 'yt', 'pm', 'sh', 'tc', 'vg', 'vi', 'cx', 'cc', 'fk', 'fo', 'gi', 'gl', 'im', 'je'];

    let countries = data.map(c => ({
      name: c.name.common,
      code: c.cca2 ? c.cca2.toLowerCase() : '',
      population: 0,
      area: c.area || 0
    })).filter(c => c.code);
    
    const mapped = countries.map(c => {
        let diff = 2; // medium by default
        if (knownEasy.includes(c.code)) {
            diff = 1;
        } else if (knownHard.includes(c.code)) {
            diff = 3;
        } else if (c.area > 500000) {
            diff = 1;
        } else if (c.area < 10000) {
            diff = 3;
        }
        
        return {
            name: c.name,
            code: c.code,
            difficulty: diff
        };
    }).sort((a,b) => a.name.localeCompare(b.name));
    
    const tsCode = `export interface Country {
  name: string;
  code: string;
  difficulty: number; // 1: Easy, 2: Medium, 3: Hard
}

export const COUNTRIES: Country[] = ${JSON.stringify(mapped, null, 2)};

export const UNIQUE_COUNTRIES = Array.from(new Map(COUNTRIES.map(c => [c.code, c])).values());

export const getFlagUrl = (code: string) => \`https://flagcdn.com/w320/\${code}.png\`;
`;

    fs.writeFileSync('src/data/countries.ts', tsCode);
    console.log("Done. Countries count:", mapped.length);
  } catch(e) {
    console.error(e);
  }
}

run();
