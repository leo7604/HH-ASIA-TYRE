@echo off
echo Adding Supabase environment variables to Vercel...
echo.

vercel env add VITE_SUPABASE_URL production
echo.
vercel env add VITE_SUPABASE_ANON_KEY production
echo.
vercel env add VITE_SUPABASE_URL preview
echo.
vercel env add VITE_SUPABASE_ANON_KEY preview
echo.
vercel env add VITE_SUPABASE_URL development
echo.
vercel env add VITE_SUPABASE_ANON_KEY development
echo.
echo Done! Now redeploy your project.
echo Run: vercel --prod
pause
