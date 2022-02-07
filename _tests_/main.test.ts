import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {
  parsePullRequestNumFromUrl,
  getCommand,
  getCommandArgs
} from '../src/main'

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

test('url parser', () => {
  const res = parsePullRequestNumFromUrl(
    'https://github.com/wixplosives/test-p-1/pull/31'
  )
  expect(res).toBe(31)
})

test('url parser bad param', () => {
  expect(() => {
    parsePullRequestNumFromUrl('watever')
  }).toThrow()
})

test('url parser bad param', () => {
  expect(() => {
    parsePullRequestNumFromUrl(
      'https://github.com/wixplosives/test-p-1/pull/notaprnumber'
    )
  }).toThrow()
})

test('parse comment for command', () => {
  const retval = getCommand('/helmus measure')
  expect(retval).toBe('measure')
})

test('parse comment for command, bad command', () => {
  const retval = getCommand('/helmus-cistam')
  expect(retval).toBe('')
})

test('parse comment for command, no command', () => {
  const retval = getCommand('some nice comment for a change')
  expect(retval).toBe('')
})

test('parse comment for command, comand with addtional test', () => {
  const retval = getCommand('/helmus measure something')
  expect(retval).toBe('measure')
})

test('parse comment for command, comand with addtional test', () => {
  const retval = getCommand('/helmus measure-report something')
  expect(retval).toBe('measure-report')
})

test('parse comment for command agrs', () => {
  const retval = getCommandArgs('/helmus measure-report something')
  expect(retval.length).toBe(1)
  expect(retval[0]).toBe('something')
})
