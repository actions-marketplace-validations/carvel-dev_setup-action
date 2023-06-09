import * as core from '@actions/core'
import * as github from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'
import {Inputs} from './inputs'
import {Installer, Octokit} from '@jbrunton/gha-installer'
import {CarvelReleasesService} from './carvel_releases_service'

async function run(): Promise<void> {
  const octokit = createOctokit()
  const releasesService = CarvelReleasesService.create(octokit)
  const installer = Installer.create(releasesService)

  try {
    console.time('download apps')
    const apps = new Inputs(core, process).getAppsToDownload()
    await installer.installAll(apps)
    console.timeEnd('download apps')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('Unexpected error occurred')
    }
  }
}

function createOctokit(): Octokit {
  const token = core.getInput('token')
  if (token) {
    return github.getOctokit(token)
  } else {
    core.warning(
      'No token set, you may experience rate limiting. Set "token: ${{ secrets.GITHUB_TOKEN }}" if you have problems.'
    )
    return new GitHub()
  }
}

run()
