import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {}

xtest('test runs', () => {
  process.env['INPUT_COMMENTTEXT'] = '@measure something'
  process.env['INPUT_REPO'] = 'wixplosives'
  process.env['INPUT_REF'] = 'b2'
  process.env['INPUT_DRYRUN'] = 'true'
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }
  const commandParams = {
    ref: process.env['INPUT_REF'],
    repository: process.env['INPUT_REPO'],
    workflow_id: 'measure.yaml',
    inputs: {
      action_name: 'fake_measure'
    }
  }
  const paramsString = JSON.stringify(commandParams)
  const expectedResponse = `Octokit dryrun. url: POST /repos/:repository/actions/workflows/:workflow_id/dispatches params: ${paramsString}`
  const output = cp.execSync(`node ${ip}`, options).toString().split('\n')
  expect(output.includes(expectedResponse)).toBeTruthy()
})

