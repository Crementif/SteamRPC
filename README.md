##SteamToDiscordRPC

Converts the Rich Presence information from some Steam games to Discord Rich Presence, written in Node.js.

### Why?
This has the potential to support a lot of titles that don't officially have support for Discord's Rich Presence feature while not requiring things like game states, memory pointers or other game specific things.

It's inconvenient to have multiple Discord RPC clients that all have their own clients for different games.

Almost none of these RPC servers can actually run from a Raspberry Pi, VPS or other linux distro. This uses Steam however which works remotely.

This project uses an easy to implement profile structure where the profiles only have to translate Steam's Rich Presence to Discord's Rich Presence.

### Currently supported games:
- Rocket League

### Making your own profile
You can use one of the profiles as a template, but the main three things a profile should contain is:
1. The game's `appID` which can be found on [SteamDB](https://steamdb.info/).
2. Game title
3. An exported 'translation' with `translateSteamPresence` as it's name.
The function will receive an object with the presence info (also seen in the debug line in the console).
The function needs to return an object (or return an empty object, which clears the RPC) that will be passed to the Discord Rich Presence.
4. (Optional) Provide images in the resources folder with assets for the bot which will be uploaded.



Some issues with the current way of how the Discord RPC clients are tackled is that there's only 150 assets can be used and
every profile will also show the same "playing Steam" as there's no way to change this dynamically.
However, [this is likely to be added](https://github.com/discordapp/discord-rpc/issues/54), eventually.

### Installation
First of all, this currently only supports 2 login methods:
- Accounts without any 2FA
- Accounts that use the mobile app.

If you use the latter, you'll need to [extract your 2FA secret](https://github.com/SteamTimeIdler/stidler/wiki/Getting-your-%27shared_secret%27-code-for-use-with-Auto-Restarter-on-Mobile-Authentication).

Now that you've got all the configuration you'll need and have putten your username and password (plus your 2FA secret),
you've got to installation of the repository (you'll need to have Node.js):

Download the [repository zip](https://github.com/Crementif/SteamToDiscordRPC/archive/master.zip) or if you have git:
`git clone https://github.com/Crementif/SteamToDiscordRPC` to the file location you want.
Then, run `npm install` while you're in the folder to install the dependencies.
You can now run the server with `node SteamRPC.js` and it'll work, hopefully.