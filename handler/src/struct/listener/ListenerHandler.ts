import Handler, { HandlerOptions } from "../Handler";
import Listener from "./Listener";
import { EventEmitter } from "events";
import { Collection } from "discord.js";
import { isEventEmitter } from "../../Util";

export interface ListenerHandlerOptions extends HandlerOptions {}

export default class ListenerHandler extends Handler {
	public emitters: Collection<string, EventEmitter>;

	constructor(
		dir: string,
		{ client, extensions = [".ts", ".js"] }: ListenerHandlerOptions
	) {
		super(dir, {
			client,
			extensions,
			classToHandle: Listener,
		});

		this.emitters = new Collection();
		this.emitters.set("client", client);
	}

	register(listener: Listener) {
		super.register(listener);
		listener.exec = listener.exec.bind(listener);

		this.addToEmitter(listener.id);
		return listener;
	}

	private addToEmitter(id: string) {
		const listener = this.modules.get(id) as Listener | undefined;

		if (!listener) throw new Error(`Listener ${id} Not Found`);

		const emitter = isEventEmitter(listener.emitter)
			? listener.emitter
			: this.emitters.get(listener.emitter);

		if (!isEventEmitter(emitter))
			throw new TypeError(
				`Emitter ${listener.emitter} is not an Emitter`
			);

		if (listener.type == "once") {
			(<EventEmitter>emitter).once(listener.event, listener.exec);
			return listener;
		}

		(<EventEmitter>emitter).on(listener.event, listener.exec);
		return listener;
	}
}
