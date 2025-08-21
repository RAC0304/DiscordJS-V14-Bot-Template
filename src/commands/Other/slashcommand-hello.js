const { ChatInputCommandInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
  command: {
    name: "hello",
    description: "Reply with a hello message.",
  },
  /**
   * @param {DiscordBot} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: "Hello Mok",
    });
  },
}).toJSON();
