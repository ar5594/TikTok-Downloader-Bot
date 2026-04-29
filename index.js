const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    SlashCommandBuilder, 
    PermissionFlagsBits, 
    MessageFlags,
    ActivityType 
} = require('discord.js');
const fs = require('fs'); 
const config = require('./config.json');

if (!config.guilds) config.guilds = {};

const tiktokModule = require('./commands/tiktok.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const STATUS_ON = '<:on:1491665059389112382>';
const FINAL_IMAGE_URL = 'https://cdn.discordapp.com/attachments/990775602359468043/1492224775588937809/Gemini_Generated_Image_tgnjw5tgnjw5tgnj.png';

function saveConfig() {
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
}

function buildInterface() {
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('open_tiktok_modal')
            .setEmoji('<:tiktok:1491662074177257564>')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!config.features.tiktok.enabled)
    );

    const botName = client.user.username;

    const embed = new EmbedBuilder()
        .setAuthor({ name: botName, iconURL: client.user.displayAvatarURL() })
        .setDescription(
            `### Welcome to **${botName}**\n` +
            `Click the button below <:tiktok:1491662074177257564> and paste the **TikTok link** you want to download, then choose your preferred format.\n\n` +
            `*Beta Version - Under Development*\n\n` + 
            `> ${STATUS_ON} \`TikTok Core Operational\``
        )
        .setImage(FINAL_IMAGE_URL)
        .setColor(0x12B5B5)
        .setFooter({ text: `💡 Tip: Using HD quality will result in a larger file size but better clarity.` });

    return { embed, rows: [row1] };
}

client.once('clientReady', async () => {
    client.user.setPresence({
        activities: [{ 
            name: '/setup・by (r.vu)', 
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/discord' 
        }],
        status: 'online',
    });

    const commands = [
        new SlashCommandBuilder().setName('setup').setDescription('Deploy the interface').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder().setName('setlogs').setDescription('Configure delivery channel')
            .addChannelOption(opt => opt.setName('channel').setDescription('Target channel').setRequired(true))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log(`[READY] ${client.user.username} is now operational.`);
    } catch (error) {
        console.error("[SYSTEM] Command registration error:", error);
    }
});

client.on('interactionCreate', async interaction => {
    try {
        const guildId = interaction.guildId;
        if (!guildId) return; 

        if (!config.guilds[guildId]) config.guilds[guildId] = {};

        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'setlogs') {
                const newChannel = interaction.options.getChannel('channel');
                config.guilds[guildId].logsChannelId = newChannel.id;
                saveConfig();
                return interaction.reply({ content: `✅ **Logs for this server re-routed to:** ${newChannel}`, flags: [MessageFlags.Ephemeral] });
            }

            if (interaction.commandName === 'setup') {
                const { embed, rows } = buildInterface();
                config.guilds[guildId].fixedChannelId = interaction.channelId;
                saveConfig();
                
                await interaction.reply({ content: "Deploying Terminal...", flags: [MessageFlags.Ephemeral] });
                return await interaction.channel.send({ embeds: [embed], components: rows });
            }
        }

        const cid = interaction.customId || "";

        if (cid.includes('tiktok') || (interaction.isModalSubmit() && cid === 'tiktok_modal') || cid.startsWith('dl_')) {
            if (!config.features.tiktok.enabled) return;

            const serverLogsId = config.guilds[guildId]?.logsChannelId;
            
            if (!serverLogsId) {
                return interaction.reply({ content: "❌ **Configuration Error:** Please use `/setlogs` first.", flags: [MessageFlags.Ephemeral] });
            }

            const serverConfig = {
                ...config,
                logsChannelId: serverLogsId
            };

            return await tiktokModule.handleInteraction(interaction, serverConfig, client);
        }

    } catch (error) { 
        console.error("[INTERACTION ERROR]:", error); 
    }
});

client.login(config.token);
