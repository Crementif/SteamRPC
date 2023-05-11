import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import configuration
export const appID = 1172470;
export const title = "Apex Legends";

const playingRegex = /^(?:(.*) - (.*)(\(.*\))$|(.*) - (.*))$/;

export function translateSteamPresence(steamRichPresence) {
    let dir = dirname(fileURLToPath(import.meta.url));
    let discordRichPresence = {};
    let resources = null;
    discordRichPresence.details = "Playing Apex Legends";
    discordRichPresence.state = steamRichPresence;

    if(!fs.existsSync(dir + '/resources.json')) {
        return discordRichPresence;
    }

    resources = JSON.parse(fs.readFileSync(dir + '/resources.json'));
    discordRichPresence.largeImageKey = resources.cover;

    if(steamRichPresence.toLowerCase().includes("training")) {
        let map = resources.maps.find(e => e.name === "Training");
        discordRichPresence.largeImageKey = map.imageURL;
    } else if(steamRichPresence.toLowerCase().includes("firing range")) {
        let map = resources.maps.find(e => e.name === "Firing Range");
        discordRichPresence.largeImageKey = map.imageURL;
    } else {
        let match = steamRichPresence.match(playingRegex);
        if(match && match.length > 2) {
            let state = `${match[2]} on ${match[1]}`;
            if(match.length > 3) state + ` ${match[3]}`;
            discordRichPresence.state = state;

            let map = resources.maps.find(e => e.name === match[1]);
            if(map !== undefined) {
                discordRichPresence.largeImageKey = map.imageURL;
                discordRichPresence.largeImageText = match[1];
            }
        }
    }

    return discordRichPresence;
}
