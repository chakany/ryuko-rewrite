import Handler from "./Handler";
import Client from "./Client";
import { Collection } from "discord.js";

export interface ModuleOptions {
	category?: string;
}

export default class Module {
	public id: string;
	public categoryId: string;

	public client: Client | undefined;
	public handler: Handler | undefined;
	public category: Collection<string, Module> | undefined;

	constructor(id: string, { category = "default" }: ModuleOptions) {
		this.id = id;
		this.categoryId = category;

		this.client = undefined;
		this.handler = undefined;
		this.category = undefined;
	}
}
