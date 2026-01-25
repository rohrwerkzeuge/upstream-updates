import type * as update from '../src/update.js'
import { jest } from '@jest/globals'

export const updateRepos = jest.fn<typeof update.updateRepos>()
export const update = jest.fn<typeof update.update>()
