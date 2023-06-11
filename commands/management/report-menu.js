const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
} = require("discord.js");
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("report")
    .setType(ApplicationCommandType.User),
  async execute(interaction) {},
};
