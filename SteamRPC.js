import { readdir } from "node:fs/promises";

import DiscordRPC from "@xhayper/discord-rpc";
import SteamID from "steamid";
import fetch from "node-fetch";
import LogUpdate from "log-update";

import config from "./config.js";


// =================================================================
// Initialize Status Variables
let gameStatus = "";
let discordStatus = "waiting for supported game...";
let steamStatus = "obtaining user id";
let debugLine = "";
let version = "1.0";

// Initialize Discord Objects
var discordRPCClient = null;

//todo let presences keep track of timestamp
var lastTimestamp = null;
var lastStatus;

function initRPC(clientId) {
    discordRPCClient = new DiscordRPC.Client({
        clientId: clientId,
        transport: "ipc"
    });

    discordRPCClient.on("ready", () => {
        discordStatus = "connected (IPC) | clientId: " + clientId;
        renderWindow();
    });
    
    discordRPCClient.on("error", (err, message) => {
        discordStatus = `error ${err}: ${message}`;
        renderWindow();
    });

    discordRPCClient.login();
}

// =================================================================
// Logging
let currSpinFrame = 0;
function renderWindow() {
    const spinFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    currSpinFrame++;
    if (currSpinFrame == 10) currSpinFrame = 0;

    LogUpdate(
        `Steam: ${!steamStatus.startsWith("connected") ? steamStatus+spinFrames[currSpinFrame] : steamStatus}\n` +
        `Discord: ${discordStatus + (discordStatus.startsWith("connected") ? "" : " " + spinFrames[currSpinFrame])}\n` +
        `Game: ${gameStatus}\n` +
        `\n` +
        `> ${debugLine}\n`
    );
};

// =================================================================
// SteamRPC Logic
 
async function getSteamUserId() {
    if (config.steam_profile_url.startsWith("https://steamcommunity.com/id/")) {
        let res = await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${config.steam_web_key}&vanityurl=${config.steam_profile_url.split("id/")[1].split("/")[0]}`);
        if (res.ok) {
            let resJson = await res.json();
            if (resJson.response.success == 1) return new SteamID(resJson.response.steamid);
        }
    }
    else if (config.steam_profile_url.startsWith("https://steamcommunity.com/profiles/")) {
        return new SteamID(config.steam_profile_url.split("profiles/")[1].split("/")[0]);
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
            gameStatus = resJson.in_game.name;

            if(resJson.in_game?.rich_presence === "")
                debugLine = "There is no RPC status for this game.";
            else {
                if (resJson.in_game?.logo && resJson.in_game?.rich_presence) {
                    let currentAppId = resJson.in_game.logo.split("/apps/")[1].split("/")[0];
                    let currentSteamStatus = resJson.in_game.rich_presence;
                    debugLine = "Current Steam RPC Status: " + resJson.in_game.rich_presence;

                    if (profiles.hasOwnProperty(currentAppId)) {
                        let profile = profiles[currentAppId];
                        try {
                            gameStatus = profile.title;
                            let clientId;

                            if(profile.clientId !== undefined)
                                clientId = profile.clientId;
                            else
                                clientId = config.default_client_id;
    
                            if(discordRPCClient === null) 
                                initRPC(clientId);
                            else if(discordRPCClient.clientId !== clientId) {
                                discordRPCClient.login({clientId});
                            }
    
                            let translatedDiscordRPC = profile.translateSteamPresence(currentSteamStatus, discordRPCClient);

                            if (typeof translatedDiscordRPC !== "object") 
                                throw `Profile returned '${typeof translatedDiscordRPC}' instead of an object.`;
    
                            if(translatedDiscordRPC.startTimestamp) {
                                if(lastTimestamp !== null) translatedDiscordRPC.startTimestamp = lastTimestamp;
                                else lastTimestamp = translatedDiscordRPC.startTimestamp;
                            }

                            else {
                                lastTimestamp = null;
                            }

                            translatedDiscordRPC.largeImageText = `SteamRPC - v${version}`;
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
            if(discordRPCClient !== null) {
                discordRPCClient.destroy();
                discordRPCClient = null;
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
setInterval(pollSteamPresence, config.poll_rate, steamUserId, profiles);