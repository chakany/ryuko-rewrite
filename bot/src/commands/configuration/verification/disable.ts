import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class VerificationDisableCommand extends Command {
	constructor() {
		super("verificationDisable", {
			name: "disable",
			description: "Disable Verification",
			category: "configuration",
			group: "verification",
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
		});
	}

	async exec(interaction: CommandInteraction) {
		this.client.guildSettings.set(
			interaction.guild!.id,
			"verification",
			false
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Disabled Verification`,
						description: "Verification has been Disabled",
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Verification Disabled`,
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
