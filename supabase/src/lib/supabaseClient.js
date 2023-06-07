import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://gnxlyuryauoscxoqyjcz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueGx5dXJ5YXVvc2N4b3F5amN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NDc5Mzk0NywiZXhwIjoyMDAwMzY5OTQ3fQ.zYp-l0Oe7G-mML2xv6Ke9Xh_xs0i0jDdWc0MNPm8L3I'
)
