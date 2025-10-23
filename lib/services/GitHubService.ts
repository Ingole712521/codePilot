import { Octokit } from 'octokit'

export interface Repository {
	id: string
	name: string
	full_name: string
	private: boolean
	html_url: string
	description: string | null
}

export interface RepositoryFile {
	name: string
	path: string
	type: 'file' | 'dir'
	size?: number
	download_url?: string
}

export class GitHubService {
	private readonly octokit: Octokit

	constructor(githubToken?: string) {
		this.octokit = new Octokit({ 
			auth: githubToken || process.env.GITHUB_TOKEN,
			// Use public API for unauthenticated requests
			baseUrl: 'https://api.github.com'
		})
	}

	async getUserRepositories(): Promise<Repository[]> {
		const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
			sort: 'updated',
			per_page: 100,
		})
		return data.map((repo) => ({
			id: String(repo.id),
			name: repo.name,
			full_name: repo.full_name,
			private: repo.private,
			html_url: repo.html_url,
			description: repo.description ?? null,
		}))
	}

	async getRepositoryFiles(owner: string, repo: string): Promise<RepositoryFile[]> {
		try {
			const { data } = await this.octokit.rest.repos.getContent({
				owner,
				repo,
				path: ''
			})

			if (Array.isArray(data)) {
				return data.map((item: any) => ({
					name: item.name,
					path: item.path,
					type: item.type,
					size: item.size,
					download_url: item.download_url
				}))
			}
			return []
		} catch (error) {
			console.error('Error fetching repository files:', error)
			return []
		}
	}

	async getFileContent(owner: string, repo: string, path: string): Promise<string> {
		try {
			const { data } = await this.octokit.rest.repos.getContent({
				owner,
				repo,
				path
			})

			if ('content' in data && data.content) {
				// Decode base64 content
				return Buffer.from(data.content, 'base64').toString('utf-8')
			}
			return ''
		} catch (error) {
			console.error('Error fetching file content:', error)
			return ''
		}
	}

	async createPullRequest(
		repoFullName: string,
		branchName: string,
		title: string,
		description: string,
	) {
		const [owner, repo] = repoFullName.split('/')
		const { data } = await this.octokit.rest.pulls.create({
			owner,
			repo,
			title,
			body: description,
			head: branchName,
			base: 'main',
		})
		return { url: data.html_url, number: data.number, title: data.title }
	}

	async getRepoContent(repoFullName: string, filePath = '') {
		const [owner, repo] = repoFullName.split('/')
		const { data } = await this.octokit.rest.repos.getContent({ owner, repo, path: filePath })
		return data
	}
}

export class GitHubAuthService {
	static async exchangeCodeForToken(code: string) {
		const response = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify({
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code,
			}),
		})
		const data = await response.json()
		if ((data as any).error) {
			throw new Error((data as any).error_description || 'GitHub OAuth failed')
		}
		return { accessToken: data.access_token as string, tokenType: data.token_type as string, scope: data.scope as string }
	}

	static async getUserInfo(accessToken: string) {
		const response = await fetch('https://api.github.com/user', {
			headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github.v3+json' },
		})
		if (!response.ok) throw new Error('Failed to fetch user info from GitHub')
		return await response.json()
	}
}
