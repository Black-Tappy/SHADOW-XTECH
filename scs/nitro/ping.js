import config from '../../config.cjs';

const ping = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "ping") {
    const start = performance.now();
    await m.React('⏳');

    await sock.sendPresenceUpdate('composing', m.from);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await sock.sendPresenceUpdate('paused', m.from);

    const end = performance.now();
    const responseTime = Math.round(end - start);

    const text = `
╭━━━〔 *PONG!* 〕━━━╮
┃ 🟢 *Status:* Online
┃ ⏱️ *Response:* ${responseTime} ms
┃ ${getFancyMessage()}
╰━━━━━━━━━━━━━━╯
    `.trim();

    let profilePic;
    try {
      profilePic = await sock.profilePictureUrl(m.sender, 'image');
    } catch (err) {
      profilePic = 'https://i.ibb.co/7yzjwvJ/default.jpg'; // Fallback image if profile pic isn't available
    }

    await sock.sendMessage(m.from, {
      image: { url: profilePic },
      caption: text
    }, { quoted: m });
  }
}

function getFancyMessage() {
  const messages = [
    "⚡ Zooming through the wires!",
    "💨 Too fast to catch!",
    "🚀 Full throttle response!",
    "✨ Lightning mode activated!",
    "🌐 Instant like magic!",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export default ping;
