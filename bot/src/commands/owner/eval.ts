import Command from "../../struct/Command";
import { CommandInteraction, MessageEmbed } from "discord.js";

export default class EvalCommand extends Command {
	constructor() {
		super("eval", {
			name: "eval",
			description: "Evaluate JavaScript on the bot's behalf",
			category: "owner",
			options: [
				{
					name: "input",
					type: "STRING",
					description: "JavaScript to Evaluate",
					required: true,
				},
			],
		});
	}

	private clean(text: string) {
		if (typeof text === "string")
			return text
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203));
		else return text;
	}

	async exec(interaction: CommandInteraction) {
		try {
			const code = interaction.options.getString("input")!;
			let evaled = await eval(code);

			if (typeof evaled !== "string")
				evaled = require("util").inspect(evaled);

			interaction.editReply({
				embeds: [
					this.embed(
						{
							title: "Eval Result",
							description: `\`\`\`xl\n${this.clean(
								evaled
							)}\`\`\``,
						},
						interaction.user,
						interaction.guild!
					),
				],
			});
		} catch (error) {
			interaction.editReply({
				embeds: [
					this.embed(
						{
							title: "Eval Error",
							description: `\`\`\`xl\n${error}\`\`\``,
						},
						interaction.user,
						interaction.guild!
					),
				],
			});
		}
	}
}
