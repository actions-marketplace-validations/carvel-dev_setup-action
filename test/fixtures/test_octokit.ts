import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { isEqual } from './matchers'
import { ReposListReleasesParameters } from '@jbrunton/gha-installer';
import { ReposListReleasesItem, Octokit, OctokitResponse, ReposListReleasesResponseData } from '@jbrunton/gha-installer/lib/octokit';

interface TestMethods {
  stubListReleasesResponse(params: ReposListReleasesParameters, releases: Array<ReposListReleasesItem>): void
}

export type TestOctokit = DeepMockProxy<Octokit> & TestMethods

export function createTestOctokit(): TestOctokit {
  const octokit: any = mockDeep<Octokit>()
  octokit.stubListReleasesResponse = stubListReleasesResponse
  return octokit as TestOctokit
}

function stubListReleasesResponse(this: TestOctokit, params: ReposListReleasesParameters, releases: Array<ReposListReleasesItem>) {
  const response = { data: releases } as OctokitResponse<ReposListReleasesResponseData>
  this.rest.repos.listReleases
    .calledWith(isEqual(params))
    .mockReturnValue(Promise.resolve(response as any))
}
