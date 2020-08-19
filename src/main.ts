import * as core from '@actions/core'
import {Octokit} from '@octokit/action'

async function get_branch_name(
  repo_stub: string,
  pull_request_url: string
): Promise<string> {
  const repo_stub_parts = repo_stub.split('/')
  const parts = pull_request_url.split('/')
  const pull_request_num = parts[parts.length - 1]

  const octokit = new Octokit()
  const commandUrl = 'GET /repos/:owner/:repo/pulls/:pull_number'
  const commandParams = {
    owner: repo_stub_parts[0],
    repo: repo_stub_parts[1],
    pull_number: parseInt(pull_request_num)
  }
  const retval = await octokit.request(commandUrl, commandParams)

  return Promise.resolve(retval.data.head.ref)
}

async function run(): Promise<void> {
  try {
    const dryrun: string = core.getInput('dryrun')
    const commentText: string = core.getInput('commentText')
    //const refParam: string = core.getInput('ref')
    const repo: string = core.getInput('repo')
    const pull_request_url: string = core.getInput('pull_request_url')
    //const issue_comment_url: string = core.getInput('issue_comment_url')

    core.info(
      `Executing. comment: ${commentText} repo:${repo}. pr_url: ${pull_request_url}`
    )
    const branch_ref = await get_branch_name(repo, pull_request_url)

    if (commentText.includes('@measure')) {
      const commandUrl =
        'POST /repos/:repository/actions/workflows/:workflow_id/dispatches'
      const commandParams = {
        ref: branch_ref,
        repository: repo,
        workflow_id: 'measure.yaml',
        inputs: {
          action_name: 'fake_measure'
        }
      }

      core.info(
        `Found @measure command. repo: ${repo}. ref: ${commandParams.ref}`
      ) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
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
