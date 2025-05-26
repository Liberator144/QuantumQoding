#!/bin/bash

# Install Authentication Dependencies for Phase 3
echo "Installing authentication dependencies..."

npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared

echo "Authentication dependencies installed successfully!"
echo "Dependencies added:"
echo "- @supabase/supabase-js: Core Supabase client"
echo "- @supabase/auth-ui-react: React authentication UI components"
echo "- @supabase/auth-ui-shared: Shared authentication utilities"