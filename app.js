import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let db;
openDB().then(result => {
  db = result;
});



const width = 800;
const height = 600;
const margin = { top: 40, right: 40, bottom: 40, left: 40 };

// test data
const tree = new PhotoTree("Life");
/*
tree.addEra("Moscow/Childhood");
tree.addEra("Moscow/Now");
tree.addEra("Abu Dhabi");
tree.addEra("Abu Dhabi/Eats");
tree.addEra("Moscow/Childhood/Dance");
tree.saveTree();
*/

// convert to D3 format
const root = d3.hierarchy(tree.root);
const treeLayout = d3.tree().size([
    width - margin.left - margin.right, 
    height - margin.top - margin.bottom
]);
treeLayout(root);

const svg = d3.select("#tree-svg")
  .attr("width", width)
  .attr("height", height);

// add margin
const g = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const initialTransform = d3.zoomIdentity
  .translate(margin.left, margin.top);

const zoom = d3.zoom()
  .on("zoom", (event) => {
    g.attr("transform", event.transform);
  });

svg.call(zoom);

function renderTree() {
  g.selectAll("*").remove();
  const root = d3.hierarchy(tree.root);
  treeLayout(root);
  // draw lines between nodes
  g.selectAll("line")
    .data(root.links())
    .join("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr("stroke", "black");

  // draw circles for nodes
  g.selectAll("circle")
    .data(root.descendants())
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 10)
    .attr("fill", "steelblue")
    .on("click", (event, d) => {
      svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity
          .translate(width/2, height/2)
          .scale(1.5)
          .translate(-d.x, -d.y)
      );
    });

    // label nodes
  g.selectAll("text")
    .data(root.descendants())
    .join("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y - 15)
    .attr("text-anchor", "middle")
    .text(d => d.data.name)
}
renderTree();


document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        svg.transition().duration(750)
        .call(zoom.transform, initialTransform)
    }
});

document.getElementById("addPhoto").addEventListener("click", (event) => {
    showFormPhoto()
});

document.getElementById("addEra").addEventListener("click", (event) => {
    showFormEra()
});

// DOUBLE CHECK -- FINISH FORM SETUP
function showFormPhoto() {
  document.getElementById('formPhoto').style.display = 'block'
  document.getElementById("submitPhoto").addEventListener("click", (event) => {
    addPhoto()
  });
};

function addPhoto() {
  const form = document.getElementById("formPhoto");
  const name = form.elements["name"].value;
  const path = form.elements["path"].value;
  const file = form.elements["file"].files[0];
  const id = `${path}_${name}`.replace(/\//g, "_");
  saveImage(db, id, file);
  tree.addPhoto(name, id, path);
  tree.saveTree();
  renderTree();
};

function showFormEra() {
  document.getElementById('formEra').style.display = 'block'
  document.getElementById("submitEra").addEventListener("click", (event) => {
    addEra()
  }); 
};

function addEra() {
  const form = document.getElementById("formEra");
  const era = form.elements["era"].value
  tree.addEra(era)
  tree.saveTree();
  renderTree();
};