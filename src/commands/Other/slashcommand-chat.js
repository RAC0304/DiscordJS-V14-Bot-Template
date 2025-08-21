const {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fs = require("fs");
const path = require("path");

function simpanPercakapan(userId, pesanUser, balasanBot) {
  const filePath = path.join(__dirname, "../../../chatlog.json");
  let data = [];
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  data.push({
    userId,
    pesanUser,
    balasanBot,
    waktu: new Date().toISOString(),
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Percakapan disimpan:", filePath);
}

function loadDynamicResponses() {
  const filePath = path.join(__dirname, "../../../responses.json");
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
}

// Simple rule-based chatbot responses
const responses = [
  { pattern: /halo|hai|hello/i, reply: "Halo juga! 👋" },
  { pattern: /apa kabar/i, reply: "Aku baik, terima kasih! Kamu gimana?" },
  {
    pattern: /siapa kamu/i,
    reply: "Aku adalah bot Discord sederhana buatanmu!",
  },
  { pattern: /terima kasih|makasih/i, reply: "Sama-sama! 😊" },
  // Tambahkan pola dan balasan lain sesuai kebutuhan
];

module.exports = new ApplicationCommand({
  command: {
    name: "chat",
    description: "Ngobrol dengan bot sederhana (tanpa AI)",
    type: 1,
    options: [
      {
        name: "pesan",
        description: "Apa yang ingin kamu tanyakan?",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const pesan = interaction.options.getString("pesan", true).toLowerCase();
    let found = false;
    let balasan = `<@${interaction.user.id}>! `; // Sapa user
    let customReply = "Maaf, aku belum mengerti pertanyaan itu.";

    // Cek ke responses bawaan
    for (const rule of responses) {
      if (rule.pattern.test(pesan)) {
        customReply = rule.reply;
        await interaction.reply({ content: customReply + balasan });
        found = true;
        break;
      }
    }

    // Jika belum ditemukan, cek ke responses dinamis dari file
    if (!found) {
      const dynamic = loadDynamicResponses();
      for (const rule of dynamic) {
        try {
          const regex = new RegExp(rule.pattern, "i");
          if (regex.test(pesan)) {
            customReply = rule.reply;
            await interaction.reply({ content: balasan + customReply });
            found = true;
            break;
          }
        } catch (e) {
          // skip jika regex error
        }
      }
    }

    if (!found) {
      await interaction.reply({
        content: balasan + customReply,
      });
    }
    // Simpan percakapan setiap kali user chat
    simpanPercakapan(interaction.user.id, pesan, balasan + customReply);
  },
}).toJSON();
