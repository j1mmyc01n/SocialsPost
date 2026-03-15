import fs from "fs";
import path from "path";
import { Post } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "posts.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf-8");
  }
}

export function readPosts(): Post[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Post[];
}

export function writePosts(posts: Post[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export function getPostById(id: string): Post | undefined {
  return readPosts().find((p) => p.id === id);
}

export function createPost(post: Post): Post {
  const posts = readPosts();
  posts.push(post);
  writePosts(posts);
  return post;
}

export function updatePost(id: string, updates: Partial<Post>): Post | null {
  const posts = readPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() };
  writePosts(posts);
  return posts[index];
}

export function deletePost(id: string): boolean {
  const posts = readPosts();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) return false;
  writePosts(next);
  return true;
}
