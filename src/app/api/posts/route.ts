import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { readPosts, createPost } from "@/lib/storage";
import { CreatePostInput, Post } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const month = searchParams.get("month"); // YYYY-MM

    let posts = readPosts();

    if (platform) {
      posts = posts.filter((p) => p.platform === platform);
    }
    if (status) {
      posts = posts.filter((p) => p.status === status);
    }
    if (month) {
      posts = posts.filter((p) => p.scheduledAt.startsWith(month));
    }

    // Sort by scheduledAt ascending
    posts.sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostInput = await request.json();

    if (!body.title || !body.platform || !body.scheduledAt) {
      return NextResponse.json(
        { error: "title, platform, and scheduledAt are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const post: Post = {
      id: uuidv4(),
      title: body.title,
      content: body.content ?? "",
      platform: body.platform,
      scheduledAt: body.scheduledAt,
      status: body.status ?? "scheduled",
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl,
      tags: body.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };

    createPost(post);
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
