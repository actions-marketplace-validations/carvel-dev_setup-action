import {ActionsCore, Environment} from '@jbrunton/gha-installer/lib/interfaces'
import {AppInfo} from '@jbrunton/gha-installer'

export const carvelApps = [
  'ytt',
  'kbld',
  'kapp',
  'kwt',
  'imgpkg',
  'vendir',
  'kctrl'
]

export class Inputs {
  private _apps?: AppInfo[]
  private _core: ActionsCore
  private _env: Environment

  constructor(core: ActionsCore, env: Environment) {
    this._core = core
    this._env = env
  }

  public getAppsToDownload(): AppInfo[] {
    const apps = this.includeAppsList()

    if (apps.length == 0) {
      // if no options specified, download all
      apps.push(...this.getAllApps())
    }

    this._apps = apps.map((appName: string) => {
      if (!carvelApps.includes(appName)) {
        throw Error(`Unknown app: ${appName}`)
      }
      return {name: appName, version: this._core.getInput(appName)}
    })

    return this._apps
  }

  private getAllApps(): string[] {
    if (this._env.platform == 'win32') {
      // kwt isn't available for Windows
      return carvelApps.filter(app => app != 'kwt')
    }
    return carvelApps
  }

  private includeAppsList(): string[] {
    const apps = this.parseAppList('only')

    if (apps.length == 0) {
      // if no `only` option specified, include all by default
      apps.push(...this.getAllApps())
    }

    const excludeApps = this.parseAppList('exclude')

    return apps.filter(appName => !excludeApps.includes(appName))
  }

  private parseAppList(input: string): string[] {
    return this._core
      .getInput(input)
      .split(',')
      .map((appName: string) => appName.trim())
      .filter((appName: string) => appName != '')
  }
}
