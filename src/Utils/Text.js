export function truncateText(text, limit) {
	if (text.length > limit) {
		return text.substring(0, limit) + "...";
	}
	return text;
}

export function sanitizeText(text) {
	return text.replace(/[^a-zA-Z0-9._-]/gi, "");
}

export function generateText(limit) {
	let apl = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	let res = "";
	for (let i = 0; i < limit; i++) {
		res += apl[Math.floor(Math.random() * apl.length)];
	}
	return res;
}
