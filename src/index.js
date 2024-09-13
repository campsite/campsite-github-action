const core = require("@actions/core");
const axios = require("axios");

async function run() {
	try {
		const apiKey = core.getInput("api_key", { required: true });
		const actionType = core.getInput("action_type", { required: true });
		const content = core.getInput("content", { required: true });

		const axiosInstance = axios.create({
			baseURL: "https://api.campsite.com/v2",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
		});

		let response;

		if (actionType === "create_post") {
			const title = core.getInput("title");
			const channelId = core.getInput("channel_id");

			const postData = {
				title: title,
				content_markdown: content,
				channel_id: channelId,
			};

			try {
				response = await axiosInstance.post("/posts", postData);
			} catch (err) {
				console.error(
					`Campsite API call failed. Attempted to POST payload: ${JSON.stringify(
						postData
					)}`
				);

				if (err.response) {
					core.setFailed(err.response.data);
				} else {
					core.setFailed(err.message);
				}
				return;
			}

			core.setOutput("post_id", response.data.id);
			core.setOutput("post_url", response.data.url);
		} else if (actionType === "create_comment") {
			const postId = core.getInput("post_id", { required: true });
			const parentId = core.getInput("parent_id");

			const commentData = {
				content_markdown: content,
				parent_id: parentId,
			};

			try {
				response = await axiosInstance.post(
					`/posts/${postId}/comments`,
					commentData
				);
			} catch (err) {
				console.error(
					`Campsite API call failed. Attempted to POST payload: ${JSON.stringify(
						commentData
					)}`
				);

				if (err.response) {
					core.setFailed(err.response.data);
				} else {
					core.setFailed(err.message);
				}

				return;
			}

			core.setOutput("comment_id", response.data.id);
		} else if (actionType === "create_message") {
			const threadId = core.getInput("thread_id", { required: true });

			const messageData = {
				content_markdown: content,
			};

			try {
				response = await axiosInstance.post(
					`/threads/${threadId}/messages`,
					messageData
				);
			} catch (err) {
				console.error(
					`Campsite API call failed. Attempted to POST payload: ${JSON.stringify(
						messageData
					)}`
				);

				if (err.response) {
					core.setFailed(err.response.data);
				} else {
					core.setFailed(err.message);
				}

				return;
			}

			core.setOutput("message_id", response.data.id);
		} else {
			throw new Error(
				'Invalid action type. Must be either "create_post", "create_comment", or "create_message".'
			);
		}

		console.log("Successfully created Campsite " + actionType);
	} catch (error) {
		core.setFailed(error.message);
	}
}

module.exports = { run };

run();
