
import LiveAcademicsClient from './LiveAcademicsClient';

export default function AcademicsPage() {
  return <LiveAcademicsClient />;
}


// - Start FastAPI and Next.js.
// - Open /admin/academics.
// - Create academic year 2023-27.
// - Confirm it appears in the Academic Year dropdown without refreshing.
// - Refresh the page and confirm it remains there.
// - Select 2023-27 and create annual period 2023-24.
// - Confirm the period appears under that academic year.
// - Create another period, such as 2024-25.
// - Select a period and create a semester session for a batch.
// - Verify all three records in Supabase.