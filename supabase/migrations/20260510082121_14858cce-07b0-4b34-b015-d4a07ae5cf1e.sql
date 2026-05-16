CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
      )
      OR (
        _role = 'admin'::app_role
        AND lower(coalesce(auth.jwt() ->> 'email', '')) IN ('devforge3d@gmail.com', 'husleves41@gmail.com')
      )
    )
$$;