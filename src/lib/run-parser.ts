import fs from 'fs';
import path from 'path';

export interface RunEntry {
  id: string;
  date: string;
  club: string;
  city: string;
  country: string;
  note: string;
  content: string;
}

export function parseRunFile(filePath: string): RunEntry[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const entries: RunEntry[] = [];

  const entryRegex = /^###\s+(\d{4}-\d{2}-\d{2})\s*\|\s*([^(]+)\(([^,]+),\s*([^)]+)\)\s*$/gm;
  const matches = [...content.matchAll(entryRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const [fullMatch, date, club, city, country] = match;
    const startIndex = match.index! + fullMatch.length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : content.length;
    const entryContent = content.slice(startIndex, endIndex).trim();

    const firstParagraph = entryContent.split('\n\n')[0] || '';
    const note = firstParagraph.replace(/<[^>]*>/g, '').substring(0, 200);

    entries.push({
      id: `${date}-${club.trim().toLowerCase().replace(/\s+/g, '-')}`,
      date,
      club: club.trim(),
      city: city.trim(),
      country: country.trim(),
      note,
      content: entryContent,
    });
  }

  return entries.reverse();
}

export function getRunStats(entries: RunEntry[]) {
  const uniqueClubs = new Set(entries.map((e) => e.club)).size;
  const uniqueCities = new Set(entries.map((e) => e.city)).size;
  const uniqueCountries = new Set(entries.map((e) => e.country)).size;

  return {
    clubs: uniqueClubs,
    cities: uniqueCities,
    countries: uniqueCountries,
    totalEntries: entries.length,
  };
}
