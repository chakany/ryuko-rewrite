import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class FilterAddCommand extends Command {
	constructor() {
		super("filterAdd", {
			name: "add",
			description: "Add a phrase to the Filter",
			category: "moderation",
			group: "filter",
			options: [
				{
					name: "phrase",
					description: "Phrase to Add",
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

		await this.client.db.addPhrase(interaction.guild!.id, phrase);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Added Phrase`,
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
					title: `Phrase added to Filter`,
					footer: {},
					timestamp: new Date(),
					thumbnail: {
						url: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
					fields: [
						{
							name: "Added By",
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
