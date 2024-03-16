export const clientId = "1106795857233321994";
export const appID = 1172470;
export const title = "Apex Legends";

const playingRegex = /^(?:(.*) - (.*)(\(.*\))$|(.*) - (.*))$/;
const startTimestamp = Math.floor(Date.now() / 1000);
const resources = {
    "maps": [
        {
            "name": "Training",
            "imageURL": "https://i.postimg.cc/Hk30q0cv/3-oml-Ex-SE-Custom.png"
        },
        {
            "name": "Firing Range",
            "imageURL": "https://i.postimg.cc/C5jkmbpN/2-3nj-WDWU-Custom.png"
        },
        {
            "name": "Caustic Treatment",
            "imageURL": "https://i.postimg.cc/xjHvfVNz/4-3-Gk-YRBH-Custom.png"
        },
        {
            "name": "Habitat 4",
            "imageURL": "https://i.postimg.cc/pLVzJ9Gf/5-mqx-SBup-Custom.png"
        },
        {
            "name": "Hammond Labs",
            "imageURL": "https://i.postimg.cc/50QwQZPD/6-j-Dv-MDh8-Custom.png"
        },
        {
            "name": "Skull Town",
            "imageURL": "https://i.postimg.cc/XqM9fQmq/7-zpk-Lx-JE-Custom.png"
        },
        {
            "name": "Broken Moon",
            "imageURL": "https://i.postimg.cc/bNhQdV1F/8-ff-Po-KOX-Custom.png"
        },
        {
            "name": "Kings Canyon",
            "imageURL": "https://i.postimg.cc/bN91n0TY/9-Vk73v-WT-Custom.png"
        },
        {
            "name": "Olympus",
            "imageURL": "https://i.postimg.cc/LsXk2qj9/10-Vj-QLOlk-Custom.png"
        },
        {
            "name": "Storm Point",
            "imageURL": "https://i.postimg.cc/3xLpSKVP/11-bo9ng-Z7-Custom.png"
        },
        {
            "name": "World's Edge",
            "imageURL": "https://i.postimg.cc/85v6zLcS/12-PAz-Ds-Dq-Custom.png"
        },
        {
            "name": "Phase Runner",
            "imageURL": "https://i.postimg.cc/tRh60d8d/13-I6m-Wvs5-Custom.png"
        },
        {
            "name": "Party Crasher",
            "imageURL": "https://i.postimg.cc/WzPJFtqJ/14-dph1-Hur-Custom.png"
        },
        {
            "name": "Overflow",
            "imageURL": "https://i.postimg.cc/L621mYMc/15-b-Pde7j-R-Custom.png"
        },
        {
            "name": "Estates",
            "imageURL": "https://i.postimg.cc/MHbfyx13/16-9g2-C2-AC-Custom.png"
        },
        {
            "name": "Lava Siphon",
            "imageURL": "https://i.postimg.cc/7Y9ThHHf/17-QOBOuv-Z-Custom.png"
        },
        {
            "name": "Fragment East",
            "imageURL": ""
        }
    ],
    "cover": "https://i.postimg.cc/pLPYccTn/1-Th1-Pq81-Custom.png"
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
