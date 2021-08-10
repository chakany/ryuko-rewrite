import Command from "../../struct/Command";
import {
	CommandInteraction,
	Permissions,
	GuildMemberRoleManager,
} from "discord.js";

export default class TicketCloseCommand extends Command {
	constructor() {
		super("ticketClose", {
			name: "close",
			description: "Close a Ticket",
			category: "ticket",
			clientPermissions: [Permissions.FLAGS.MANAGE_CHANNELS],
		});
	}

	async exec(interaction: CommandInteraction) {
		const ticketResult = await this.client.db.findTicket(
			interaction.guild!.id,
			interaction.channel!.id
		);

		if (!ticketResult)
			return interaction.editReply({
				embeds: [
					this.errorEmbed(
						interaction,
						"Invalid Channel",
						"This is not a ticket channel!"
					),
				],
			});

		const ticketRole = this.client.guildSettings.get(
			interaction.guild!.id,
			"ticketRole",
			null
		);

		if (
			(ticketRole &&
				(<GuildMemberRoleManager>interaction.member!.roles).cache.find(
					(role) => role.id == ticketRole
				)) ||
			(<Readonly<Permissions>>interaction.member!.permissions).has(
				Permissions.FLAGS.MANAGE_CHANNELS
			) ||
			interaction.user.id == ticketResult?.memberId
		) {
			interaction.channel!.delete(
				`Closed by ${interaction.user.tag} at ${new Date().toString()}`
			);

			this.client.db.deleteTicket(
				interaction.guild!.id,
				interaction.user.id,
				interaction.channel!.id
			);
		}
	}
}
