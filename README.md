# SocialsPost – Content Calendar

A social media content scheduling platform with an integrated calendar module. Plan, schedule, and manage your video content across platforms — on the exact days and times you want.

![SocialsPost Calendar](https://github.com/user-attachments/assets/97e499c8-41cd-4dfb-a4ab-fb1308863833)

## Features

- 📅 **Monthly calendar view** – see all scheduled posts as colour-coded pills on their day
- ➕ **Schedule posts** – set title, platform, date, time, caption, video URL, thumbnail, and tags
- ✏️ **Edit / delete** posts directly from the calendar or sidebar
- 📊 **Dashboard stats** – total posts, scheduled, published, and draft counts
- 🔍 **Platform filter** – filter the calendar to a single platform
- 🕐 **Coming Up** – sidebar list of the next 5 upcoming posts
- 🌐 **Supported platforms** – X/Twitter, Instagram, TikTok, YouTube, Facebook, LinkedIn
- 📌 **Post statuses** – Draft, Scheduled, Published, Failed

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/j1mmyc01n/SocialsPost.git
cd SocialsPost

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    api/
      posts/          # REST API – list, create, update, delete posts
    page.tsx          # Main calendar dashboard
    layout.tsx
  components/
    Calendar.tsx      # Monthly calendar grid
    PostForm.tsx      # Schedule / edit post modal
    PostCard.tsx      # Post summary card
  lib/
    types.ts          # TypeScript types and platform metadata
    storage.ts        # JSON file I/O helpers
data/
  posts.json          # Post storage (auto-created on first run)
```

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | List posts (filter by `?month=YYYY-MM`, `?platform=`, `?status=`) |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/:id` | Get a single post |
| PUT | `/api/posts/:id` | Update a post |
| DELETE | `/api/posts/:id` | Delete a post |
