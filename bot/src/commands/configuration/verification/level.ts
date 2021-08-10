import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class VerificationDisableCommand extends Command {
	constructor() {
		super("verificationLevel", {
			name: "level",
			description: "Change the Verification Level",
			category: "configuration",
			group: "verification",
			options: [
				{
					name: "level",
					type: "STRING",
					description:
						"Strict bans all alts, Medium bans all alts that have active punishments, and Low does not ban at all",
					required: true,
					choices: [
						{
							name: "Strict",
							value: "strict",
						},
						{
							name: "Medium",
							value: "medium",
						},
						{
							name: "Low",
							value: "low",
						},
					],
				},
			],
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
		});
	}

	async exec(interaction: CommandInteraction) {
		const level = interaction.options.getString("level");
		const oldLevel = this.client.guildSettings.get(
			interaction.guild!.id,
			"verificationLevel",
			"low"
		);

		this.client.guildSettings.set(
			interaction.guild!.id,
			"verificationLevel",
			level
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Changed Verification Level`,
						fields: [
							{
								name: "Before",
								value:
									oldLevel!.charAt(0).toUpperCase() +
									oldLevel!.slice(1),
								inline: true,
							},
							{
								name: "After",
								value:
									level!.charAt(0).toUpperCase() +
									level!.slice(1),
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
					title: `Verification Level Changed`,
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
							value:
								oldLevel!.charAt(0).toUpperCase() +
								oldLevel!.slice(1),
							inline: true,
						},
						{
							name: "After",
							value:
								level!.charAt(0).toUpperCase() +
								level!.slice(1),
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
