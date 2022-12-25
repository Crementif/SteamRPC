// Import configuration
export const appID = 1938090;
export const title = "Call of Duty: Modern Warfare II | Warzone 2.0";

export function translateSteamPresence(steamRichPresence) {
    let discordRichPresence = {};
    discordRichPresence.details = "Modern Warfare II | Warzone 2.0";
    discordRichPresence.largeImageKey = "cover";
    discordRichPresence.smallImageKey = "logo";
    discordRichPresence.smallImageText = "MWII";
    // Gamemodes
    if (steamRichPresence.toLowerCase().includes("main menu")) {
        discordRichPresence.details = "in Main Menu";
        discordRichPresence.largeImageText = "Main Menu";
    }
    if (steamRichPresence.toLowerCase().includes("pre-game lobby")) {
        discordRichPresence.details = "in Pre-game Lobby";
        discordRichPresence.largeImageText = "Main Menu";
    }
    if (steamRichPresence.toLowerCase().includes("search and destroy")) {
        discordRichPresence.details = "Playing Search And Destroy";
        discordRichPresence.largeImageText = "Playing Search And Destroy";
    }
    if (steamRichPresence.toLowerCase().includes("deathmatch")) {
        discordRichPresence.details = "Playing Deathmatch";
        discordRichPresence.largeImageText = "Playing Deathmatch";
    }
    if (steamRichPresence.toLowerCase().includes("hardpoint")) {
        discordRichPresence.details = "Playing Hardpoint";
        discordRichPresence.largeImageText = "Playing Hardpoint";
    }
    if (steamRichPresence.toLowerCase().includes("free-for-all")) {
        discordRichPresence.details = "Playing Free-For-All";
        discordRichPresence.largeImageText = "Playing Free-For-All";
    }
    if (steamRichPresence.toLowerCase().includes("domination")) {
        discordRichPresence.details = "Playing Domination";
        discordRichPresence.largeImageText = "Playing Domination";
    }
    if (steamRichPresence.toLowerCase().includes("search and destroy")) {
        discordRichPresence.details = "Playing Search And Destroy";
        discordRichPresence.largeImageText = "Playing Search And Destroy";
    }
    if (steamRichPresence.toLowerCase().includes("headquarters")) {
        discordRichPresence.details = "Playing Headquarters";
        discordRichPresence.largeImageText = "Playing Headquarters";
    }
    if (steamRichPresence.toLowerCase().includes("kill confirmed")) {
        discordRichPresence.details = "Playing Kill Confirmed";
        discordRichPresence.largeImageText = "Playing Kill Confirmed";
    }
    if (steamRichPresence.toLowerCase().includes("prisoner rescue")) {
        discordRichPresence.details = "Playing Prisoner Rescue";
        discordRichPresence.largeImageText = "Playing Prisoner Rescue";
    }
    if (steamRichPresence.toLowerCase().includes("knock out")) {
        discordRichPresence.details = "Playing Knock Out";
        discordRichPresence.largeImageText = "Playing Knock Out";
    }
    if (steamRichPresence.toLowerCase().includes("control")) {
        discordRichPresence.details = "Playing Control";
        discordRichPresence.largeImageText = "Playing Control";
    }
    if (steamRichPresence.toLowerCase().includes("bounty")) {
        discordRichPresence.details = "Playing Bounty";
        discordRichPresence.largeImageText = "Playing Bounty";
    }
    if (steamRichPresence.toLowerCase().includes("ground war")) {
        discordRichPresence.details = "Playing Ground War";
        discordRichPresence.largeImageText = "Playing Ground War";
    }
    if (steamRichPresence.toLowerCase().includes("invasion")) {
        discordRichPresence.details = "Playing Invasion";
        discordRichPresence.largeImageText = "Playing Invasion";
    }
    if (steamRichPresence.toLowerCase().includes("cyber attack")) {
        discordRichPresence.details = "Playing Cyber Attack";
        discordRichPresence.largeImageText = "Playing Cyber Attack";
    }
    if (steamRichPresence.toLowerCase().includes("warzone")) {
        discordRichPresence.details = "Playing Warzone 2.0";
        discordRichPresence.largeImageText = "Playing Warzone 2.0";
    }
    if (steamRichPresence.toLowerCase().includes("dmz")) {
        discordRichPresence.details = "Playing DMZ";
        discordRichPresence.largeImageText = "Playing DMZ";
    }

    // Maps
    if (steamRichPresence.toLowerCase().includes("el bagra fortress")) {
        discordRichPresence.state = "El Bagra Fortress";
        discordRichPresence.largeImageText = "El Bagra Fortress";
        discordRichPresence.largeImageKey = "elbagrafortress"
    }
    if (steamRichPresence.toLowerCase().includes("sa'id")) {
        discordRichPresence.state = "Sa'Id";
        discordRichPresence.largeImageText = "Sa'Id";
        discordRichPresence.largeImageKey = "said"
    }
    if (steamRichPresence.toLowerCase().includes("breenbergh hotel")) {
        discordRichPresence.state = "Breenbergh Hotel";
        discordRichPresence.largeImageText = "Breenbergh Hotel";
        discordRichPresence.largeImageKey = "breenberghhotel"
    }
    if (steamRichPresence.toLowerCase().includes("crown raceway")) {
        discordRichPresence.state = "Crown Raceway";
        discordRichPresence.largeImageText = "Crown Raceway";
        discordRichPresence.largeImageKey = "crownraceway"
    }
    if (steamRichPresence.toLowerCase().includes("el asilo")) {
        discordRichPresence.state = "El Asilo";
        discordRichPresence.largeImageText = "El Asilo";
        discordRichPresence.largeImageKey = "elasilo"
    }
    if (steamRichPresence.toLowerCase().includes("embassy")) {
        discordRichPresence.state = "Embassy";
        discordRichPresence.largeImageText = "Embassy";
        discordRichPresence.largeImageKey = "embassy"
    }
    if (steamRichPresence.toLowerCase().includes("farm 18")) {
        discordRichPresence.state = "Farm 18";
        discordRichPresence.largeImageText = "Farm 18";
        discordRichPresence.largeImageKey = "farm18"
    }
    if (steamRichPresence.toLowerCase().includes("mercado las almas")) {
        discordRichPresence.state = "Mercado Las Almas";
        discordRichPresence.largeImageText = "Mercado Las Almas";
        discordRichPresence.largeImageKey = "mercadolasalmas"
    }
    if (steamRichPresence.toLowerCase().includes("santa sena border crossing")) {
        discordRichPresence.state = "Santa Sena Border Crossing";
        discordRichPresence.largeImageText = "Santa Sena Border Crossing";
        discordRichPresence.largeImageKey = "santasenabordercrossing"
    }
    if (steamRichPresence.toLowerCase().includes("taraq")) {
        discordRichPresence.state = "Taraq";
        discordRichPresence.largeImageText = "Taraq";
        discordRichPresence.largeImageKey = "taraq"
    }
    if (steamRichPresence.toLowerCase().includes("zarqwa hydroelectric")) {
        discordRichPresence.state = "Zarqwa Hydroelectric";
        discordRichPresence.largeImageText = "Zarqwa Hydroelectric";
        discordRichPresence.largeImageKey = "zarqwahydroelectric"
    }
    if (steamRichPresence.toLowerCase().includes("shipment")) {
        discordRichPresence.state = "Shipment";
        discordRichPresence.largeImageText = "Shipment";
        discordRichPresence.largeImageKey = "shipment"
    }
    if (steamRichPresence.toLowerCase().includes("shoothouse")) {
        discordRichPresence.state = "ShootHouse";
        discordRichPresence.largeImageText = "ShootHouse";
        discordRichPresence.largeImageKey = "shoothouse"
    }
    if (steamRichPresence.toLowerCase().includes("guijarro")) {
        discordRichPresence.state = "Guijarro";
        discordRichPresence.largeImageText = "guijarro";
        discordRichPresence.largeImageKey = "guijarro"
    }
    if (steamRichPresence.toLowerCase().includes("santa sena")) {
        discordRichPresence.state = "Santa Sena";
        discordRichPresence.largeImageText = "Santa Sena";
        discordRichPresence.largeImageKey = "santasena"
    }
    if (steamRichPresence.toLowerCase().includes("sariff bay")) {
        discordRichPresence.state = "Sariff Bay";
        discordRichPresence.largeImageText = "Sariff Bay";
        discordRichPresence.largeImageKey = "sariffbay"
    }
    if (steamRichPresence.toLowerCase().includes("al mazrah")) {
        discordRichPresence.state = "Al Mazrah";
        discordRichPresence.largeImageText = "Al Mazrah";
        discordRichPresence.largeImageKey = "almazrah"
    }
    return discordRichPresence;
}
