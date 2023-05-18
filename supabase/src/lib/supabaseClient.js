import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qndxemyshxetvjxakktz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZHhlbXlzaHhldHZqeGFra3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0MzIyODAsImV4cCI6MjAwMDAwODI4MH0.NpFsJQWyt-A7Qa52Co8NECJVCaUCTLysfBXDjSYhmd4'
)
