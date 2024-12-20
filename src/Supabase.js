import {createClient} from "@supabase/supabase-js"

export const supabase = createClient(
    "https://fjpczqaefiqqxecgjqwi.supabase.co", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqcGN6cWFlZmlxcXhlY2dqcXdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDE0OTIsImV4cCI6MjA1MDE3NzQ5Mn0.Nt5yDee0UYM6Wm8-c3OnfoqcoZI-kOBZ9RUWU1wXaiw"
)