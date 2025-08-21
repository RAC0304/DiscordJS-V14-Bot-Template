const {
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../../responses.json");

function loadResponses() {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return [];
}

function saveResponse(pattern, reply) {
  let data = loadResponses();
  data.push({ pattern, reply });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = new ApplicationCommand({
  command: {
    name: "addresponse",
    description: "Tambah respons chatbot baru (regex, hanya untuk admin)",
    type: 1,
    options: [
      {
        name: "pattern",
        description: "Regex pertanyaan (misal: halo|hai)",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "reply",
        description: "Jawaban bot",
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
    const pattern = interaction.options.getString("pattern");
    const reply = interaction.options.getString("reply");
    saveResponse(pattern, reply);
    await interaction.reply({
      content: `Respons baru ditambahkan!\nPattern: \\${pattern}\\nReply: ${reply}`,
    });
  },
}).toJSON();
