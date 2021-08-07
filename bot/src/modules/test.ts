import { Module } from "@ryuko/handler";

export default class TestModule extends Module {
	constructor() {
		super("test", {
			category: "myCategory",
		});
	}
}
