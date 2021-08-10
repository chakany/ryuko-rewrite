import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class VerificationEnableCommand extends Command {
	constructor() {
		super("verificationEnable", {
			name: "enable",
			description: "Enable Verification",
			category: "configuration",
			group: "verification",
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
		});
	}

	async exec(interaction: CommandInteraction) {
		this.client.guildSettings.set(
			interaction.guild!.id,
			"verification",
			true
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Enabled Verification`,
						description: "Verification has been Enabled",
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Verification Enabled`,
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
