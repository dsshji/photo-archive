import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 800;
const height = 600;

// test data
const tree = new PhotoTree("Life");
tree.addEra("Moscow/Childhood");
tree.addEra("Moscow/Now");
tree.addEra("Abu Dhabi");

// convert to D3 format
const root = d3.hierarchy(tree.root);
const treeLayout = d3.tree().size([width, height]);
treeLayout(root);

console.log(root);