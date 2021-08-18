import express from "express";

const { supportInvite } = require("../../config.json");

import { manager, weblog as log, user } from "../index";

const router = express.Router();
router.get("/", async function (req, res) {
	try {
		res.render("index", {
			totalServers: (
				await manager.fetchClientValues("guilds.cache.size")
			).reduce((acc: any, guildCount) => acc + guildCount, 0),
			totalUsers: (
				await manager.fetchClientValues("users.cache.size")
			).reduce((acc: any, guildCount) => acc + guildCount, 0),
			avatar: user.avatarURL,
			username: user.username,
			support: supportInvite,
			invite: `https://discord.com/oauth2/authorize?client_id=${user.id}&permissions=8&scope=bot`,
		});
	} catch (err) {
		log.error(err);
		return res.status(500).render("error", {
			username: user.username,
			avatar: user.avatarURL,
			code: 500,
			description: "Internal Server Error",
		});
	}
});

export default router;
