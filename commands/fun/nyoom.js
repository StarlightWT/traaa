const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("nyoom")
    .setDescription("Replies with Nyoom!"),
  async execute(interaction) {
    const start = Date.now();
    await interaction
      .reply({ content: "# Nyoom!", ephemeral: true })
      .then(() => {
        calculatedPing = Date.now() - start;
      });

    console.warn(`[PING CHECK] Ping: ${calculatedPing}ms`);
  },
};
