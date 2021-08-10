import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class FilterRemoveCommand extends Command {
	constructor() {
		super("filterRemove", {
			name: "remove",
			description: "Remove a phrase from the Filter",
			category: "moderation",
			group: "filter",
			options: [
				{
					name: "phrase",
					description: "Phrase to Remove",
					type: "STRING",
					required: true,
				},
			],
			clientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
			userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
		});
	}

	async exec(interaction: CommandInteraction) {
		const phrase = interaction.options.getString("phrase")!;

		await this.client.db.removePhrase(interaction.guild!.id, phrase);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Removed Phrase`,
						fields: [
							{
								name: "Phrase",
								value: `\`${phrase}\``,
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
					title: `Phrase removed from Filter`,
					footer: {},
					timestamp: new Date(),
					thumbnail: {
						url: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
					fields: [
						{
							name: "Removed By",
							value: interaction.member!.toString(),
							inline: true,
						},
						{
							name: "Phrase",
							value: `\`${phrase}\``,
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
