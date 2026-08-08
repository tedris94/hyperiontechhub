import { RoleSectionPage } from '@/components/dashboards/RoleSectionPage';
import { INSTRUCTOR_SECTIONS } from '@/lib/roleSectionTitles';

export default function InstructorSectionPage() {
  return <RoleSectionPage sections={INSTRUCTOR_SECTIONS} roleLabel="instructor" />;
}
