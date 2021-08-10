import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class TicketingDisableCommand extends Command {
	constructor() {
		super("ticketingDisable", {
			name: "disable",
			description: "Disable Ticketing",
			category: "configuration",
			group: "ticketing",
			userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		this.client.guildSettings.set(interaction.guild!.id, "tickets", false);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Disabled Ticketing`,
						description: "Ticketing has been Disabled",
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Ticketing Disabled`,
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
