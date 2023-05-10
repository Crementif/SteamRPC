import { readdir } from "node:fs/promises";
import fs from 'fs';

import DiscordRPC from "@xhayper/discord-rpc";
import SteamID from "steamid";
import fetch from "node-fetch";
import LogUpdate from "log-update";


// ==================== Configuration Settings =====================
// Steam user identification

// You'll need to find your own SteamID64 URL using https://steamrep.com
// Note: This also allows custom URLs like https://steamcommunity.com/id/crementif but they require providing a valid web key.
const steamProfileURL = "https://steamcommunity.com/profiles/76561198259089872";

// ONLY needs to be replaced if you use a custom URL in the steamProfileURL variable above. There's no real benefit!
// You can get one from https://steamcommunity.com/dev/apikey. Use localhost as the domain name.
const steamWebKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

// Advanced Configuration Settings
const pollRate = 20*1000; // Poll Steam Rich Presence every n seconds. You should keep this at or above 20 seconds.
const discordClientId = "433731243516100629"; // Keep this id unless you want to supply your own application id.

// =================================================================
// Initialize Status Variables
let gameStatus = "";
let discordStatus = "logging in";
let steamStatus = "obtaining user id";
let debugLine = "";

// Initialize Discord Objects
const discordRPCClient = new DiscordRPC.Client({
    clientId: discordClientId,
    transport: "ipc"
});

// Setup discord RPC
discordRPCClient.on("ready", () => {
    discordStatus = "connected (IPC)";
    renderWindow();
});

discordRPCClient.on("error", (err, message) => {
    discordStatus = `error ${err}: ${message}`;
    renderWindow();
});

// =================================================================
// Logging
let currSpinFrame = 0;
function renderWindow() {
    const spinFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    currSpinFrame++;
    if (currSpinFrame == 10) currSpinFrame = 0;

    LogUpdate(
        `Steam: ${!steamStatus.startsWith("connected") ? steamStatus+spinFrames[currSpinFrame] : steamStatus}\n` +
        `Discord: ${discordStatus+(discordStatus!=="connected (IPC)" ? " "+spinFrames[currSpinFrame] : "")}\n` +
        `Game: ${gameStatus}\n` +
        `\n` +
        `> ${debugLine}\n`
    );
};

// =================================================================
// SteamRPC Logic
 
async function getSteamUserId() {
    if (steamProfileURL.startsWith("https://steamcommunity.com/id/")) {
        let res = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${steamWebKey}&vanityurl=${steamProfileURL.split("id/")[1].split("/")[0]}`);
        if (res.ok) {
            let resJson = await res.json();
            if (resJson.response.success == 1) return new SteamID(resJson.response.steamid);
        }
    }
    else if (steamProfileURL.startsWith("https://steamcommunity.com/profiles/")) {
        return new SteamID(steamProfileURL.split("profiles/")[1].split("/")[0]);
    }
}

async function updateResources(folder, appID) {
    let res = await fetch(`https://raw.githubusercontent.com/angelolz1/SteamRPC/mw2/profiles/${folder}/resources.json`);
    if (res.ok) {
        let resJson = await res.json();
        resources = resJson;
        fs.writeFileSync(`./profiles/${folder}/resources.json`, resJson);
    }
}

async function loadProfiles() {
    let profiles = {};

    let profileFolders = (await readdir("profiles")).filter((folder) => folder != "ExampleProfile");
    for (const folder of profileFolders) {
        try {
            let profile = await import(`./profiles/${folder}/index.js`);
            if (typeof profile.title != "string") throw "Exported 'title' couldn't be found or isn't a valid string type!";
            if (typeof profile.appID != "number") throw "Exported 'appID' couldn't be found or isn't a valid number type!";
            if (typeof profile.translateSteamPresence != "function") throw "Exported 'translateSteamPresence' function couldn't be found or isn't a valid function type!";
            if (profiles.hasOwnProperty(profile.appID)) throw `Found two profiles that export the same appID ${profile.appID}! Make sure to change the appID variable in each profile!`;

            updateResources(folder, profile.appID);
            profiles[profile.appID] = profile;
        }
        catch (err) {
            throw new Error(`An error occured while trying to load the profile from "profiles/${folder}"!`, {cause: err});
        }
        debugLine = `[${Object.keys(profiles).length}/${profileFolders.length}] Loading '${folder}'...`;
        renderWindow();
    }
    debugLine = `Finished loading ${Object.keys(profiles).length} profile(s), waiting for Steam Rich Presence events...`;
    return profiles;
}

async function pollSteamPresence(steamUserId, profiles) {
    // todo: Is there a way to find/create the Join Game button on the user's profile page, eg steam://joinlobby/1938090/109775241047500448/76561198259089872
    let res = await fetch(`https://steamcommunity.com/miniprofile/${steamUserId.getSteam3RenderedID().substring(5, 5+9)}/json?appid=undefined`, {headers: {"X-Requested-With": "XMLHttpRequest"}});
    if (res.ok) {
        steamStatus = "connected";
        gameStatus = "";
        let resJson = await res.json();
        if (resJson.in_game) {
            gameStatus = `${resJson.in_game.name} (not supported)`;
            if (resJson.in_game?.logo && resJson.in_game?.rich_presence) {
                let curr_appid = resJson.in_game.logo.split("/apps/")[1].split("/")[0];
                let curr_rpc = resJson.in_game.rich_presence;
                debugLine = "Current Steam RPC Status: " + resJson.in_game.rich_presence;
                if (profiles.hasOwnProperty(curr_appid)) {
                    let profile = profiles[curr_appid];
                    try {
                        gameStatus = profile.title;
                        let translatedDiscordRPC = profile.translateSteamPresence(curr_rpc);
                        if (typeof translatedDiscordRPC !== "object") throw `Profile returned '${typeof translatedDiscordRPC}' instead of an object.`;
                        discordRPCClient.user?.setActivity(translatedDiscordRPC);
                    }
                    catch (codeErr) {
                        throw new Error(`A code error has occured in the game profile for '${profile.title}'!`, {cause: codeErr});
                    }
                }
            }
        }
    }
    else {
        gameStatus = "";
        steamStatus = `Error ${res.status} while fetching status: ${res.statusText}`;
    }
    renderWindow();
}

// =================================================================
// Start each component

let loadingPrint = setInterval(renderWindow, 0.5*1000);
let [steamUserId, profiles] = await Promise.all([getSteamUserId(), loadProfiles()]);
clearInterval(loadingPrint);

if (Object.keys(profiles).length <= 0) {
    throw "No profiles were found inside the /profiles directory!";
}
if (steamUserId == undefined) {
    throw "Failed to obtain user id from steamProfileURL variable. It should be set to either https://steamcommunity.com/id/crementif or https://steamcommunity.com/profiles/76561198259089872.";
}
steamStatus = `Using Steam User ID ${steamUserId.getSteamID64()}`;

renderWindow();
pollSteamPresence(steamUserId, profiles);
setInterval(pollSteamPresence, pollRate, steamUserId, profiles);

discordRPCClient.login();
