// initialize a database of IndexedDB
let db;
openDB().then(result => {
  db = result;
});


const tree = new PhotoTree("Life");
tree.addEra("Moscow/Childhood");
tree.addPhoto("First day", "", "Moscow/Childhood");
tree.saveTree();

const tree2 = new PhotoTree("Life");
tree2.loadTree();
console.log(tree2.root);