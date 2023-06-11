const {
  ApplicationCommandType,
  EmbedBuilder,
  ContextMenuCommandBuilder,
} = require("discord.js");
const cooldown = 24 * 60 * 60 * 1000; //24 hours converted to miliseconds
const src = require("../../src/src.json");
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("validify")
    .setType(ApplicationCommandType.User),
  async execute(interaction, validatedPeople) {
    if (validatedPeople.has(interaction.user.id)) {
      return interaction.reply({
        content: "You may only use this command once per 20hours!",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Validity gang call!")
      .setDescription(
        `# <@${interaction.targetId}> has been reported to lack validation!`
      )
      .setColor(0xffffff)
      .setTimestamp();

    const channel = await interaction.guild.channels.cache.get(
      src.validationChannel
    );

    channel.send({ content: `<@&${src.validationGangRole}>`, embeds: [embed] });

    interaction.reply({
      content: "Your report has been posted!",
      ephemeral: true,
    });

    validatedPeople.add(interaction.user.id);
    setTimeout(() => {
      validated.delete(interaction.user.id);
    }, cooldown);
  },
};
