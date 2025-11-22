export const clientId = "1106795857233321994";
export const appID = 1172470;
export const title = "Apex Legends";

const playingRegex = /^(?:(.*) - (.*)(\(.*\))$|(.*) - (.*))$/;
const startTimestamp = Math.floor(Date.now() / 1000);
const resources = {
    "maps": [
        {
            "name": "Training",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/training.png"
        },
        {
            "name": "Firing Range",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/firing-range.png"
        },
        {
            "name": "Caustic Treatment",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/caustic-treatment.png"
        },
        {
            "name": "Habitat 4",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/habitat-4.png"
        },
        {
            "name": "Hammond Labs",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/hammond-labs.png"
        },
        {
            "name": "Skull Town",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/skull-town.png"
        },
        {
            "name": "Broken Moon",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/broken-moon.png"
        },
        {
            "name": "Kings Canyon",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/kings-canyon.png"
        },
        {
            "name": "Olympus",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/olympus.png"
        },
        {
            "name": "Storm Point",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/storm-point.png"
        },
        {
            "name": "World's Edge",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/worlds-edge.png"
        },
        {
            "name": "Phase Runner",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/phase-runner.png"
        },
        {
            "name": "Party Crasher",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/party-crasher.png"
        },
        {
            "name": "Overflow",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/overflow.png"
        },
        {
            "name": "Estates",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/estates.png"
        },
        {
            "name": "Lava Siphon",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/lava-siphon.png"
        },
        {
            "name": "Fragment East",
            "imageURL": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/fragment-east.png"
        }
    ],
    "cover": "https://raw.githubusercontent.com/angelolz/SteamRPC/apex2/profiles/ApexLegends/resources/game-icon.png"
};

export function translateSteamPresence(steamRichPresence) {
    let discordRichPresence = {};

    discordRichPresence.details = steamRichPresence;
    discordRichPresence.largeImageKey = resources.cover;
    
    if(steamRichPresence.toLowerCase().includes("training")) {
        let map = resources.maps.find(e => e.name === "Training");
        discordRichPresence.state = "Training";
        discordRichPresence.largeImageKey = map.imageURL;
        discordRichPresence.startTimestamp = startTimestamp;
    }

    else if(steamRichPresence.toLowerCase().includes("firing range")) {
        let map = resources.maps.find(e => e.name === "Firing Range");
        discordRichPresence.state = "Firing Range";
        discordRichPresence.largeImageKey = map.imageURL;
        discordRichPresence.startTimestamp = startTimestamp;
    }

    else {
        let match = steamRichPresence.match(playingRegex);

        if(match) {
            let mapName;
            if(match[3] !== undefined) {
                discordRichPresence.state  = `${match[2]} - ${match[3]}`;
                mapName = match[1];
            } else {
                discordRichPresence.state = `${match[5]}`
                mapName = match[4];
            }

            let map = resources.maps.find(e => e.name === mapName);
            if(map !== undefined) {
                discordRichPresence.largeImageKey = map.imageURL;
                discordRichPresence.largeImageText = mapName;
            }
        }
    }

    if(discordRichPresence.state) //state is only filled in when user is in a match
        discordRichPresence.details = "In Game";

    return discordRichPresence;
}
