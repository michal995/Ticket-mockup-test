# Ticket Mockup

Minimalny szkielet gry w Phaser 3 uruchamiany przez Vite + TypeScript.

## Wymagania

- Node.js 18+
- npm

## Instalacja i uruchomienie

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run dev` startuje lokalny serwer Vite na porcie 5173. `npm run build` kompiluje kod TypeScript i buduje produkcyjny bundle, a `npm run preview` uruchamia lokalny serwer do podglądu zbudowanej aplikacji.

## Rozdzielczość i skalowanie

Gra działa na stałym wirtualnym stage'u o rozdzielczości 1920×1080. Konfiguracja `Phaser.Scale.FIT` zapewnia dopasowanie canvasa do okna przeglądarki bez przycinania — cała scena jest widoczna, a gra skaluje się proporcjonalnie tak, by zmieścić się w dostępnej przestrzeni.

Domyślny preset rozmiaru UI jest definiowany w pliku [`src/ui/theme.ts`](src/ui/theme.ts) (wartość `M`). Można go zmienić, modyfikując pole `scale`, `minFont` oraz `minButtonHeight` dla wybranego presetu, albo ustawić inny preset jako domyślny podczas inicjalizacji gry.

## API placeholder

Plik [`src/services/api.ts`](src/services/api.ts) zawiera tymczasowe, mockowane funkcje komunikacji z backendem (`upsertUser`, `startSession`, `finishRound`, `finishSession`, `getHighScores`). Aktualnie funkcje logują przekazane parametry i zwracają `Promise.resolve({ ok: true })`. W kolejnych krokach zostaną podmienione na integrację z Google Sheets przez Google Apps Script.
