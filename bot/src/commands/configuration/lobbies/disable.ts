import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class LobbyDisableCommand extends Command {
	constructor() {
		super("lobbyDisable", {
			name: "disable",
			description: "Disable Lobbies",
			category: "configuration",
			group: "lobbies",
			userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		this.client.guildSettings.set(
			interaction.guild!.id,
			"voiceLobbies",
			false
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Disabled Voice Lobbies`,
						description: "Voice Lobbies have been Disabled",
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Voice Lobbies Disabled`,
					footer: {},
					timestamp: new Date(),
					thumbnail: {
						url: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
					fields: [
						{
							name: "Disabled By",
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
