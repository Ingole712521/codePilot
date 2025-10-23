import { OpenAIService, CodeAnalysis, CodeIssue } from './OpenAIService'
import { GitHubService } from './GitHubService'

export class CodeAnalyzer {
	private openaiService: OpenAIService
	private githubService: GitHubService

	constructor() {
		this.openaiService = new OpenAIService()
		this.githubService = new GitHubService()
	}

	async analyzeRepository(repoUrl: string): Promise<CodeAnalysis> {
		try {
			// Extract repository info from URL
			const repoInfo = this.extractRepoInfo(repoUrl)
			if (!repoInfo) {
				throw new Error('Invalid repository URL')
			}

			// Get repository files
			const files = await this.githubService.getRepositoryFiles(repoInfo.owner, repoInfo.repo)
			
			// Analyze each file
			const allIssues: CodeIssue[] = []
			let hasIssues = false

			for (const file of files) {
				if (this.shouldAnalyzeFile(file.name)) {
					const content = await this.githubService.getFileContent(repoInfo.owner, repoInfo.repo, file.path)
					const analysis = await this.openaiService.analyzeCode(content, file.name)
					
					if (analysis.hasIssues) {
						hasIssues = true
						allIssues.push(...analysis.issues)
					}
				}
			}

			// Generate summary
			const summary = await this.generateSummary(allIssues, files.length)

			return {
				hasIssues,
				issues: allIssues,
				summary
			}
		} catch (error) {
			throw new Error(`Failed to analyze repository: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	private extractRepoInfo(url: string): { owner: string; repo: string } | null {
		const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
		if (match) {
			return {
				owner: match[1],
				repo: match[2].replace('.git', '')
			}
		}
		return null
	}

	private shouldAnalyzeFile(fileName: string): boolean {
		const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.php', '.rb', '.go', '.rs']
		return extensions.some(ext => fileName.toLowerCase().endsWith(ext))
	}

	private async generateSummary(issues: CodeIssue[], totalFiles: number): Promise<string> {
		if (issues.length === 0) {
			return `Analyzed ${totalFiles} files. No issues found! 🎉`
		}

		const issueTypes = issues.reduce((acc, issue) => {
			acc[issue.type] = (acc[issue.type] || 0) + 1
			return acc
		}, {} as Record<string, number>)

		const severityCounts = issues.reduce((acc, issue) => {
			acc[issue.severity] = (acc[issue.severity] || 0) + 1
			return acc
		}, {} as Record<string, number>)

		let summary = `Analyzed ${totalFiles} files and found ${issues.length} issues:\n`
		summary += `• High severity: ${severityCounts.high || 0}\n`
		summary += `• Medium severity: ${severityCounts.medium || 0}\n`
		summary += `• Low severity: ${severityCounts.low || 0}\n\n`
		summary += `Issue types: ${Object.entries(issueTypes).map(([type, count]) => `${type} (${count})`).join(', ')}`

		return summary
	}

	async generateFixes(issues: CodeIssue[]): Promise<{ [filePath: string]: string }> {
		const fixes: { [filePath: string]: string } = {}

		for (const issue of issues) {
			try {
				const fix = await this.openaiService.generateFix(issue, '')
				if (fix) {
					fixes[issue.file] = fix
				}
			} catch (error) {
				console.error(`Failed to generate fix for ${issue.file}:`, error)
			}
		}

		return fixes
	}
}
