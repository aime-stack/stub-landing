-- 1. Create the trigger function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_account_type text;
  v_full_name text;
  v_phone text;
  v_company_name text;
  v_registration_message text;
BEGIN
  -- Extract metadata safely parsing from auth.users (inserted via our signupAction)
  v_account_type := new.raw_user_meta_data->>'account_type';
  v_full_name := new.raw_user_meta_data->>'full_name';
  v_phone := new.raw_user_meta_data->>'phone';
  v_company_name := new.raw_user_meta_data->>'company_name';
  v_registration_message := new.raw_user_meta_data->>'registration_message';

  -- Default fallback
  IF v_account_type IS NULL THEN
    v_account_type := 'regular';
  END IF;

  -- Insert the base profile for ALL users
  INSERT INTO public.profiles (
    id, 
    full_name, 
    account_type,
    phone,
    is_verified
  )
  VALUES (
    new.id,
    v_full_name,
    v_account_type,
    v_phone,
    -- If it's a company or celebrity, they start unverified to require admin review
    CASE WHEN v_account_type IN ('company', 'celebrity') THEN false ELSE false END
  );

  -- If the user signed up as a teacher, instantly seed a pending teacher application
  IF v_account_type = 'teacher' THEN
     INSERT INTO public.teacher_applications (
       user_id,
       youtube_channel_url,
       bio,
       expertise,
       status
     ) VALUES (
       new.id,
       'Pending Manual Update', -- Placeholder since form didn't collect channel url initially
       COALESCE(v_registration_message, 'Pending Teacher Application'),
       '{}'::text[],
       'pending'
     );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Bind the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
