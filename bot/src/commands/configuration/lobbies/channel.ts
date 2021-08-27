import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class LobbyChannelCommand extends Command {
	constructor() {
		super("lobbyChannel", {
			name: "channel",
			description:
				"Change the channel that Members will join to create a new lobby",
			category: "configuration",
			group: "lobbies",
			options: [
				{
					name: "channel",
					type: "CHANNEL",
					description:
						"Channel that Members will join to create a new Lobby",
					required: true,
				},
			],
			userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		const channel = interaction.options.getChannel("channel");
		if (channel?.type !== "GUILD_VOICE")
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Options",
						"That is not a Voice Channel!"
					),
				],
			});
		const oldChannel = this.client.guildSettings.get(
			interaction.guild!.id,
			"voiceLobbyChannel",
			null
		);
		this.client.guildSettings.set(
			interaction.guild!.id,
			"voiceLobbyChannel",
			channel!.id
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Changed Lobby Channel`,
						fields: [
							{
								name: "Before",
								value: oldChannel ? `<#${oldChannel}>` : "None",
								inline: true,
							},
							{
								name: "After",
								value: channel ? channel.toString() : "None",
								inline: true,
							},
						],
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Lobby Channel Changed`,
					footer: {},
					timestamp: new Date(),
					thumbnail: {
						url: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
					fields: [
						{
							name: "Before",
							value: oldChannel ? `<#${oldChannel}>` : "None",
							inline: true,
						},
						{
							name: "After",
							value: channel ? channel.toString() : "None",
							inline: true,
						},
						{
							name: "Changed By",
							value: interaction.member!.toString(),
						},
					],
				},
				interaction.user,
				interaction.guild!
			),
			interaction.guild!
		);
	}
}
