export type Platform =
  | "twitter"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "linkedin";

export type PostStatus = "scheduled" | "published" | "failed" | "draft";

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  scheduledAt: string; // ISO 8601 string
  status: PostStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type CreatePostInput = Omit<Post, "id" | "createdAt" | "updatedAt">;
export type UpdatePostInput = Partial<CreatePostInput>;

export const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "X / Twitter",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: "#000000",
  instagram: "#E1306C",
  tiktok: "#010101",
  youtube: "#FF0000",
  facebook: "#1877F2",
  linkedin: "#0A66C2",
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  scheduled: "Scheduled",
  published: "Published",
  failed: "Failed",
  draft: "Draft",
};

export const STATUS_COLORS: Record<PostStatus, string> = {
  scheduled: "#2563EB",
  published: "#16A34A",
  failed: "#DC2626",
  draft: "#9CA3AF",
};
