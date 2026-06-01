Build the '/editor' home screen and add project dialogs/sidebar actions. No API calls or persistence yet. 

## Editor Home

Reuse the existing editor layout. Do not modify the navbar or sidebar behaviour. 

In the center of the page, add: 

- Heading: 'Create a project or add an existing one'
- Description: 'Start a new architecture workspace, or choose a project from the sidebar'
- 'New Project' button with a plus icon

Keep the layout minimal and do not wrap this content in cards. 

Clicking 'New Project' should open the Create Project dialog. 

## Dialogs 

### Create Project 

- Project name input 
- Live slug preview based on the name 
- Preview updates as the user types

### Rename Project 

- Prefilled project name in the input 
- Current project name in the description 
- Input auto-focuses
- Enter submits 

### Delete Project

- Destruction confirmation only 
- No input 
- Confirm button uses destructive styling

## Sidebar 

Add project item actions: 

- Rename
- Delete

Show actions only for owned projects

Hide actions for shared/collaborator projects

On mobile:

- Tapping outside the bar closes it
- Add a backdrop scrim 

## Implementation 

Create a dedicated hook to manage: 

- dialog state 
- form state 
- loading state 

Wire: 

- Editor home 'New Project' -> Create dialog 
- Sidebar create -> Create Dialog 
- Sidebar Rename -> Rename Dialog
- Sidebar Delete -> Delete Dialog

Use mock projects data only. Do not add API calls or persistence. 

## Check when done

- Sidebar actions are wired
- Slug preview works 
- No typescript errors 
- No lint errors
