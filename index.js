const src = require("./src/src.json");
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  EmbedBuilder,
} = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
});

//set for recently validated people
var validatedPeople = new Set();

//commands
client.commands = new Collection();
const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[WARNING] ${filePath} is incomplete!`);
    }
  }
}

const rest = new REST().setToken(src.token);
//--commands

client.on("ready", () => {
  //Deploy commands
  (async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );
      const data = await rest.put(
        Routes.applicationGuildCommands(src.clientId, src.testGuildID),
        { body: commands }
      );
      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  })();

  console.log(`${client.user.username} is now online!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand())
    return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    switch (interaction.commandName) {
      case "deploy":
        command.execute(interaction, commands);
        break;
      case "validate":
        command.execute(interaction, validatedPeople);
        break;
      case "validify":
        command.execute(interaction, validatedPeople);
        break;
      default:
        await command.execute(interaction);
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isModalSubmit()) return;
  switch (interaction.customId) {
    case "reportModal":
      const reportChannel = interaction.guild.channels.cache.get(
        src.reportChannelId
      );
      if (!reportChannel) return;
      const reportEmbed = new EmbedBuilder()
        .setTitle("Report")
        .setDescription(
          `
          **Target:** <@${interaction.fields.getTextInputValue("targetInput")}>
          **Reason:** ${interaction.fields.getTextInputValue("reasonInput")}
        `
        )
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
        })
        .setTimestamp();

      reportChannel.send({ embeds: [reportEmbed] });
      interaction.reply({
        content: "Thank you for submitting a report!",
        ephemeral: true,
      });
      break;
  }
});

//Startup logging
require("./src/handlers/logHandler.js")(client);

client.login(src.token);
