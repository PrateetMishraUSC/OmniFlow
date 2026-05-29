We need the base chrome component that frame every editor screen - the top navbar and left sidebar shell. These will be reused and extended in every chapter that follows. 

### Editor Navbar 

Create 'components/editor/editor-navbar.tsx'.

Requirements:
- Fixed-height top navbar. 
- left, center and right sections. 
- left section contains sidebar toggle button. 
- use 'PanelLeftOpen' / 'PanelLeftClose' icons according to the state of the sidebar. 
- right section stays empty for now. 
- dark background with sublt bottom border. 

### Project Sidebar 

Create 'components/editor/project-sidebar.tsx'.

Requirements:
- Sidebar should float above the editor canvas.  
- Opening sidebar should not push the page content.  
- Slides in from left.
- accepts 'isOpen' prop. 
- Header with 'Project' title + close button. 
- shadcn 'Tabs':
    - MyProjects
    - Shared
- both tabs show empty placeholder state. 
- full-width 'New Project' button at the bottom with 'Plus' icon. 

### Dialog Pattern 

Use the existing color tokens from 'global.css' for dialog styling. 

Support: 
- Title 
- Description 
- Footer actions 

Do not build actual dialogs yet. 

### Check when done

- New components compile without typescript errors. 
- No lint errors. 
- Dialog pattern is ready for future use. 
