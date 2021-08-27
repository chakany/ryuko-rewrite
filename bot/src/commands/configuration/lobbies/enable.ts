import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class LobbyEnableCommand extends Command {
	constructor() {
		super("lobbyEnable", {
			name: "enable",
			description: "Enable Lobbies",
			category: "configuration",
			group: "lobbies",
			userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
			clientPermissions: [
				Permissions.FLAGS.MANAGE_CHANNELS,
				Permissions.FLAGS.MOVE_MEMBERS,
			],
		});
	}

	async exec(interaction: CommandInteraction) {
		this.client.guildSettings.set(
			interaction.guild!.id,
			"voiceLobbies",
			true
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Enabled Voice Lobbies`,
						description: "Voice Lobbies have been Enabled",
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Voice Lobbies Enabled`,
					footer: {},
					timestamp: new Date(),
					thumbnail: {
						url: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
					fields: [
						{
							name: "Enabled By",
							value: interaction.member!.toString(),
							inline: true,
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
