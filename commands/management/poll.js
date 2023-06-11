const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  SlashCommandChannelOption,
  EmbedBuilder,
} = require("discord.js");
var color = 0x5bcefa;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Creates a yes/no poll!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to start the poll in")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("poll")
        .setDescription("The poll's message")
        .setRequired(true)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const message = interaction.options.getString("poll");

    const pollEmbed = new EmbedBuilder()
      .setTitle("A wild poll has transed!")
      .setDescription(message)
      .setColor(color);

    try {
      channel.send({ embeds: [pollEmbed] }).then((msg) => {
        msg.react("👍");
        msg.react("👎");
      });
      switch (color) {
        case 0x5bcefa:
          color = 0xf5a9b8;
          break;
        case 0xf5a9b8:
          color = 0xffffff;
          break;
        case 0xffffff:
          color = 0x5bcefa;
          break;
      }
      interaction.reply({ content: "Poll created!", ephemeral: true });
    } catch (err) {
      interaction.reply({
        content: "There was an error sending the message!",
        ephemeral: true,
      });
    }
  },
};
