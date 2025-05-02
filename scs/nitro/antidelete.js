import _0x20ae95 from "fs";
import _0x6b6cbc from "../../config.cjs";
import _0x1c103d from "@whiskeysockets/baileys";
const {
  proto,
  downloadContentFromMessage
} = _0x1c103d;
const prefix = _0x6b6cbc.PREFIX;
const antiDeleteGlobal = _0x6b6cbc.ANTI_DELETE;
const demonContext = {
  "forwardingScore": 0x3e7,
  "isForwarded": true,
  "forwardedNewsletterMessageInfo": {
    "newsletterJid": "120363369453603973@newsletter",
    "newsletterName": "Sʜᴀᴅᴏᴡ Xᴛᴇᴄʜ",
    "serverMessageId": 0x8f
  }
};
class DemonAntiDelete {
  constructor() {
    this.enabled = false;
    this.messageCache = new Map();
    this.cacheExpiry = 300000;
    this.cleanupInterval = setInterval(() => this.cleanExpiredMessages(), this.cacheExpiry);
  }
  ["cleanExpiredMessages"]() {
    const _0x5ba793 = Date.now();
    for (const [_0x29df7d, _0x123a6d] of this.messageCache.entries()) {
      if (_0x5ba793 - _0x123a6d.timestamp > this.cacheExpiry) {
        this.messageCache["delete"](_0x29df7d);
      }
    }
  }
  ["formatTime"](_0x1ba952) {
    const _0x32c9c2 = {
      "timeZone": "Asia/Karachi",
      "year": "numeric",
      "month": "short",
      "day": "numeric",
      "hour": "2-digit",
      "minute": "2-digit",
      "second": "2-digit",
      "hour12": true
    };
    return new Date(_0x1ba952).toLocaleString("en-PK", _0x32c9c2) + " (PKT)";
  }
}
const demonDelete = new DemonAntiDelete();
let statusData = {};
if (_0x20ae95.existsSync("./demon_antidelete.json")) {
  statusData = JSON.parse(_0x20ae95.readFileSync("./demon_antidelete.json"));
}
if (!statusData.chats) {
  statusData.chats = {};
}
if (antiDeleteGlobal) {
  demonDelete.enabled = true;
}
const AntiDelete = async (_0x3fd693, _0x35473a) => {
  const _0x35083d = _0x3fd693.from;
  const _0x5611d3 = async _0xde38b5 => {
    if (!_0xde38b5) {
      return {
        "name": "Unknown Chat",
        "isGroup": false
      };
    }
    if (_0xde38b5.includes("@g.us")) {
      try {
        const _0x4b717d = await _0x35473a.groupMetadata(_0xde38b5);
        return {
          "name": _0x4b717d?.["subject"] || "Demon Nest",
          "isGroup": true
        };
      } catch {
        return {
          "name": "Demon Nest",
          "isGroup": true
        };
      }
    }
    return {
      "name": "Private Mission",
      "isGroup": false
    };
  };
  if (_0x3fd693.body.toLowerCase() === prefix + "antidelete on" || _0x3fd693.body.toLowerCase() === prefix + "antidelete off") {
    const _0x2e6896 = {
      "on": {
        "text": "🚫 *Sʜᴀᴅᴏᴡ Xᴛᴇᴄʜ Aɴᴛɪᴅᴇʟᴇᴛᴇ Aᴄᴛɪᴠᴀᴛᴇᴅ!*\n\n• Status: ✅ Enabled\n• Cache: 🕒 5 minutes\n• Mode: 🌐 Global\n\n_Deleted messages will now rise from the shadows_\n\n━━━━━━⊱✿⊰━━━━━━\nPᴏᴡᴇʀᴇᴅ Bʏ Sʜᴀᴅᴏᴡ Xᴛᴇᴄʜ",
        "contextInfo": demonContext
      },
      "off": {
        "text": "🚫 *Sʜᴀᴅᴏᴡ Xᴛᴇᴄʜ Aɴᴛɪᴅᴇʟᴇᴛᴇ Dᴇᴀᴄᴛɪᴠᴀᴛᴇᴅ!*\n\n• Status: ❌ Disabled\n\n_Message recovery disabled_\n\n━━━━━━⊱✿⊰━━━━━━\nPᴏᴡᴇʀᴇᴅ Bʏ Ⴊl𐌀Ꮳk𐌕𐌀ႲႲჄ",
        "contextInfo": demonContext
      }
    };
    if (_0x3fd693.body.toLowerCase() === prefix + "antidelete on") {
      statusData.chats[_0x35083d] = true;
      _0x20ae95.writeFileSync("./demon_antidelete.json", JSON.stringify(statusData, null, 0x2));
      demonDelete.enabled = true;
      await _0x35473a.sendMessage(_0x3fd693.from, _0x2e6896.on, {
        "quoted": _0x3fd693
      });
    } else {
      statusData.chats[_0x35083d] = false;
      _0x20ae95.writeFileSync("./demon_antidelete.json", JSON.stringify(statusData, null, 0x2));
      demonDelete.enabled = false;
      demonDelete.messageCache.clear();
      await _0x35473a.sendMessage(_0x3fd693.from, _0x2e6896.off, {
        "quoted": _0x3fd693
      });
    }
    await _0x35473a.sendReaction(_0x3fd693.from, _0x3fd693.key, "⚔️");
    return;
  }
  _0x35473a.ev.on("messages.upsert", async ({
    messages: _0x22a945
  }) => {
    if (!antiDeleteGlobal && !demonDelete.enabled) {
      return;
    }
    if (!_0x22a945?.["length"]) {
      return;
    }
    for (const _0x308327 of _0x22a945) {
      if (_0x308327.key.fromMe || !_0x308327.message || _0x308327.key.remoteJid === "status@broadcast") {
        continue;
      }
      try {
        const _0x4fc7cd = _0x308327.message.conversation || _0x308327.message.extendedTextMessage?.["text"] || _0x308327.message.imageMessage?.["caption"] || _0x308327.message.videoMessage?.["caption"] || _0x308327.message.documentMessage?.["caption"];
        let _0x5f2e56;
        let _0x56a40e;
        let _0x573ca0;
        const _0x1086f2 = ["image", "video", "audio", "sticker", "document"];
        for (const _0x10c87e of _0x1086f2) {
          if (_0x308327.message[_0x10c87e + "Message"]) {
            const _0x54486b = _0x308327.message[_0x10c87e + "Message"];
            try {
              const _0x1dcb5e = await downloadContentFromMessage(_0x54486b, _0x10c87e);
              let _0x379aeb = Buffer.from([]);
              for await (const _0x3834c6 of _0x1dcb5e) _0x379aeb = Buffer.concat([_0x379aeb, _0x3834c6]);
              _0x5f2e56 = _0x379aeb;
              _0x56a40e = _0x10c87e;
              _0x573ca0 = _0x54486b.mimetype;
              break;
            } catch {}
          }
        }
        if (_0x308327.message.audioMessage?.["ptt"]) {
          try {
            const _0xd861e = await downloadContentFromMessage(_0x308327.message.audioMessage, "audio");
            let _0x1baaa4 = Buffer.from([]);
            for await (const _0x3be7f8 of _0xd861e) _0x1baaa4 = Buffer.concat([_0x1baaa4, _0x3be7f8]);
            _0x5f2e56 = _0x1baaa4;
            _0x56a40e = "voice";
            _0x573ca0 = _0x308327.message.audioMessage.mimetype;
          } catch {}
        }
        if (_0x4fc7cd || _0x5f2e56) {
          demonDelete.messageCache.set(_0x308327.key.id, {
            "content": _0x4fc7cd,
            "media": _0x5f2e56,
            "type": _0x56a40e,
            "mimetype": _0x573ca0,
            "sender": _0x308327.key.participant || _0x308327.key.remoteJid,
            "senderFormatted": "@" + (_0x308327.key.participant || _0x308327.key.remoteJid ? (_0x308327.key.participant || _0x308327.key.remoteJid).replace(/@s\.whatsapp\.net|@g\.us/g, '') : "Unknown"),
            "timestamp": Date.now(),
            "chatJid": _0x308327.key.remoteJid
          });
        }
      } catch {}
    }
  });
  _0x35473a.ev.on("messages.update", async _0x5cb208 => {
    if (!antiDeleteGlobal && !demonDelete.enabled) {
      return;
    }
    if (!_0x5cb208?.["length"]) {
      return;
    }
    for (const _0x350212 of _0x5cb208) {
      try {
        const {
          key: _0x528478,
          update: _0x10c012
        } = _0x350212;
        const _0xf79f4a = _0x10c012?.["messageStubType"] === proto.WebMessageInfo.StubType.REVOKE || _0x10c012?.["status"] === proto.WebMessageInfo.Status.DELETED;
        if (!_0xf79f4a || _0x528478.fromMe || !demonDelete.messageCache.has(_0x528478.id)) {
          continue;
        }
        const _0x128e89 = demonDelete.messageCache.get(_0x528478.id);
        demonDelete.messageCache["delete"](_0x528478.id);
        const _0x2f304c = await _0x5611d3(_0x128e89.chatJid);
        const _0x4f4072 = _0x10c012?.["participant"] ? "@" + (_0x10c012.participant ? _0x10c012.participant.replace(/@s\.whatsapp\.net|@g\.us/g, '') : "Unknown") : _0x528478.participant ? "@" + (_0x528478.participant ? _0x528478.participant.replace(/@s\.whatsapp\.net|@g\.us/g, '') : "Unknown") : "Unknown Demon";
        const _0x4eb297 = _0x128e89.type ? _0x128e89.type.charAt(0x0).toUpperCase() + _0x128e89.type.slice(0x1) : "Message";
        const _0x1a029a = "⚔️ *Recovered Deleted " + _0x4eb297 + "*\n\n" + ("👤 *Sender:* " + _0x128e89.senderFormatted + "\n") + ("🗡️ *Deleted By:* " + _0x4f4072 + "\n") + ("🏰 *Location:* " + _0x2f304c.name + (_0x2f304c.isGroup ? " (Group)" : '') + "\n") + ("⏰ *Sent At:* " + demonDelete.formatTime(_0x128e89.timestamp) + "\n") + ("🕰️ *Deleted At:* " + demonDelete.formatTime(Date.now()) + "\n\n") + "━━━━━━━━━━━━━━━\n" + "Pᴏᴡᴇʀᴇᴅ Bʏ Ⴊl𐌀Ꮳk𐌕𐌀ႲႲჄ";
        if (_0x128e89.media) {
          await _0x35473a.sendMessage(_0x128e89.chatJid, {
            [_0x128e89.type]: _0x128e89.media,
            "mimetype": _0x128e89.mimetype,
            "caption": _0x1a029a,
            "contextInfo": demonContext
          });
        } else if (_0x128e89.content) {
          await _0x35473a.sendMessage(_0x128e89.chatJid, {
            "text": _0x1a029a + "\n\n📜 *Recovered Content:* \n" + _0x128e89.content,
            "contextInfo": demonContext
          });
        }
      } catch {}
    }
  });
};
export default AntiDelete;