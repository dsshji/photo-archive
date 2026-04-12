// initial setup for testing
const tree = new PhotoTree("Life");
tree.addEra("Moscow/Childhood");
tree.addEra("Moscow/Now");
tree.addPhoto("first day", "", "Moscow/Childhood");
console.log(tree.root);

tree.deletePhoto("first day", "Moscow/Childhood");
console.log(tree.root);