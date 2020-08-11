import * as core from '@actions/core'
const {Octokit} = require('@octokit/action')

async function run(): Promise<void> {
  try {
    const commentText: string = core.getInput('commentText')
    if (commentText.includes('@measure')) {
      core.debug(`Found measure command`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
      const octokit = Octokit()
      await octokit.request(
        'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
        {
          owner: 'wixplosives',
          repo: 'test-p-1',
          workflow_id: 'test.yaml',
          ref: 'master'
        }
      )
    }
    core.setOutput('Complete', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
