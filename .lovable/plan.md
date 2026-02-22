

## Logo Customization Feature

This feature will allow admins to upload a custom logo from the Admin Dashboard. Once uploaded, it will automatically update:
- The logo in the top navigation bar (both desktop and mobile)
- The admin panel logo
- The PWA/mobile app icon (favicon + apple-touch-icon)

### How It Works

1. **New database table** (`site_settings`) stores the custom logo URL
2. **Admin uploads a logo** via a new section in the Admin Dashboard
3. **All components** (Navbar, Admin sidebar) read the logo from the database and display it
4. **Favicon and mobile icon** update dynamically in the browser tab

### Technical Details

**Step 1: Create `site_settings` table**
- A simple key-value table with columns: `id`, `key` (text, unique), `value` (text), `updated_at`
- Seed it with a default row: `key = 'logo_url'`, `value = null`
- RLS: Anyone can read, only admins can update
- Enable realtime so logo changes propagate instantly

**Step 2: Create a `useSiteSettings` hook**
- Fetches the `logo_url` from `site_settings`
- Subscribes to realtime changes so the logo updates everywhere without refresh
- Returns the logo URL (or null for default)

**Step 3: Add Logo Upload section in Admin Dashboard**
- A new "Branding" card at the top of the admin dashboard
- Shows current logo preview
- Upload button that saves the image to the existing `movie-images` storage bucket (or a new `branding` bucket)
- On upload: stores the file in storage, updates `site_settings` with the public URL

**Step 4: Update Navbar component**
- Import and use `useSiteSettings` hook
- Replace the hardcoded Play icon with the custom logo image (if set), falling back to the default Play icon

**Step 5: Update Admin Dashboard sidebar logo**
- Same approach -- show custom logo if available, otherwise show default

**Step 6: Dynamic favicon/mobile icon update**
- In `App.tsx` or a dedicated component, use `useSiteSettings` to get the logo URL
- Dynamically update `<link rel="icon">` and `<link rel="apple-touch-icon">` in the document head using `react-helmet-async` (already installed)

### Files to Create
- `src/hooks/useSiteSettings.tsx` -- hook to fetch and subscribe to site settings

### Files to Modify
- New database migration for `site_settings` table + RLS policies
- `src/pages/AdminDashboard.tsx` -- add branding/logo upload section
- `src/components/Navbar.tsx` -- use custom logo
- `src/App.tsx` -- dynamic favicon update via helmet

