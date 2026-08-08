import { RoleSectionPage } from '@/components/dashboards/RoleSectionPage';
import { CONSULTANT_SECTIONS } from '@/lib/roleSectionTitles';

export default function ConsultantSectionPage() {
  return <RoleSectionPage sections={CONSULTANT_SECTIONS} roleLabel="consultant" />;
}
