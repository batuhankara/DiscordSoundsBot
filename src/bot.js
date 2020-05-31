const Discord = require("discord.js");
const client = new Discord.Client();
const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
let botChannel = "";
var globalChannel;
client.login("NzE2NjA5NTU5MTA3NzMxNTA2.XtORYQ.gKMPJTK9Mi8aah1imoo8zCZtvO8");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (!globalChannel) {
    globalChannel = await message.member.voice.channel.join();
  }
  if (message.content == "!stop") {
    if (message.member.voice.channel) {
      globalChannel.dispatcher.pause();
    }
  }

  if (message.content.includes("!play")) {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      var query = message.content.replace("!play", "");
      var url = await getUrlOrSearch(query);

      message.reply(url);
      globalChannel.play(
        ytdl(url, {
          filter: "audioonly",
        })
      );
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }
});
client.on("voiceStateUpdate", async (oldState, newState) => {
  if (!globalChannel) {
    return;
  }
  if (newState.channelID == globalChannel?.channel?.id) {
    console.log("hit true");

    PlayALocalMedia("../media/berkay.mp3");
  } else {
    PlayALocalMedia("../media/kemal.mp3");
  }
});
function PlayALocalMedia(path) {
  globalChannel.play(path);
}
async function getUrlOrSearch(url) {
  if (url.startsWith("http") || url.startsWith("https")) {
    return url;
  } else {
    return await getVideoUrl(url);
  }
}
async function getVideoUrl(query) {
  let filter;
  filters = await ytsr.getFilters(query);
  filter = filters.get("Type").find((o) => o.name === "Video");
  var filters2 = await ytsr.getFilters(filter.ref);

  filter = filters2.get("Duration").find((o) => o.name.startsWith("Short"));
  var options = {
    limit: 1,
    nextpageRef: filter.ref,
  };
  var result = await ytsr(null, options);
  return result.items[0].link;
}
