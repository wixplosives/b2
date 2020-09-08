import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {parsePullRequestNumFromUrl, getCommand} from "../src/main"

test('test runs', () => {
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
  //const output = cp.execSync(`node ${ip}`, options).toString().split('\n')
  //expect(output.includes(expectedResponse)).toBeTruthy()
})

test('url parser', () =>{
  const res = parsePullRequestNumFromUrl('https://github.com/wixplosives/test-p-1/pull/31')
  expect(res).toBe(31)
})

test('url parser bad param', () => {
  expect(() => {
    parsePullRequestNumFromUrl("watever")
  }).toThrow();
})

test('url parser bad param', () => {
  expect(() => {
    parsePullRequestNumFromUrl('https://github.com/wixplosives/test-p-1/pull/notaprnumber')
  }).toThrow();
})

test('parse comment for command', () => {
  const retval = getCommand('@core3-ci-measure')
  expect(retval).toBe('measure')
})