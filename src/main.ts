import * as core from '@actions/core'
const {Octokit} = require('@octokit/action')

async function run(): Promise<void> {
  try {
    const commentText: string = core.getInput('commentText')
    const refParam: string = core.getInput('ref')
    if (commentText.includes('@measure')) {
      core.info(`Found measure command`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
      const octokit = new Octokit()
      await octokit.request(
        'POST /repos/:repository/actions/workflows/:workflow_id/dispatches',
        {
          ref: refParam,
          repository: 'wixplosives/test-p-1',
          workflow_id: 'test.yaml'
        }
      )
    }
    core.setOutput('Complete', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
