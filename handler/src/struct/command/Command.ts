import Module, { ModuleOptions } from "../Module";
import { Interaction, ApplicationCommandOptionData } from "discord.js";

export interface CommandOptions extends ModuleOptions {
	name: string;
	description?: string;
	group?: string | undefined;
	args?: ApplicationCommandOptionData[];
}

export default abstract class Command extends Module {
	public name: string;
	public description: string;
	public group?: string | undefined;
	public args?: ApplicationCommandOptionData[];

	constructor(
		id: string,
		{
			name,
			description = "",
			category = "default",
			group = undefined,
			args = [],
		}: CommandOptions
	) {
		super(id, {
			category,
		});

		this.name = name;
		this.description = description;
		this.group = group;
		this.args = args;
	}

	abstract exec(interaction: Interaction): any | Promise<any>;
}
