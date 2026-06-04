# Photo Archive

A browser-based photo archive organized as an interactive tree. Built as a personal project on top of a data structures assignment (general tree in C++, rebuilt in JavaScript).

Live at [dsshji.github.io/photo-archive](https://dsshji.github.io/photo-archive/)

---

## About

Photos are organized hierarchically by era, place, or event rather than chronologically. You define the structure by adding paths like `Moscow/Childhood` or `Travel/China`, then attach photos to any node.

Data lives entirely in the browser — no account, no backend.

---

## Features

- Add and delete eras as slash-separated paths
- Upload photos to any node
- Click a node to zoom in and view its photos
- Delete individual photos or entire branches
- Tree and images persist across sessions via localStorage and IndexedDB
- Press Escape to reset zoom

---

## Stack

- Vanilla JavaScript — general tree data structure
- D3.js — visualization, zoom, pan, transitions
- IndexedDB — image storage
- localStorage — tree metadata
- HTML and CSS, no frameworks

---

## Run locally

No build step. Clone and open with any static server (e.g. Live Server in VS Code).

```bash
git clone https://github.com/dsshji/photo-archive.git
cd photo-archive
```

---

Made by [Dasha](https://dsshji.github.io/photo-archive/credits.html)
