For any complex shape in svg, you will want to use a path element

`d3.line()` creates a generator that converts data points into a `d` string

it is a good idea to have a `g` element to contain our axis elements:

1. to keep the DOM organised, for debugging and exporting
2. if you want to update or remove the axis, this allows us to easily target all of the element of axis?
3. allows us to modify the whole axis at once
