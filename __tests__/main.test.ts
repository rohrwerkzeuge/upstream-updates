/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

// inputs:
//   repo:
//     description: 'Repository Name'
//     required: false
//   repo-file:
//     description: 'Repository List JSON file'
//     required: false
//   op-token:
//     description: '1Password Service Account Token'
//     required: true
//   branch:
//     description: 'Branch to update'
//     default: 'main'

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name, _options) => {
      switch (name) {
        case 'repo':
          return 'macports'
        case 'op-token':
          return '112358'
        case 'branch':
          return 'main'
        default:
          return ''
      }
    })
    core.setSecret.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Fails on no string', async () => {
    core.getInput.mockClear().mockReturnValueOnce('')

    await run()

    // Verify the time output was set.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'Either repo or repo-file is required'
    )
  })
})
