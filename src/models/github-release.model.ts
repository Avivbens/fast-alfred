export interface GitHubRelease {
    url: string
    assets_url: string
    upload_url: string
    html_url: string
    id: number
    author: Author
    node_id: string
    tag_name: string
    target_commitish: string
    name: string
    draft: boolean
    prerelease: boolean
    created_at: Date
    published_at: Date
    assets: Asset[]
    tarball_url: string
    zipball_url: string
    body: string
}

export interface Asset {
    url: string
    id: number
    node_id: string
    name: string
    label: string
    uploader: Author
    content_type: ContentType
    state: State
    size: number
    digest: null | string
    download_count: number
    created_at: Date
    updated_at: Date
    browser_download_url: string
}

export enum ContentType {
    ApplicationZip = 'application/zip',
}

export enum State {
    Uploaded = 'uploaded',
}

export interface Author {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: Type
    user_view_type: UserViewType
    site_admin: boolean
}

export enum Type {
    User = 'User',
}

export enum UserViewType {
    Public = 'public',
}
