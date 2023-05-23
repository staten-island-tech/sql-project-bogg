import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://gnxlyuryauoscxoqyjcz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueGx5dXJ5YXVvc2N4b3F5amN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3OTM5NDcsImV4cCI6MjAwMDM2OTk0N30.ankkYQVysM2PDPHm3MMMF_0VVbLvfAQWL1gfsOuQxVU'
)
