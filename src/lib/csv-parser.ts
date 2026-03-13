import fs from 'fs';
import path from 'path';

export interface ClubData {
  name: string;
  city: string;
  country: string;
  rank2022: string;
  rank2023: string;
  rank2024: string;
  rank2025: string;
  been: boolean;
}

export function parseClubsCSV(filePath: string): ClubData[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  const clubs: ClubData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(/^"?([^"]+?)"?,(".*?"|[^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*),([^,]*)$/);

    if (matches) {
      clubs.push({
        name: matches[1].trim(),
        city: matches[2].replace(/^"(.*)"$/, '$1').trim(),
        country: matches[3].trim(),
        rank2022: matches[4].trim(),
        rank2023: matches[5].trim(),
        rank2024: matches[6].trim(),
        rank2025: matches[7].trim(),
        been: matches[8].trim().toUpperCase() === 'Y'
      });
    }
  }

  return clubs;
}

export function getClubStats(clubs: ClubData[]) {
  const beenTo = clubs.filter(c => c.been);
  // Only include clubs with active 2025 rankings in "still to go"
  const stillToGo = clubs.filter(c => !c.been && c.rank2025 !== '–' && c.rank2025 !== '');

  return {
    totalClubs: clubs.length,
    beenTo: beenTo.length,
    stillToGo: stillToGo.length,
    goal: 100,
    beenToClubs: beenTo,
    stillToGoClubs: stillToGo
  };
}
