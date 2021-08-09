import {
	CommandInteraction,
	MessageEmbed,
	ButtonInteraction,
	MessageActionRow,
} from "discord.js";
import Client from "./Client";

export default class PaginateEmbed {
	private embed: MessageEmbed;
	public interaction: CommandInteraction;
	private client: Client;
	private formatStyle?: Function;
	private fieldName = "Values";
	private expireTime = 30000;

	constructor(interaction: CommandInteraction, client: any) {
		this.interaction = interaction;
		this.client = client;
		this.embed = new MessageEmbed({});
	}

	private paginate(array: any[], page_size: number, page_number: number) {
		// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
		return array.slice(
			(page_number - 1) * page_size,
			page_number * page_size
		);
	}

	public setExpireTime(time: number) {
		this.expireTime = time;
		return this;
	}

	public getEmbed() {
		return this.embed;
	}

	public format(fn: Function) {
		this.formatStyle = fn;

		return this;
	}

	public setFieldName(name: string) {
		this.fieldName = name;
		return this;
	}

	public async send(array: any[], pageSize: number) {
		let page = 1;
		const pages = Math.trunc(array.length / pageSize) + 1;
		const prePaginated = this.paginate(array, pageSize, page);

		const values: string[] = [];

		for (const value of prePaginated) {
			values.push(await this.formatStyle!(value));
		}

		const preEmbed = new MessageEmbed(this.embed);

		preEmbed.addField(this.fieldName, values.join("\n"));

		this.interaction.editReply({
			content: `Page ${page}/${pages}`,
			embeds: [preEmbed],
			components: [
				new MessageActionRow({
					components: [
						{
							type: "BUTTON",
							label: "Back",
							customId: "back",
							style: "PRIMARY",
							disabled: true,
						},
						{
							type: "BUTTON",
							label: "Forward",
							customId: "forward",
							style: "PRIMARY",
							disabled: page * pageSize >= array.length,
						},
					],
				}),
			],
		});

		const filter = (i: ButtonInteraction) =>
			(i.customId === "back" || i.customId === "forward") &&
			i.user.id === this.interaction.user.id;

		const collector =
			this.interaction.channel!.createMessageComponentCollector({
				filter,
				time: this.expireTime,
			});

		collector.on("collect", async (i) => {
			if (i.customId === "back") {
				page--;
				const paginated = this.paginate(array, pageSize, page);

				const values: string[] = [];

				for (const value of paginated) {
					values.push(await this.formatStyle!(value));
				}

				if (values.length) {
					const embed = new MessageEmbed(this.embed);

					embed.addField(this.fieldName, values.join("\n"));

					await i.update({
						content: `Page ${page}/${pages}`,
						components: [
							new MessageActionRow({
								components: [
									{
										type: "BUTTON",
										label: "Back",
										customId: "back",
										style: "PRIMARY",
										disabled: page == 1,
									},
									{
										type: "BUTTON",
										label: "Forward",
										customId: "forward",
										style: "PRIMARY",
										disabled: false,
									},
								],
							}),
						],
						embeds: [embed],
					});
				} else {
					page++;
					i.deferUpdate();
				}
			} else {
				page++;
				const paginated = this.paginate(array, pageSize, page);

				const values: string[] = [];

				for (const value of paginated) {
					values.push(await this.formatStyle!(value));
				}

				if (values.length) {
					const embed = new MessageEmbed(this.embed);

					embed.addField(this.fieldName, values.join("\n"));

					await i.update({
						content: `Page ${page}/${pages}`,
						components: [
							new MessageActionRow({
								components: [
									{
										type: "BUTTON",
										label: "Back",
										customId: "back",
										style: "PRIMARY",
										disabled: false,
									},
									{
										type: "BUTTON",
										label: "Forward",
										customId: "forward",
										style: "PRIMARY",
										disabled:
											page * pageSize >= array.length,
									},
								],
							}),
						],
						embeds: [embed],
					});
				} else {
					page--;
					i.deferUpdate();
				}
			}
		});

		collector.on("end", async (collected) => {
			await this.interaction.editReply({
				components: [],
			});
		});
	}
}
