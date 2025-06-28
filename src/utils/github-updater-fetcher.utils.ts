import type { UpdatesFetcher, UpdatesFetcherResponse } from '@models/client-updates-config.model'
import type { Asset, GitHubRelease } from '@models/github-release.model'

export interface GitHubPolyRepoConfig {
    /**
     * @description
     * The GitHub repository owner (username or organization).
     */
    owner: string

    /**
     * @description
     * The repository name.
     */
    repo: string

    /**
     * @description
     * Whether to automatically install the update if a direct download URL is available.
     */
    autoInstall?: boolean
}

export interface GitHubMonoRepoConfig extends GitHubPolyRepoConfig {
    /**
     * @description
     * Regular expression to match the release tag name.
     * This will extract the version part from the tag name = `1.0.0`
     *
     * @example
     * Example: `/release\/workflow-name\/(.*)/` to match versions like `release/workflow-name/1.0.0` - `1.0.0`
     */
    releasePattern: RegExp
}

async function gitHubFetch<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
            },
        })

        if (!response.ok) {
            console.error(`GitHub API request failed with status ${response.status}`)
            return null
        }

        return (await response.json()) as T
    } catch (error) {
        console.error('Error fetching from GitHub API:', error)
        return null
    }
}

function findWorkflowAsset(assets: Asset[]): { downloadUrl?: string } {
    const asset = assets.find((a) => a.name.endsWith('.alfredworkflow'))

    return {
        downloadUrl: asset?.browser_download_url,
    }
}

export const gitHubPolyRepoFetcher = (config: GitHubPolyRepoConfig): UpdatesFetcher => {
    return async (): Promise<UpdatesFetcherResponse | null> => {
        const { owner, repo, autoInstall } = config
        const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`

        const release = await gitHubFetch<GitHubRelease>(url)
        if (!release) {
            return null
        }

        const { html_url, assets, tag_name: tagName } = release
        const { downloadUrl } = findWorkflowAsset(assets)

        return {
            latestVersion: tagName,
            downloadUrl: downloadUrl || html_url,
            isDirectDownload: Boolean(downloadUrl),
            autoInstall: autoInstall && Boolean(downloadUrl),
        }
    }
}

export const gitHubMonoRepoFetcher = (config: GitHubMonoRepoConfig): UpdatesFetcher => {
    return async (): Promise<UpdatesFetcherResponse | null> => {
        const { owner, repo, releasePattern, autoInstall } = config
        const url = `https://api.github.com/repos/${owner}/${repo}/releases`

        const releases = await gitHubFetch<GitHubRelease[]>(url)
        if (!releases) {
            return null
        }

        const matchingReleases = releases.filter((r) => releasePattern.test(r.tag_name))
        if (!matchingReleases.length) {
            return null
        }

        const [latestRelease] = matchingReleases

        const { html_url, assets, tag_name: tagName } = latestRelease
        const parsedVersion = tagName.match(releasePattern)?.at(1) || tagName

        const { downloadUrl } = findWorkflowAsset(assets)

        return {
            latestVersion: parsedVersion,
            downloadUrl: downloadUrl || html_url,
            isDirectDownload: Boolean(downloadUrl),
            autoInstall: autoInstall && Boolean(downloadUrl),
        }
    }
}
