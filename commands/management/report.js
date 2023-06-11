const {
  SlashCommandBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Reports targeted user!")
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("Who are you trying to report?")
        .setRequired(true)
    ),
  async execute(interaction) {
    const target =
      (await interaction.options.getUser("target")) ||
      (await interaction.guild.members.cache.get(interaction.targetId).user);

    const modal = new ModalBuilder()
      .setCustomId("reportModal")
      .setTitle(`Report ${target.username}`);

    const targetInput = new TextInputBuilder()
      .setCustomId("targetInput")
      .setLabel("Target ID:")
      .setValue(target.id)
      .setMaxLength(20)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const reasonInput = new TextInputBuilder()
      .setCustomId("reasonInput")
      .setLabel("What are you reporting the user for?")
      .setMaxLength(250)
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    const firstRow = new ActionRowBuilder().addComponents(targetInput);
    const secondRow = new ActionRowBuilder().addComponents(reasonInput);

    modal.addComponents(firstRow, secondRow);
    interaction.showModal(modal);
  },
};
