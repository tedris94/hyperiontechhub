import cases from '@/content/portfolio-cases.json'

export type PortfolioCase = (typeof cases)[number]

export function getPortfolioCases(): PortfolioCase[] {
  return [...cases].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getPortfolioCase(slug: string): PortfolioCase | undefined {
  return cases.find((c) => c.slug === slug)
}
