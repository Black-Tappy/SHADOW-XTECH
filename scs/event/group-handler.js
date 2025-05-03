import moment from 'moment-timezone';
import config from '../../config.cjs';

export default async function GroupParticipants(sock, { id, participants, action }) {
   try {
      const metadata = await sock.groupMetadata(id);

      for (const jid of participants) {
         let profile;
         try {
            profile = await sock.profilePictureUrl(jid, "image");
         } catch {
            profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu";
         }

         const userName = jid.split('@')[0];
         const currentTime = moment.tz('Asia/Kolkata').format('HH:mm:ss');
         const currentDate = moment.tz('Asia/Kolkata').format('DD/MM/YYYY');
         const membersCount = metadata.participants.length;

         if (action === "add" && config.WELCOME) {
            await sock.sendMessage(id, {
               text: `> Hello @${userName}! Welcome to *${metadata.subject}*.\n> You are the ${membersCount}th member.\n> Joined at: ${currentTime} on ${currentDate}`,
               contextInfo: {
                  mentionedJid: [jid],
                  externalAdReply: {
                     title: `Welcome`,
                     mediaType: 1,
                     previewType: 0,
                     renderLargerThumbnail: true,
                     thumbnailUrl: profile, // Uses user's profile picture
                     sourceUrl: 'https://sid-bhai.vercel.app',
                  }
               }
            });
         } else if (action === "remove" && config.WELCOME) {
            await sock.sendMessage(id, {
               text: `> Goodbye @${userName} from *${metadata.subject}*.\n> We are now ${membersCount} in the group.\n> Left at: ${currentTime} on ${currentDate}`,
               contextInfo: {
                  mentionedJid: [jid],
                  externalAdReply: {
                     title: `Leave`,
                     mediaType: 1,
                     previewType: 0,
                     renderLargerThumbnail: true,
                     thumbnailUrl: profile, // Uses user's profile picture
                     sourceUrl: 'https://sid-bhai.vercel.app',
                  }
               }
            });
         }
      }
   } catch (e) {
      console.error("GroupParticipants error:", e);
      throw e;
   }
}
