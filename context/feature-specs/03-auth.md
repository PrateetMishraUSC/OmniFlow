Clerk is already installed and connected. Wire it into Next.js app: provider, auth pages, redirects, route protection and user menu. 

## Design 

Use Clerk's 'dark' theme from '@clerk/ui/themes' as the base. 

Override clerk apperance variable using the app's existing CSS variables. Do not hardcode colors. 

### Sign-in and Sign-up pages

- Large screen: simple two panel layout. 
- Left: compact logo, tagline, short-text only feature list. 
- Right: centered clerk form. 
- Small-screens: form only. 
- No gradients.
- No oversized hero section. 
- No feature cards. 
- No scroll-heavy layouts.

Keep the layout minimal and professional. 

### Implementation 

Wrap the root layout with the 'ClerkProvider' using the Clerk's 'dark' theme. 

Create Sign-in and Sign-up pages using Clerk's components. 

Use 'proxy.ts' at the project root, not 'middleware.ts'.

Define public routes using the existing Sign-in and Sign-up env vars. Protect everything else by default. 

Update '/':

- Authenticated users redirects to '/editor'
- Unauthenticated users redirects to '/sign-in'

Add Clerk's built in 'UserButton' to the editor navbar right section for profile settings and logout. 

Keep Clerk's default user menu and profile flows intact. Do not rebuild or heavily customize Clerk internals. 

Use existing Clerk env vars. Do not rename or invent new ones. 

## Dependencies 

Install: @clerk/ui.

### Check when done: 

- Make sure the proxy.ts file exists at the root. 
- All routes are protected except public auth paths. 
- auth pages use CSS variables with no hardcoded colors. 
- 'ClerkProvider' wraps the root layout. 
- 'npm run build' passes

