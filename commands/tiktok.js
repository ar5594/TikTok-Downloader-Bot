const { 
    EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, 
    ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, MessageFlags 
} = require('discord.js');
const axios = require('axios');

const BRAND_COLOR = 0x12B5B5; 
const urlDatabase = new Map();

const formatCount = (num) => {
    return num >= 1000000 ? (num / 1000000).toFixed(1) + 'M' : 
           num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num || 0;
};

module.exports = {
    async handleInteraction(interaction, config, client) {
        
        // 1. URL Input System (Modal)
        if (interaction.isButton() && interaction.customId === 'open_tiktok_modal') {
            const modal = new ModalBuilder()
                .setCustomId('tiktok_modal')
                .setTitle(`Media Retrieval Terminal`);

            const urlInput = new TextInputBuilder()
                .setCustomId('tiktok_url')
                .setLabel("TIKTOK VIDEO URL")
                .setPlaceholder("Paste the link here...")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(urlInput));
            return await interaction.showModal(modal);
        }

        // 2. Search Results Display (Ephemeral)
        if (interaction.type === InteractionType.ModalSubmit && interaction.customId === 'tiktok_modal') {
            const url = interaction.fields.getTextInputValue('tiktok_url');
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            try {
                const res = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
                const data = res.data.data;
                
                if (!data) {
                    return await interaction.editReply("<:off:1491665077928198154> **Error:** Secure link bypass failed or video is private.");
                }

                urlDatabase.set(data.id, url);

                const resultEmbed = new EmbedBuilder()
                    .setAuthor({ name: `@${data.author.unique_id}`, iconURL: data.author.avatar })
                    .setTitle(data.title ? (data.title.substring(0, 80) + "...") : "Asset Identified")
                    .addFields(
                        { name: '📊 Video Stats', value: `❤ **${formatCount(data.digg_count)}** | 💬 **${formatCount(data.comment_count)}** | 👁 **${formatCount(data.play_count)}**`, inline: true }
                    )
                    .setImage(data.cover)
                    .setColor(BRAND_COLOR)
                    .setFooter({ text: `Select extraction protocol` });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`dl_no|${data.id}`).setLabel(`No Watermark`).setStyle(ButtonStyle.Success).setEmoji('🎞️'),
                    new ButtonBuilder().setCustomId(`dl_hd|${data.id}`).setLabel(`HD Quality`).setStyle(ButtonStyle.Primary).setEmoji('💎'),
                    new ButtonBuilder().setCustomId(`dl_wm|${data.id}`).setLabel(`With Watermark`).setStyle(ButtonStyle.Secondary).setEmoji('🏷️'),
                    new ButtonBuilder().setCustomId(`dl_mp3|${data.id}`).setLabel(`Audio Only`).setStyle(ButtonStyle.Danger).setEmoji('🎵')
                );

                await interaction.editReply({ embeds: [resultEmbed], components: [row] });
            } catch (err) {
                await interaction.editReply("<:off:1491665077928198154> **System Failure:** Remote server connection error.");
            }
        }

        // 3. Final Execution and Delivery
        if (interaction.isButton() && interaction.customId.startsWith('dl_')) {
            const [action, videoId] = interaction.customId.split('|');
            const originalUrl = urlDatabase.get(videoId);

            if (!originalUrl) return interaction.reply({ content: "<:off:1491665077928198154> **Session Expired.**", flags: [MessageFlags.Ephemeral] });

            await interaction.update({ 
                content: "<:blackcat:1316869235351355424> **Processing request...**", 
                embeds: [], 
                components: [] 
            });

            try {
                const res = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(originalUrl)}`);
                const v = res.data.data;

                if (!v) throw new Error("API_ERROR");

                let fileUrl, ext, typeLabel;
                
                switch(action) {
                    case 'dl_mp3':
                        fileUrl = v.music; ext = 'mp3'; typeLabel = 'MP3 Audio';
                        break;
                    case 'dl_hd':
                        fileUrl = v.hdplay || v.play; ext = 'mp4'; typeLabel = 'HD MP4';
                        break;
                    case 'dl_wm':
                        fileUrl = v.wmplay || v.play; ext = 'mp4'; typeLabel = 'Watermarked';
                        break;
                    default:
                        fileUrl = v.play; ext = 'mp4'; typeLabel = 'Standard';
                }

                const target = config.sendToDM ? interaction.user : await client.channels.fetch(config.logsChannelId);

                const successEmbed = new EmbedBuilder()
                    .setAuthor({ name: 'Download Ready', iconURL: v.author.avatar })
                    .setColor(BRAND_COLOR)
                    .addFields(
                        { name: '👤 User', value: `${interaction.user}`, inline: true },
                        { name: '📦 Format', value: `\`${typeLabel}\``, inline: true },
                        { name: '🎬 Creator', value: `[@${v.author.unique_id}](https://tiktok.com/@${v.author.unique_id})`, inline: true },
                        { name: '🔗 Links', value: `[Video Source](${originalUrl}) • [Direct Download](${fileUrl})` }
                    )
                    .setTimestamp();

                await target.send({
                    content: `${interaction.user}`,
                    embeds: [successEmbed],
                    files: [{ attachment: fileUrl, name: `vmd_${videoId}.${ext}` }]
                });

                await interaction.deleteReply().catch(() => {});

            } catch (err) {
                await interaction.editReply({ 
                    content: "<:off:1491665077928198154> **Protocol Error:** Failed to fetch asset.", 
                    components: [] 
                }).catch(() => {});
            }
        }
    }
};
