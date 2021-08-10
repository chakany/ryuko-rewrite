import Command from "../../struct/Command";
import { CommandInteraction, Permissions } from "discord.js";

export default class InviteCommand extends Command {
	constructor() {
		super("invite", {
			name: "invite",
			description: "Invite me to your Server!",
			category: "info",
		});
	}

	async exec(interaction: CommandInteraction) {
		interaction.editReply({
			embeds: [
				this.embed(
					{
						title: `Invite ${this.client.user?.username}`,
						thumbnail: {
							url: this.client.user?.displayAvatarURL({
								dynamic: true,
							}),
						},
						description: `Thank you for considering ${this.client.user?.username} for your server!`,
					},
					interaction.user,
					interaction.guild!
				),
			],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							label: "Invite Me!",
							type: "BUTTON",
							style: "LINK",
							url: this.client.invite(),
						},
						{
							label: "Get Support",
							type: "BUTTON",
							style: "LINK",
							url: this.client.config.supportInvite,
						},
						{
							label: "Read Wiki",
							type: "BUTTON",
							style: "LINK",
							url: this.client.config.siteUrl + "/wiki",
						},
					],
				},
			],
		});
	}
}
