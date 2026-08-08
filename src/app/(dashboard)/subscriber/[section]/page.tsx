import { RoleSectionPage } from '@/components/dashboards/RoleSectionPage';
import { SUBSCRIBER_SECTIONS } from '@/lib/roleSectionTitles';

export default function SubscriberSectionPage() {
  return <RoleSectionPage sections={SUBSCRIBER_SECTIONS} roleLabel="subscriber" />;
}
