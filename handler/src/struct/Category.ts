import { Collection } from "discord.js";
import Module from "./Module";

export default class Category extends Collection<string, Module> {
	public id: string;

	constructor(id: string) {
		super();

		this.id = id;
	}
}
