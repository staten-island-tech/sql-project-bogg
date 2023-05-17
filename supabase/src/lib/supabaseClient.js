import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://eoinwwvroxgdtbieyavr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvaW53d3Zyb3hnZHRiaWV5YXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQzNDYyODIsImV4cCI6MTk5OTkyMjI4Mn0.ZIXTcuAJqLIhTow48WHyf1XCPdEgG6MyWr0jxBrtHCQ'
)
