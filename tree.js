// node class that stores the category, photos and children nodes and is linked to the tree
class Node {
  constructor(name, parent = null) {
    this.name = name;
    this.parent = parent;
    this.children = [];
    this.items = [];
    this.itemCount = 0;
  }
}

class Photo {
  constructor(name, src, path="") {
    this.name = name;
    this.src = src;
    this.path = path;
  }
}

// tree class for the main structure that holds the photo archive
class PhotoTree {
  constructor(rootName) {
    this.root = new Node(rootName);
  }

  // find the node based on the path written in the form of 'Category/SubCategory'
  findNode(path) {
    if (!path) return this.root;
    const parts = path.split('/').filter(p => p);
    let current = this.root;
    for (const part of parts) {
      const found = current.children.find(c => c.name === part);
      if (!found) return null;
      current = found;
    }
    return current;
  }

  // add category by providing the path in the form of 'Category/SubCategory'
  addEra(path) {
    // separate by slashes
    const parts = path.split('/').filter(p => p);
    let current = this.root;
    // traverse the children until we reach the last part of the path
    for (const part of parts) {
      let found = current.children.find(c => c.name === part);
      // if no category exists create new node for it
      if (!found) {
        const newNode = new Node(part, current);
        current.children.push(newNode);
        found = newNode;
      }
      current = found;
    }
  }

  // add the photo to the category by providing the photo and the path for it
  addPhoto(name, photoData, path) {
    // add category if it doesn't exist yet
    let node = this.findNode(path);
    if (!node) {
      this.addEra(path);
      node = this.findNode(path);
    }
    // store the photo in node's photos array
    node.items.push(new Photo(name, photoData, path));
    // bubble up itemCount
    let current = node;
    while (current) {
      current.itemCount++;
      current = current.parent;
    }
  }

  // method to delete the photo based on the path and name
  deletePhoto(name, path) {
    // return false if deletion unsuccessful
    let node = this.findNode(path);
    if (!node) return false;

    // traverse node's items to find the photo to delete
    for (let i = 0; i < node.items.length; i++) {
      if (node.items[i].name == name) {
        node.items.splice(i, 1);

        // bubble down itemCount
        let current = node;
        while (current) {
          current.itemCount--;
          current = current.parent;
        }
        return true;
      }
    }
  }

  // method to delete the category based on the provided path
  deleteEra(path) {
    // find the node to delete
    const node = this.findNode(path);
    if (!node || node === this.root) return false;

    const parent = node.parent;
    const photosToRemove = node.itemCount;

    // update the itemCount for all ancestors (bubble down)
    let current = parent;
    while (current) {
      current.itemCount -= photosToRemove;
      current = current.parent;
    }

    // remove the node from the parent's children array
    const index = parent.children.indexOf(node);
    if (index !== -1) {
      parent.children.splice(index, 1);
      return true;
    }

    return false;
  }

  // method to save data with JSON in LocalStorage
  saveTree() {
    localStorage.setItem("photoTree", JSON.stringify(this.root, (key, value) => {
      if (key === "parent") return undefined;
        return value;
    }));
  }

  // helper to convert an object to a Node
  reconstruct(object, parent) {
    let node = new Node(object.name, parent);
    // rewrite the array of items in the node
    node.items.length = 0; 
    node.items.push.apply(node.items, object.items);
    node.itemCount = object.itemCount;
    for (let i=0; i < object.children.length; i++) {
      const childNode = this.reconstruct(object.children[i], node);
      node.children.push(childNode);
    }
    return node;
  }

  // method to load data from JSON
  loadTree() {
    const data = JSON.parse(localStorage.getItem("photoTree"));
    this.root = this.reconstruct(data, null)
  }
}