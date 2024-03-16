import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const clientId = "1218429931877437461";
export const appID = 553850;
export const title = "HELLDIVERS™ 2";
const startTimestamp = Math.floor(Date.now() / 1000);
const resources = {
    "cover": "https://i.postimg.cc/prsvT0Zj/community-Icon-ql5iyxjfuvic1.jpg",
    "icons": {
        "automatons": "https://i.postimg.cc/d3wdv0H1/Automatonlogo2.webp",
        "terminids": "https://i.postimg.cc/4dztrc1q/Terminidlogo2.webp"
    }
};
export function translateSteamPresence(steamRichPresence) {
    let discordRichPresence = {};

    discordRichPresence.largeImageKey = resources.cover;
    // discordRichPresence.details = "Playing HELLDIVERS™ 2";
    discordRichPresence.details = steamRichPresence;

    switch(steamRichPresence) {
        case "Tutorial Mission":
            discordRichPresence.details = "Playing Tutorial Mission";
            break;
        case "Fighting Terminids":
            discordRichPresence.details = "In a mission";
            discordRichPresence.state = "Fighting Terminids";
            discordRichPresence.smallImageKey = resources.icons.terminids;
            discordRichPresence.startTimestamp = startTimestamp;
            break;
        case "Fighting Automatons":
            discordRichPresence.details = "In a mission";
            discordRichPresence.state = "Fighting Automatons";
            discordRichPresence.smallImageKey = resources.icons.automatons;
            discordRichPresence.startTimestamp = startTimestamp;
            break;

    }

    return discordRichPresence;
}
