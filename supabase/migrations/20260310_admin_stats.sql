-- Admin Stats Function
-- Returns aggregated metadata for the Admin Dashboard

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalUsers', (SELECT count(*) FROM public.profiles),
    'totalEnrollments', (SELECT count(*) FROM public.course_enrollments),
    'totalRevenue', (SELECT COALESCE(sum(balance), 0) FROM public.wallets), -- Aggregate balance as a generic revenue proxy
    'pendingApps', (
      (SELECT count(*) FROM public.teacher_applications WHERE status = 'pending') +
      (SELECT count(*) FROM public.celebrity_applications WHERE status = 'pending') +
      (SELECT count(*) FROM public.company_applications WHERE status = 'pending')
    )
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
