import axios from "axios";

import { getDefaults, persistDefaults } from "./DefaultValues";
import { Lobbies } from "Constants";

export default function HostJotto() {
  const gameType = "Jotto";
  const defaults = getDefaults(gameType);

  let defaultLobby = localStorage.getItem("lobby");
  if (
    defaultLobby === "All" ||
    defaultLobby === "Main" ||
    defaultLobby === "Competitive"
  ) {
    defaultLobby = "Games";
  }
  const initialFormFields = [
    {
      label: "Word Length",
      ref: "wordLength",
      type: "number",
      value: defaults.wordLength,
      min: 4,
      max: 5,
    },
    {
      label: "Duplicate Letters",
      ref: "duplicateLetters",
      type: "boolean",
      value: defaults.duplicateLetters,
    },
    {
      label: "Competitive Mode",
      ref: "competitiveMode",
      type: "boolean",
      value: defaults.competitiveMode,
    },
    {
      label: "Win With Anagrams",
      ref: "winOnAnagrams",
      type: "boolean",
      value: defaults.winOnAnagrams,
    },
    {
      label: "No. Anagrams Required",
      ref: "numAnagramsRequired",
      type: "number",
      value: defaults.numAnagramsRequired,
      min: 1,
      max: 4,
      showIf: "winOnAnagrams",
    },
    {
      label: "Lobby",
      ref: "lobby",
      type: "select",
      value: defaultLobby,
      options: Lobbies.map((lobby) => ({ label: lobby, value: lobby })),
    },
    {
      label: "Lobby Name",
      ref: "lobbyName",
      type: "text",
      value: defaults.lobbyName,
    },
    {
      label: "Private",
      ref: "private",
      type: "boolean",
      value: defaults.private,
    },
    {
      label: "Anonymous Game",
      ref: "anonymousGame",
      type: "boolean",
      value: defaults.anonymousGame,
    },
    {
      label: "Deck ID",
      ref: "anonymousDeckId",
      type: "text",
      value: defaults.anonymousDeckId,
      showIf: "anonymousGame",
    },
    {
      label: "Allow Guests",
      ref: "guests",
      type: "boolean",
      value: defaults.guests,
    },
    {
      label: "Spectating",
      ref: "spectating",
      type: "boolean",
      value: defaults.spectating,
    },
    {
      label: "Scheduled",
      ref: "scheduled",
      type: "boolean",
    },
    {
      label: "Ready Check",
      ref: "readyCheck",
      type: "boolean",
      value: defaults.readyCheck,
    },
    {
      label: "Start Date",
      ref: "startDate",
      type: "datetime-local",
      showIf: "scheduled",
      value: Date.now() + 6 * 60 * 1000,
      min: Date.now() + 6 * 60 * 1000,
      max: Date.now() + 4 * 7 * 24 * 60 * 60 * 1000,
    },
    {
      label: "Configure Duration",
      ref: "configureDuration",
      type: "boolean",
      value: defaults.configureDuration,
    },
    {
      label: "Select Word Length (minutes)",
      ref: "selectWordLength",
      type: "number",
      showIf: "configureDuration",
      value: defaults.selectWordLength,
      min: 0.5,
      max: 5,
      step: 0.5,
    },
    {
      label: "Guess Word Length (minutes)",
      ref: "guessWordLength",
      type: "number",
      showIf: "configureDuration",
      value: defaults.guessWordLength,
      min: 0.5,
      max: 5,
      step: 0.5,
    },
  ];

  function onHostGame(setupId, getFormFieldValue) {
    var scheduled = getFormFieldValue("scheduled");

    if (setupId) {
      const hostPromise = axios
        .post("/api/game/host", {
          gameType: gameType,
          setup: setupId,
          lobby: getFormFieldValue("lobby"),
          lobbyName: getFormFieldValue("lobbyName"),
          private: getFormFieldValue("private"),
          guests: getFormFieldValue("guests"),
          spectating: getFormFieldValue("spectating"),
          scheduled:
            scheduled && new Date(getFormFieldValue("startDate")).getTime(),
          readyCheck: getFormFieldValue("readyCheck"),
          stateLengths: {
            "Select Word": getFormFieldValue("selectWordLength"),
            "Guess Word": getFormFieldValue("guessWordLength"),
          },
          wordLength: getFormFieldValue("wordLength"),
          duplicateLetters: getFormFieldValue("duplicateLetters"),
          competitiveMode: getFormFieldValue("competitiveMode"),
          winOnAnagrams: getFormFieldValue("winOnAnagrams"),
          numAnagramsRequired: getFormFieldValue("numAnagramsRequired"),
          anonymousGame: getFormFieldValue("anonymousGame"),
          anonymousDeckId: getFormFieldValue("anonymousDeckId"),
        });

      Object.keys(defaults).forEach(function (key) {
        const submittedValue = getFormFieldValue(key);
        if (submittedValue) {
          defaults[key] = submittedValue;
        }
      });
      persistDefaults(gameType, defaults);
      return hostPromise;
    }
    else {
      return null;
    }
  }

  return [initialFormFields, onHostGame];
}
