const Steam = require('steam');
const SteamTotp = require('steam-totp');
const DiscordRPC = require('discord-rpc');
const VDF = require(require.resolve('steam')+('\\..\\VDF.js')); // Include VDF decode function from steam module.
const LogUpdate = require('log-update');
const ByteBuffer = require('bytebuffer');
const fs = require('fs');


// ==================== Configuration Settings =====================
// Steam user identification
const steamUsername = "";
const steamPassword = "";
const steam2FASecret = "";

// Configuration Settings
var pollRate = 15*1000; // Poll Steam Rich Presence every n seconds. You could set it lower, but Discord RPC gets updated every 15 sec.
const discordClientId = "433731243516100629"; // Keep this id unless you want to supply your own application id.

// =================================================================
// Initialize Status Variables
currentPresenceGame = "";
steamStatus = "connecting";
discordStatus = "logging in";
debugLine = "";


// Initialize Steam Objects
const steamClient = new Steam.SteamClient();
const steamUser = new Steam.SteamUser(steamClient);

// Connect and login steamClient
steamClient.connect();

steamClient.on("connected", () => {
    if (steam2FASecret !== "") {
        debugLine = "Steam: Retrieving auth offset...";
        steamStatus = "generate auth code";
        SteamTotp.getTimeOffset((authError, authOffset) => {
            if (authError !== null) {
                console.error(authError);
                authOffset = 0; // Default to 0, the Steam servers could be down
            }
            steamAuthCode = SteamTotp.getAuthCode(steam2FASecret, authOffset);
            steamStatus = "logging in";
            debugLine = `Steam: Generated auth code ${steamAuthCode} with offset ${authOffset}, logging in...`;
            steamUser.logOn({account_name: steamUsername, password: steamPassword, two_factor_code: steamAuthCode});
        });
    }
    else {
        steamStatus = "logging in";
        debugLine = "Steam: Logging into an account that's assumed to have no 2FA method...";
    }
});
steamClient.on("disconnected", () => {
    if (steam2FASecret === "") console.warn("You haven't setup your 2FA secret and there's login errors.\n" +
        "Are you sure you don't use the Steam authenticator on your phone?\n" +
        " Manually authenticating this client isn't supported yet.");
    else console.error("Failed connecting, retrying...");
});
steamClient.on("logOnResponse", () => {
    steamStatus = `connected as ${steamUsername}`;
});


// Initialize Discord Objects
const discordRPCClient = new DiscordRPC.Client({transport: "ipc"});

// Login discordRPCClient
discordRPCClient.login(discordClientId);

discordRPCClient.on("ready", () => {
    discordStatus = "connected (IPC)";
});

// =================================================================
// Loader/registrant/Discorc RPC functions
richPresenceObjects = {};

function loadProfiles() {
    profileFiles = fs.readdirSync("profiles");
    for (i=0; i<profileFiles.length; i++) {
        try {
            // Try to create the method and listeners from the profiles.
            // Use the AppID name as it's easily retrievable in the callback function in the listener.
            richPresenceObject = richPresenceObjects[require("./profiles/" + profileFiles[i]).appID] = {};
            richPresenceObject.steamRPC = new Steam.SteamRichPresence(steamClient, require("./profiles/" + profileFiles[i]).appID);
            richPresenceObject.method = require("./profiles/"+profileFiles[i]).translateSteamPresence;
            richPresenceObject.title = require("./profiles/"+profileFiles[i]).title;
        }
        catch(err) {
            console.log(`An error occured while loading ${profileFiles[i]}. Check if you've supplied appID and title or if there's an error. Skipping profile...`);
            console.error(err);
            continue;
        }
        richPresenceObjects[require("./profiles/" + profileFiles[i]).appID].steamRPC.on("info", function (data) {
            if (data.rich_presence[0].rich_presence_kv.byteLength > 0) {
                currentPresenceGame = `${richPresenceObjects[this._appid].title}`;
                steamRichPresence = VDF.decode(ByteBuffer.wrap(data.rich_presence[0].rich_presence_kv)).RP;
                try {
                    discordRichPresence = richPresenceObjects[this._appid].method(steamRichPresence);
                    if (typeof discordRichPresence !== "object") throw `Profile returned '${typeof discordRichPresence} instead of an object.'`;
                }
                catch(codeErr) {
                    console.log(`A code error has occured in the game profile for '${richPresenceObjects[this._appid].title}':`);
                    console.error(codeErr);
                    return;
                }
                discordRPCClient.setActivity(discordRichPresence);
                debugLine = "Received: "+JSON.stringify(steamRichPresence);
                printInfo();
            }
        });
        debugLine = `[${i+1}/${profileFiles.length}] Loading '${profileFiles[i]}'...`;
        printInfo();
    }
    setInterval(pollSteamPresence, pollRate);
    pollSteamPresence();
}

function pollSteamPresence() {
    // TODO: Limit Steam requests when there's more profiles.
    for (game in richPresenceObjects) {
        richPresenceObjects[game].steamRPC.request(steamClient.steamID.toString());
    }
    debugLine = `Finished loading ${Object.keys(richPresenceObjects).length} profile(s), listening for Steam RPC events...`;
    printInfo();
}

// =================================================================
// Logging
const spinFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
currSpinFrame = 0;
function printInfo() {
    LogUpdate(`Steam: ${!steamStatus.startsWith("connected") ? steamStatus+spinFrames[currSpinFrame] : steamStatus}
Discord: ${discordStatus+(discordStatus!=="connected (IPC)" ? " "+spinFrames[currSpinFrame] : "")}
Game: ${currentPresenceGame}

> ${debugLine}`);

    // Reset spin animation
    currSpinFrame++;
    if (currSpinFrame === 10) currSpinFrame = 0;
    // Switch to manual update mode for printInfo if both are connected.
    if (currentPresenceGame === "" && steamStatus.startsWith("connected") && discordStatus==="connected (IPC)") {
        clearInterval(printInfoInterval);
        currentPresenceGame = "importing profiles";
        printInfo();
        loadProfiles();
    }
}

printInfoInterval = setInterval(printInfo, 100);