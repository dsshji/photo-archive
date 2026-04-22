import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let db;
openDB().then(result => {
  db = result;
});

const width = 0.9*window.innerWidth;
const height = 0.85*window.innerHeight;
const margin = { top: 40, right: 40, bottom: 40, left: 40 };

// test data
const tree = new PhotoTree("Life");
const saved = localStorage.getItem("photoTree");
if (saved) {
  tree.loadTree();
} else {
  tree.saveTree();
}

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
      )
      openNodePopup(d);
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

function addPhoto() {
  const form = document.getElementById("formPhoto");
  const name = form.elements["name"].value;
  const path = form.elements["path"].value;
  const file = form.elements["file"].files[0];
  const id = `${path}_${name}`.replace(/\//g, "_");
  saveImage(db, id, file);
  tree.addPhoto(name, id, path);
  document.getElementById("photoPopup").close();
  tree.saveTree();
  renderTree();
};

function addEra() {
  const form = document.getElementById("formEra");
  const era = form.elements["era"].value
  document.getElementById("eraPopup").close();
  tree.addEra(era)
  tree.saveTree();
  renderTree();
};

function resetTree() {
  localStorage.removeItem("photoTree");
  location.reload();
}

document.getElementById("reset").addEventListener("click", () => {
  resetTree();
});

// photo dialog
document.getElementById("addPhoto").addEventListener("click", () => {
  document.getElementById("photoPopup").showModal();
});
document.getElementById("closeBtnPhoto").addEventListener("click", () => {
  document.getElementById("photoPopup").close();
});
document.getElementById("submitPhoto").addEventListener("click", addPhoto);

// era dialog
document.getElementById("addEra").addEventListener("click", () => {
  document.getElementById("eraPopup").showModal();
});
document.getElementById("closeBtnEra").addEventListener("click", () => {
  document.getElementById("eraPopup").close();
});
document.getElementById("submitEra").addEventListener("click", addEra);

// node popups with photos
async function openNodePopup(node) {
  document.getElementById("nodePopupTitle").textContent = node.data.name;
  document.getElementById("nodePopupPhotos").innerHTML = "";
  for (let photo of node.data.items) {
    const result = await getImage(db, photo.src);
    const src = URL.createObjectURL(result.file);
    const img = document.createElement("img");
    img.src = src;
    document.getElementById("nodePopupPhotos").append(img);
  }
  document.getElementById("nodePopup").showModal();
};
document.getElementById("closeBtnNode").addEventListener("click", () => {
  document.getElementById("nodePopup").close();
});