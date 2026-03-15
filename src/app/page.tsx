"use client";

import { useState, useEffect, useCallback } from "react";
import { format, isSameDay, startOfMonth } from "date-fns";
import Calendar from "@/components/Calendar";
import PostForm from "@/components/PostForm";
import PostCard from "@/components/PostCard";
import { Post, Platform, PLATFORM_LABELS, PLATFORM_COLORS } from "@/lib/types";

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Sidebar / form state
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formDefaultDate, setFormDefaultDate] = useState<Date | null>(null);

  // Filter state
  const [filterPlatform, setFilterPlatform] = useState<Platform | "">("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("month", format(currentMonth, "yyyy-MM"));
      if (filterPlatform) params.set("platform", filterPlatform);

      const res = await fetch(`/api/posts?${params.toString()}`);
      if (res.ok) {
        const data: Post[] = await res.json();
        setPosts(data);
      }
    } finally {
      setLoading(false);
    }
  }, [currentMonth, filterPlatform]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function handleDayClick(date: Date) {
    setSelectedDay(date);
  }

  function handlePostClick(post: Post) {
    setEditingPost(post);
    setShowForm(true);
  }

  function handleNewPost(defaultDate?: Date) {
    setEditingPost(null);
    setFormDefaultDate(defaultDate ?? selectedDay ?? new Date());
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function handleSave(saved: Post) {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setShowForm(false);
    setEditingPost(null);
  }

  const selectedDayPosts = selectedDay
    ? posts.filter((p) => isSameDay(new Date(p.scheduledAt), selectedDay))
    : [];

  const upcomingPosts = posts
    .filter((p) => new Date(p.scheduledAt) >= new Date())
    .slice(0, 5);

  // Platform summary for the month
  const platformCounts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.platform] = (acc[p.platform] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              SocialsPost
            </h1>
            <p className="text-xs text-gray-500 leading-tight">
              Content Calendar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Platform filter */}
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value as Platform | "")}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Platforms</option>
            {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleNewPost()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Post
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-4 py-6">
        <div className="flex gap-6">
          {/* LEFT: Calendar */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                label="Posts This Month"
                value={posts.length}
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                color="text-blue-600"
                bg="bg-blue-50"
              />
              <StatCard
                label="Scheduled"
                value={posts.filter((p) => p.status === "scheduled").length}
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                color="text-indigo-600"
                bg="bg-indigo-50"
              />
              <StatCard
                label="Published"
                value={posts.filter((p) => p.status === "published").length}
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                color="text-green-600"
                bg="bg-green-50"
              />
              <StatCard
                label="Drafts"
                value={posts.filter((p) => p.status === "draft").length}
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                }
                color="text-gray-500"
                bg="bg-gray-100"
              />
            </div>

            {/* Calendar */}
            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-200">
                <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent" />
              </div>
            ) : (
              <Calendar
                currentMonth={currentMonth}
                posts={posts}
                onMonthChange={setCurrentMonth}
                onDayClick={handleDayClick}
                onPostClick={handlePostClick}
              />
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-72 shrink-0 space-y-4">
            {/* Selected Day panel */}
            {selectedDay ? (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {format(selectedDay, "EEEE, MMMM d")}
                  </h3>
                  <button
                    onClick={() => handleNewPost(selectedDay)}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add
                  </button>
                </div>
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {selectedDayPosts.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No posts on this day.
                      <br />
                      <button
                        onClick={() => handleNewPost(selectedDay)}
                        className="mt-1 text-blue-600 hover:underline"
                      >
                        Schedule one →
                      </button>
                    </p>
                  ) : (
                    selectedDayPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onEdit={(p) => {
                          setEditingPost(p);
                          setShowForm(true);
                        }}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-gray-300 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs text-gray-400">
                  Click a day to see posts
                </p>
              </div>
            )}

            {/* Platform breakdown */}
            {Object.keys(platformCounts).length > 0 && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Platforms This Month
                </h3>
                <div className="space-y-2">
                  {(Object.keys(platformCounts) as Platform[]).map((p) => (
                    <div key={p} className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PLATFORM_COLORS[p] }}
                      />
                      <span className="text-xs text-gray-700 flex-1">
                        {PLATFORM_LABELS[p]}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {platformCounts[p]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming posts */}
            {upcomingPosts.length > 0 && (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Coming Up
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  {upcomingPosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => {
                        setEditingPost(post);
                        setShowForm(true);
                      }}
                      className="w-full text-left rounded-lg p-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: PLATFORM_COLORS[post.platform] }}
                        />
                        <span className="text-xs font-medium text-gray-800 truncate">
                          {post.title}
                        </span>
                      </div>
                      <p className="mt-0.5 ml-4 text-[10px] text-gray-400">
                        {format(new Date(post.scheduledAt), "MMM d 'at' h:mm a")}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Form Modal */}
      {showForm && (
        <PostForm
          post={editingPost}
          defaultDate={formDefaultDate}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900 leading-none">{value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}
