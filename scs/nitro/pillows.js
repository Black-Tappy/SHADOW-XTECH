import _0x42300f from "../../config.cjs";
import _0x353676 from "node-fetch";
async function fetchJson(_0x1b09a9, _0x47ffe3 = {}) {
  const _0x6957ec = await _0x353676(_0x1b09a9, {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      ..._0x47ffe3.headers
    },
    ..._0x47ffe3
  });
  if (!_0x6957ec.ok) {
    throw new Error("HTTP error! status: " + _0x6957ec.status);
  }
  return await _0x6957ec.json();
}
const play = async (_0x253c69, _0x27929d) => {
  const _0x535db0 = _0x42300f.PREFIX;
  const _0x13ace0 = _0x253c69.body.startsWith(_0x535db0) ? _0x253c69.body.slice(_0x535db0.length).split(" ")[0x0].toLowerCase() : '';
  const _0x31450b = _0x253c69.body.slice(_0x535db0.length + _0x13ace0.length).trim();
  if (_0x13ace0 === "play") {
    if (!_0x31450b) {
      return _0x253c69.reply("🎶 Tell me the song you're in the mood for! 🎶");
    }
    try {
      await _0x27929d.sendMessage(_0x253c69.from, {
        "text": "🔎 Finding \"" + _0x31450b + "\"..."
      }, {
        "quoted": _0x253c69
      });
      let _0xd7f93c = await fetchJson("https://api.agatz.xyz/api/ytsearch?message=" + encodeURIComponent(_0x31450b));
      let _0x47d11b = _0xd7f93c.data[0x0];
      if (!_0x47d11b) {
        return _0x253c69.reply("Hmm, couldn't find that tune. 😔 Maybe try again?");
      }
      let _0x488a45 = await fetchJson("https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=" + _0x47d11b.url);
      let _0x4869e6 = _0x488a45.result.audio;
      if (!_0x4869e6) {
        return _0x253c69.reply("⚠️ Couldn't grab the audio. Let's try later! 😔");
      }
      await _0x27929d.sendMessage(_0x253c69.from, {
        "audio": {
          "url": _0x4869e6
        },
        "fileName": _0x47d11b.title + ".mp3",
        "mimetype": "audio/mpeg",
        "contextInfo": {
          "forwardingScore": 0x5,
          "isForwarded": true,
          "forwardedNewsletterMessageInfo": {
            "newsletterName": "Sʜᴀᴅᴏᴡ Xᴛᴇᴄʜ",
            "newsletterJid": "120363369453603973@newsletter"
          },
          "externalAdReply": {
            "title": "🎧 Now playing: " + _0x47d11b.title + " 🎧",
            "body": ".mp3 audio delivered",
            "thumbnailUrl": _0x47d11b.thumbnail || "https://files.catbox.moe/3hrxbh.jpg",
            "mediaType": 0x1,
            "renderLargerThumbnail": true,
            "thumbnailHeight": 0x1f4,
            "thumbnailWidth": 0x1f4
          }
        }
      }, {
        "quoted": _0x253c69
      });
    } catch (_0x58a305) {
      console.error("Error in play command:", _0x58a305);
      _0x253c69.reply("Hmm, something went wrong. 😅 Let's try again!");
    }
  }
};
export default play;