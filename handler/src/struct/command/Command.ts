import Module, { ModuleOptions } from "../Module";
import { Interaction, ApplicationCommandOptionData } from "discord.js";

export interface CommandOptions extends ModuleOptions {
	name: string;
	description?: string;
	group?: string | undefined;
	options?: ApplicationCommandOptionData[];
}

export default abstract class Command extends Module {
	public name: string;
	public description: string;
	public group?: string | undefined;
	public options?: ApplicationCommandOptionData[];

	constructor(
		id: string,
		{
			name,
			description = "",
			category = "default",
			group = undefined,
			options = [],
		}: CommandOptions
	) {
		super(id, {
			category,
		});

		this.name = name;
		this.description = description;
		this.group = group;
		this.options = options;
	}

	abstract exec(interaction: Interaction): any | Promise<any>;
}
