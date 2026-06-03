The goal is to make the edge customizable by providing it with inline labels, source to destination arrow, destination to source arrow, or a doubly headed arrow. 

## Implementation 

1) Customizing edges: 

- On clicking the edge line it should ask for entering a label for that line. 
- using enter on the keyboard or clicking anywhere on the screen should finalize the label name which was entered. 
- When two shapes are connected using an edge line it should always add an arrowhead from the node it has been drawn to the other node. 
- After connecting, when hivering over the line, it should give three options of line to choose from:
    - source to destination arrowhead
    - destination to source arrowhead
    - doubly arrowhead
- After selecting the option, it should replace it with the selected like in real time 
- use React Flow's `EdgeLabelRenderer` and the path midpoint coordinates from `getSmoothStepPath` to position the label and do not calculate midpoint position manually
- When the active edge has no label, show a faint hint of writing an label

2) Creating the custom edge renderer.
   - use clean right-angle routing
   - keep edges slightly dimmed at rest
   - brighten edges when hovered or selected
   - make edges easier to hover and click without increasing the
     visible line thickness

## Scope Limits

- don't change how nodes are created
- don't change the shape panel
- don't redesign the node renderer beyond the required
  connection handles
- keep this focused on edge rendering, labels, and
  connection behavior

## Check When Done

- New edges use the custom canvas edge type with arrows.
- Edge hover, selection, and label editing are handled in
  the custom edge renderer.
- Edge label position uses EdgeLabelRenderer and path
  midpoint coordinates.
- Edge labels update through the existing edge data flow.
- npm run build passes without type errors.
