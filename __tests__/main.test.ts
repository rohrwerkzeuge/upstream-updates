/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import * as updateModule from '../__fixtures__/update.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/update.js', () => updateModule)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

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

  it('Calls update when repo is provided', async () => {
    core.getInput.mockImplementation((name, _options) => {
      switch (name) {
        case 'repo':
          return 'test-repo'
        case 'op-token':
          return 'test-token'
        case 'branch':
          return 'main'
        case 'owner':
          return 'test-owner'
        default:
          return ''
      }
    })

    updateModule.update.mockResolvedValueOnce(undefined)

    await run()

    expect(updateModule.update).toHaveBeenCalledWith('test-repo', {
      owner: 'test-owner',
      token: 'test-token',
      branch: 'main'
    })
    expect(core.setSecret).toHaveBeenCalledWith('op-token')
  })

  it('Calls updateRepos when repo-file is provided', async () => {
    core.getInput.mockImplementation((name, _options) => {
      switch (name) {
        case 'repo':
          return ''
        case 'repo-file':
          return 'repos.json'
        case 'op-token':
          return 'test-token'
        case 'branch':
          return 'develop'
        case 'owner':
          return 'test-owner'
        default:
          return ''
      }
    })

    updateModule.updateRepos.mockResolvedValueOnce(undefined)

    await run()

    expect(updateModule.updateRepos).toHaveBeenCalledWith('repos.json', {
      owner: 'test-owner',
      token: 'test-token',
      branch: 'develop'
    })
    expect(core.setSecret).toHaveBeenCalledWith('op-token')
  })

  it('Handles Error thrown during execution', async () => {
    core.getInput.mockImplementation((name, _options) => {
      switch (name) {
        case 'repo':
          return 'test-repo'
        case 'op-token':
          return 'test-token'
        case 'branch':
          return 'main'
        case 'owner':
          return 'test-owner'
        default:
          return ''
      }
    })

    const errorMessage = 'Test error message'
    updateModule.update.mockRejectedValueOnce(new Error(errorMessage))

    await run()

    expect(core.setFailed).toHaveBeenCalledWith(errorMessage)
  })

  it('Handles non-Error thrown during execution', async () => {
    core.getInput.mockImplementation((name, _options) => {
      switch (name) {
        case 'repo':
          return 'test-repo'
        case 'op-token':
          return 'test-token'
        case 'branch':
          return 'main'
        case 'owner':
          return 'test-owner'
        default:
          return ''
      }
    })

    updateModule.update.mockRejectedValueOnce('Non-error failure')

    await run()

    // Should complete without calling setFailed for non-Error types
    // This tests the else branch in the catch block (line 34)
    expect(core.setFailed).not.toHaveBeenCalled()
  })
})
