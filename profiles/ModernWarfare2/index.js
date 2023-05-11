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
        discordRichPresence.details = "Playing Modern Warfare II | Warzone 2.0";
        discordRichPresence.state = steamRichPresence;

        if(!fs.existsSync(dir + '/resources.json')) {
            return discordRichPresence;
        }

        resources = JSON.parse(fs.readFileSync(dir + '/resources.json'));
        discordRichPresence.largeImageKey = resources.cover;

        let match = steamRichPresence.match(playingRegex);
        if(match && match.length > 2) {
            discordRichPresence.state = `${match[1]} in ${match[2]}`;
            
            let mode = resources.modes.find(e => e.name === match[1]);
            let map = resources.maps.find(e => e.name === match[2]);

            if(map !== undefined) {
                //set map
                discordRichPresence.largeImageKey = map.imageURL;
                discordRichPresence.largeImageText = match[2];

                if(mode !== undefined) {
                    // set game mode
                    discordRichPresence.smallImageKey = mode.imageURL;
                    discordRichPresence.smallImageText = match[1];
                }
            }
        }

        return discordRichPresence;
}
