export type RepoGroup = {
  id: string,
  name: string,
  repos: string[]
}
export type RepoGroups = RepoGroup[]

export type IssueStatus = "open" | "closed" | "all" | "";
export type IssueType = "issue" | "pr" | "code" | "commits" | ""
export type Mode = "ux" | "rfc" | "easy" | "bugs" | "untriaged" | ""
export type Sort = "asc" | "desc" | "created" | "created-asc" | ""
export type FormData = {
  query: string,
  mode: Mode,
  customRepos: string[],
  includeSupported: boolean,
  includeOther: boolean,
  communityOnly: boolean,
  issueStatus: IssueStatus,
  issueType: IssueType,
  sort: Sort,
  codeIn: string,
  language: string,
}
