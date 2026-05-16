GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon;

DROP POLICY IF EXISTS "ref images admin insert" ON storage.objects;
DROP POLICY IF EXISTS "ref images admin update" ON storage.objects;
DROP POLICY IF EXISTS "ref images admin delete" ON storage.objects;

CREATE POLICY "ref images admin insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'references' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ref images admin update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'references' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'references' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ref images admin delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'references' AND public.has_role(auth.uid(), 'admin'));