const axios = require("axios");
const core = require("@actions/core");
const index = require("../src/index");

jest.mock("axios");
jest.mock("@actions/core");

describe("Campsite GitHub Action", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("creates a post successfully", async () => {
		// Mock input values
		core.getInput.mockImplementation((name) => {
			switch (name) {
				case "action_type":
					return "create_post";
				case "content":
					return "Test content";
				case "title":
					return "Test title";
				case "channel_id":
					return "123";
				case "api_key":
					return "test-api-key";
				default:
					return "";
			}
		});

		// Mock axios response
		axios.create.mockReturnValue({
			post: jest.fn().mockResolvedValue({
				data: {
					id: "456",
					url: "https://app.campsite.com/frontier-forest/posts/456",
				},
			}),
		});

		await index.run();

		expect(axios.create).toHaveBeenCalledWith({
			baseURL: "https://api.campsite.com/v2",
			headers: {
				Authorization: "Bearer test-api-key",
				"Content-Type": "application/json",
			},
		});

		expect(axios.create().post).toHaveBeenCalledWith("/posts", {
			title: "Test title",
			content_markdown: "Test content",
			channel_id: "123",
		});

		expect(core.setOutput).toHaveBeenCalledWith("post_id", "456");
		expect(core.setOutput).toHaveBeenCalledWith(
			"post_url",
			"https://app.campsite.com/frontier-forest/posts/456"
		);
	});

	test("creates a comment successfully", async () => {
		core.getInput.mockImplementation((name) => {
			switch (name) {
				case "action_type":
					return "create_comment";
				case "content":
					return "Test comment";
				case "post_id":
					return "789";
				case "parent_id":
					return "101";
				default:
					return "";
			}
		});

		axios.create.mockReturnValue({
			post: jest.fn().mockResolvedValue({
				data: { id: "202" },
			}),
		});

		await index.run();

		expect(axios.create().post).toHaveBeenCalledWith("/posts/789/comments", {
			content_markdown: "Test comment",
			parent_id: "101",
		});

		expect(core.setOutput).toHaveBeenCalledWith("comment_id", "202");
	});

	test("creates a message successfully", async () => {
		core.getInput.mockImplementation((name) => {
			switch (name) {
				case "action_type":
					return "create_message";
				case "content":
					return "Test message";
				case "thread_id":
					return "303";
				default:
					return "";
			}
		});

		axios.create.mockReturnValue({
			post: jest.fn().mockResolvedValue({
				data: { id: "404" },
			}),
		});

		await index.run();

		expect(axios.create().post).toHaveBeenCalledWith("/threads/303/messages", {
			content_markdown: "Test message",
		});

		expect(core.setOutput).toHaveBeenCalledWith("message_id", "404");
	});

	test("handles API errors", async () => {
		core.getInput.mockImplementation((name) => {
			switch (name) {
				case "action_type":
					return "create_post";
				case "content":
					return "Test content";
				case "title":
					return "Test title";
				case "channel_id":
					return "123";
				default:
					return "";
			}
		});

		const apiError = new Error("API Error");

		apiError.response = { data: "API Error Details" };

		axios.create.mockReturnValue({
			post: jest.fn().mockRejectedValue(apiError),
		});

		await index.run();

		expect(core.setFailed).toHaveBeenCalledWith("API Error Details");
	});

	test("handles invalid action type", async () => {
		core.getInput.mockImplementation((name) => {
			return name === "action_type" ? "invalid" : "";
		});

		await index.run();

		expect(core.setFailed).toHaveBeenCalledWith(
			'Invalid action type. Must be either "create_post", "create_comment", or "create_message".'
		);
	});
});
