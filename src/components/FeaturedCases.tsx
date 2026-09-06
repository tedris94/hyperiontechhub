import { getPortfolioCasesAsync } from '@/lib/portfolio'
import FeaturedCasesSlider from '@/components/FeaturedCasesSlider'

/** Server wrapper — loads featured cases for the autoplay slider. */
export default async function FeaturedCases() {
  const items = (await getPortfolioCasesAsync()).filter((c) => c.featured)
  return <FeaturedCasesSlider items={items} />
}
