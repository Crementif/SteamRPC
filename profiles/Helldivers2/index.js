export const clientId = "1218429931877437461";
export const appID = 553850;
export const title = "HELLDIVERS™ 2";

const resources = {
    "cover": "https://raw.githubusercontent.com/angelolz/SteamRPC/helldivers2/profiles/Helldivers2/resources/game_icon.jpg",
    "icons": {
        "automatons": "https://raw.githubusercontent.com/angelolz/SteamRPC/helldivers2/profiles/Helldivers2/resources/automaton_icon.png",
        "terminids": "https://raw.githubusercontent.com/angelolz/SteamRPC/helldivers2/profiles/Helldivers2/resources/terminid_icon.png"
    }
};

export function translateSteamPresence(steamRichPresence) {
    let discordRichPresence = {};

    discordRichPresence.largeImageKey = resources.cover;
    discordRichPresence.details = steamRichPresence;

    switch(steamRichPresence) {
        case "Tutorial Mission":
            discordRichPresence.details = "In a mission";
            discordRichPresence.state = "Tutorial";
            discordRichPresence.startTimestamp = Math.floor(Date.now() / 1000);;
            break;
        case "Fighting Terminids":
            discordRichPresence.details = "In a mission";
            discordRichPresence.state = "Fighting Terminids";
            discordRichPresence.smallImageKey = resources.icons.terminids;
            discordRichPresence.startTimestamp = Math.floor(Date.now() / 1000);;
            break;
        case "Fighting Automatons":
            discordRichPresence.details = "In a mission";
            discordRichPresence.state = "Fighting Automatons";
            discordRichPresence.smallImageKey = resources.icons.automatons;
            discordRichPresence.startTimestamp = Math.floor(Date.now() / 1000);;
            break;

    }

    return discordRichPresence;
}
