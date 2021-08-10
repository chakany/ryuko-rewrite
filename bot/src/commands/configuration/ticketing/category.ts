import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class TicketingCategoryCommand extends Command {
	constructor() {
		super("ticketingCategory", {
			name: "category",
			description:
				"Change the category that Tickets are automatically assigned under",
			category: "configuration",
			group: "ticketing",
			options: [
				{
					name: "category",
					type: "CHANNEL",
					description: "Category to automatically add Tickets to",
				},
			],
			userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		const category = interaction.options.getChannel("category") || null;
		if (category && category!.type !== "GUILD_CATEGORY")
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Options",
						"That is not a Category!"
					),
				],
			});
		const oldCategory = this.client.guildSettings.get(
			interaction.guild!.id,
			"ticketCategory",
			null
		);
		this.client.guildSettings.set(
			interaction.guild!.id,
			"ticketCategory",
			category?.id
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Changed Ticketing Category`,
						fields: [
							{
								name: "Before",
								value: oldCategory
									? `<#${oldCategory}>`
									: "None",
								inline: true,
							},
							{
								name: "After",
								value: category ? category.toString() : "None",
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
					title: `Ticketing Category Changed`,
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
							value: oldCategory ? `<#${oldCategory}>` : "None",
							inline: true,
						},
						{
							name: "After",
							value: category ? category.toString() : "None",
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
