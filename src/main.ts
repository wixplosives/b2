import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const commentText: string = core.getInput('commentText')
    if (commentText.includes('@measure')) {
      core.debug(`Found measure command`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    }
    core.setOutput('Complete', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
