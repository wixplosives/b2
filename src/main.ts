import * as core from '@actions/core'
import {Octokit} from '@octokit/action'

async function run(): Promise<void> {
  try {
    const commentText: string = core.getInput('commentText')
    const refParam: string = core.getInput('ref')
    const repo: string = core.getInput('repo')
    const dryrun: string = core.getInput('dryrun')
    core.info(
      `Executing. comment: ${commentText} repo:${repo}. ref: ${refParam}`
    )
    if (commentText.includes('@measure')) {
      const commandUrl =
        'POST /repos/:repository/actions/workflows/:workflow_id/dispatches'
      const commandParams = {
        ref: refParam,
        repository: repo,
        workflow_id: 'measure.yaml',
        inputs: {
          action_name: 'fake_measure'
        }
      }
      core.info(`Found @measure command. repo: ${repo}. ref: ${refParam}`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
      if (dryrun === 'true') {
        const paramsString = JSON.stringify(commandParams)
        core.info(`Octokit dryrun. url: ${commandUrl} params: ${paramsString}`)
      } else {
        const octokit = new Octokit()
        await octokit.request(commandUrl, commandParams)
      }
    }
    core.setOutput('Exiting', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
