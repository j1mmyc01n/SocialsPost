"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { Post, PLATFORM_COLORS, PLATFORM_LABELS } from "@/lib/types";

interface CalendarProps {
  currentMonth: Date;
  posts: Post[];
  onMonthChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  onPostClick: (post: Post) => void;
}

const MAX_VISIBLE_PER_DAY = 3;

export default function Calendar({
  currentMonth,
  posts,
  onMonthChange,
  onDayClick,
  onPostClick,
}: CalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function postsForDay(day: Date): Post[] {
    return posts.filter((p) => isSameDay(new Date(p.scheduledAt), day));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          aria-label="Previous month"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="text-base font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="flex items-center justify-center h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          aria-label="Next month"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wide"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayPosts = postsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const hasMore = dayPosts.length > MAX_VISIBLE_PER_DAY;
          const visible = dayPosts.slice(0, MAX_VISIBLE_PER_DAY);

          return (
            <div
              key={idx}
              onClick={() => onDayClick(day)}
              className={[
                "min-h-[100px] p-1.5 border-b border-r border-gray-100 cursor-pointer",
                "hover:bg-gray-50 transition-colors",
                !isCurrentMonth ? "bg-gray-50/60" : "",
              ].join(" ")}
            >
              {/* Day number */}
              <div className="flex items-center justify-end mb-1">
                <span
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    today
                      ? "bg-blue-600 text-white"
                      : isCurrentMonth
                      ? "text-gray-700"
                      : "text-gray-300",
                  ].join(" ")}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Post pills */}
              <div className="space-y-0.5">
                {visible.map((post) => (
                  <button
                    key={post.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPostClick(post);
                    }}
                    title={`${PLATFORM_LABELS[post.platform]}: ${post.title}`}
                    style={{ backgroundColor: PLATFORM_COLORS[post.platform] }}
                    className="w-full truncate rounded px-1.5 py-0.5 text-left text-[10px] font-medium text-white leading-tight hover:opacity-80 transition-opacity"
                  >
                    {format(new Date(post.scheduledAt), "HH:mm")} {post.title}
                  </button>
                ))}
                {hasMore && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDayClick(day);
                    }}
                    className="w-full rounded px-1.5 py-0.5 text-left text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    +{dayPosts.length - MAX_VISIBLE_PER_DAY} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
