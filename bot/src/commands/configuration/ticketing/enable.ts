import Command from "../../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class TicketingEnableCommand extends Command {
	constructor() {
		super("ticketingEnable", {
			name: "enable",
			description: "Enable Ticketing",
			category: "configuration",
			group: "ticketing",
			clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
			userPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		this.client.guildSettings.set(interaction.guild!.id, "tickets", true);

		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `${this.client.emoji.greenCheck} Enabled Ticketing`,
						description: "Ticketing has been Enabled",
					},
					interaction.user,
					interaction.guild!
				),
			],
		});

		this.client.sendToLog(
			this.embed(
				{
					title: `Ticketing Enabled`,
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
