import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aovmapuzwdvlyhccyqkl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdm1hcHV6d2R2bHloY2N5cWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0NDY2MTgsImV4cCI6MjA0NzAyMjYxOH0.VXn1uFql1oq4XJyL3Z2DuyZix1IDf5T3VGKe13V15S8'

export const supabase = createClient(supabaseUrl, supabaseKey)
