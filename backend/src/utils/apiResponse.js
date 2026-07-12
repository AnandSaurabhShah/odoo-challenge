export function sendSuccess(res, { statusCode = 200, message, data, meta } = {}) {
	const payload = {
		success: true,
	};

	if (message) {
		payload.message = message;
	}

	if (data !== undefined) {
		payload.data = data;
	}

	if (meta !== undefined) {
		payload.meta = meta;
	}

	return res.status(statusCode).json(payload);
}

export function sendError(res, { statusCode = 500, message = "Internal Server Error", details } = {}) {
	const payload = {
		success: false,
		message,
	};

	if (details !== undefined) {
		payload.details = details;
	}

	return res.status(statusCode).json(payload);
}

