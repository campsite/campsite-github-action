# Campsite GitHub Action

This GitHub Action allows you to create posts, comments, or messages on [Campsite](https://campsite.com) directly from your GitHub workflow. It's perfect for automating updates, sharing build statuses, or notifying your team about important events in your deployment workflows.

## Usage

You will need an API key to use this action. Follow these steps to create an API key in Campsite:

1. Go to your Organization settings and click the **Integrations** tab.
2. In the **API keys** box, click the **+ New** button and enter a name for your integration.
3. After you create the app, copy the API key that appears.
4. Create a [GitHub secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository) with the value as the API key you just created. We use `CAMPSITE_API_KEY` in the examples below, but you can use any name you want.

### Create a post

```yml
- name: Create Campsite Post
  uses: campsite/campsite-github-action@v0.1.0
  with:
    api_key: ${{ secrets.CAMPSITE_API_KEY }}
    action_type: create_post
    title: "New Release: ${{ github.event.release.tag_name }}"
    content: "Version ${{ github.event.release.tag_name }} is now available. Check out the [changelog](${{ github.event.release.html_url })) for details."
    channel_id: "your_releases_channel_id"
```

### Create a comment

```yml
- name: Add Deployment Status Comment
  uses: campsite/campsite-github-action@v0.1.0
  with:
    api_key: ${{ secrets.CAMPSITE_API_KEY }}
    action_type: "create_comment"
    content: |
      Deployment of ${{ github.event.repository.name }} to ${{ github.event.repository.environment }} has completed successfully.
      - Deployment ID: ${{ github.run_id }}
      - Commit: ${{ github.sha }}
      - Environment: ${{ github.event.repository.environment }}
      - Status: ${{ github.event.conclusion }}
      - Deployed by: ${{ github.actor }}

      [View deployment logs](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})
    post_id: "existing_release_post_id"
```

### Send a message

```yml
- name: Send Campsite Message
  uses: campsite/campsite-github-action@v0.1.0
  with:
    api_key: ${{ secrets.CAMPSITE_API_KEY }}
    action_type: create_message
    content: "Build for PR #${{ github.event.pull_request.number }} has completed successfully."
    thread_id: "your_releases_thread_id"
```

## Inputs

| Input         | Description                                                                          | Required | Default       |
| ------------- | ------------------------------------------------------------------------------------ | -------- | ------------- |
| `api_key`     | Your Campsite API key                                                                | Yes      | -             |
| `action_type` | The type of action to perform (`create_post`, `create_comment`, or `create_message`) | Yes      | `create_post` |
| `content`     | The content of the post, comment, or message                                         | Yes      | -             |
| `title`       | The title of the post (only for `create_post`)                                       | No       | -             |
| `channel_id`  | The ID of the channel to post in (only for `create_post`)                            | No       | -             |
| `post_id`     | The ID of the post to comment on (only for `create_comment`)                         | No       | -             |
| `parent_id`   | The ID of the parent comment for replies (only for `create_comment`)                 | No       | -             |
| `thread_id`   | The ID of the thread to send a message to (only for `create_message`)                | No       | -             |

## Outputs

| Output       | Description                                               |
| ------------ | --------------------------------------------------------- |
| `post_id`    | The ID of the created post (only for `create_post`)       |
| `post_url`   | The URL of the created post (only for `create_post`)      |
| `comment_id` | The ID of the created comment (only for `create_comment`) |
| `message_id` | The ID of the sent message (only for `create_message`)    |

## Example Workflow

Here's an example of how you might use this action in a complete workflow:

```yaml
name: Release Notification
on:
  release:
    types: [published]

jobs:
  notify-campsite:
    runs-on: ubuntu-latest
    steps:
      - name: Create Campsite Post
        uses: campsite/campsite-github-action@v0.1.0
        with:
          api_key: ${{ secrets.CAMPSITE_API_KEY }}
          action_type: "create_post"
          title: "New Release: ${{ github.event.release.tag_name }}"
          content: |
            We've just released version ${{ github.event.release.tag_name }}!

            Check out the [full changelog](${{ github.event.release.html_url }}) for details.
          channel_id: "your_releases_channel_id"
```

This workflow will create a new post in Campsite whenever a new release is published on GitHub.

## Getting Help

If you encounter any issues or have questions about using this action, please open an issue in the [GitHub repository](https://github.com/campsite/campsite-github-action/issues).

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues with your ideas and feedback.

## License

This GitHub Action is released under the [MIT License](LICENSE).
