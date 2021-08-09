import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class FilterDisableCommand extends Command {
	constructor() {
		super("filterDisable", {
			name: "disable",
			description: "Disable the Filter",
			category: "moderation",
			group: "filter",
			options: [
				{
					name: "reason",
					description:
						"Add a reason for why you are disabling the filter, this will appear in logs.",
					type: "STRING",
					required: false,
				},
			],
			clientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
			userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
		});
	}

	async exec(interaction: CommandInteraction) {
		this.client.guildSettings.set(interaction.guild!.id, "filter", false);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Disabled Filter`,
						description: "The Filter has been Disabled",
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Filter Disabled`,
					footer: null!,
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
						{
							name: "Reason",
							value: interaction.options.getString("reason")
								? `\`${interaction.options.getString(
										"reason"
								  )}\``
								: "No Reason Provided",
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
