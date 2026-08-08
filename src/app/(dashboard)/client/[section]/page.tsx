import { RoleSectionPage } from '@/components/dashboards/RoleSectionPage';
import { CLIENT_SECTIONS } from '@/lib/roleSectionTitles';

export default function ClientSectionPage() {
  return <RoleSectionPage sections={CLIENT_SECTIONS} roleLabel="client" />;
}
