// Import configuration
export const appID = 1938090;
export const title = "Call of Duty: Modern Warfare II | Warzone 2.0";

export function translateSteamPresence(steamRichPresence) {
    let discordRichPresence = {};
    discordRichPresence.details = "playing Modern Warfare II | Warzone 2.0";
    if (steamRichPresence.toLowerCase().includes("main menu")) {
        discordRichPresence.state = "in Main Menu";
        discordRichPresence.largeImageKey = "rl-default";
        discordRichPresence.largeImageText = "Main Menu";
    }
    return discordRichPresence;
}