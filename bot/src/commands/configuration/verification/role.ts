import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class VerificatioRoleCommand extends Command {
	constructor() {
		super("verificationRole", {
			name: "role",
			description: "Set the Verified Role",
			category: "configuration",
			group: "verification",
			options: [
				{
					name: "role",
					type: "ROLE",
					required: true,
					description:
						"Role to be given to Members after Verification",
				},
			],
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
		});
	}

	async exec(interaction: CommandInteraction) {
		const oldRole = this.client.guildSettings.get(
			interaction.guild!.id,
			"verificationRole",
			null
		);
		const role = interaction.options.getRole("role");

		this.client.guildSettings.set(
			interaction.guild!.id,
			"verificationRole",
			role!.id
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Changed Verified Role`,
						fields: [
							{
								name: "Before",
								value: oldRole ? `<@&${oldRole}>` : "None",
								inline: true,
							},
							{
								name: "After",
								value: role!.toString(),
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
					title: `Verified Role Changed`,
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
							value: oldRole ? `<@&${oldRole}>` : "None",
							inline: true,
						},
						{
							name: "After",
							value: role!.toString(),
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
