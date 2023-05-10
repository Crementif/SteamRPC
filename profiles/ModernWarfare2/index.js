import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import configuration
export const appID = 1938090;
export const title = "Call of Duty: Modern Warfare II | Warzone 2.0";

const playingRegex = /^Playing (.*) in (.*)$/;

export function translateSteamPresence(steamRichPresence) {
        let dir = dirname(fileURLToPath(import.meta.url));
        let discordRichPresence = {};
        let resources = null;
        discordRichPresence.details = "playing Modern Warfare II | Warzone 2.0";
        discordRichPresence.state = steamRichPresence;

        if(!fs.existsSync(dir + '/resources.json')) {
            discordRichPresence.state = "no";
            return discordRichPresence;
        }

        resources = JSON.parse(fs.readFileSync(dir + '/resources.json'));
        discordRichPresence.largeImageKey = resources.cover;

        let match = steamRichPresence.match(playingRegex);
        if(match) {
            let mode = resources.modes.find(e => e.name === match[1]);
            let map = resources.maps.find(e => e.name === match[2]);

            if(mode !== undefined || map !== undefined) {
                // set game mode
                discordRichPresence.smallImageKey = mode.imageURL;
                discordRichPresence.smallImageText = match[1];
                //set map
                discordRichPresence.largeImageKey = map.imageURL;
                discordRichPresence.largeImageText = match[2];
            }
        }

        return discordRichPresence;
}
