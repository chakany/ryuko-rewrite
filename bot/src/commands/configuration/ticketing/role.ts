import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class TicketingRoleCommand extends Command {
	constructor() {
		super("ticketingRole", {
			name: "role",
			description:
				"Change the role that is automatically assigned to Tickets",
			category: "configuration",
			group: "ticketing",
			options: [
				{
					name: "role",
					type: "ROLE",
					description: "Role to be automatically added to Tickets",
				},
			],
			userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		const role = interaction.options.getRole("role") || null;
		const oldRole = this.client.guildSettings.get(
			interaction.guild!.id,
			"ticketRole",
			null
		);
		this.client.guildSettings.set(
			interaction.guild!.id,
			"ticketRole",
			role?.id
		);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Changed Ticketing Role`,
						fields: [
							{
								name: "Before",
								value: oldRole ? `<@&${oldRole}>` : "None",
								inline: true,
							},
							{
								name: "After",
								value: role ? role.toString() : "None",
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
					title: `Ticketing Role Changed`,
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
							value: role ? role.toString() : "None",
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
