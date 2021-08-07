import { EventEmitter } from "events";

export function isEventEmitter(value: EventEmitter | any): boolean {
	return (
		value &&
		typeof value.on == "function" &&
		typeof value.emit == "function"
	);
}
