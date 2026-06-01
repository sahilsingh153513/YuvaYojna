"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Users,
} from "lucide-react";
import { useDaisyTheme } from "@/context/DaisyThemeContext";

const CATEGORY_OPTIONS = [
  { id: "all", label: "All" },
  { id: "experiences", label: "Experiences" },
  { id: "tips", label: "Tips" },
  { id: "questions", label: "Questions" },
  { id: "success", label: "Success Stories" },
];

const POST_CATEGORIES = CATEGORY_OPTIONS.filter((category) => category.id !== "all");

function getStoredUser() {
  if (typeof window === "undefined") return {};

  try {
    const user = JSON.parse(localStorage.getItem("yuvaUser") || "{}");
    let guestToken = localStorage.getItem("communityGuestToken");
    if (!guestToken) {
      guestToken = `guest-${crypto.randomUUID()}`;
      localStorage.setItem("communityGuestToken", guestToken);
    }

    return {
      token: localStorage.getItem("yuvaToken") || user.token || guestToken,
      email: user.email || null,
      name: user.name || null,
    };
  } catch {
    let guestToken = localStorage.getItem("communityGuestToken");
    if (!guestToken) {
      guestToken = `guest-${Date.now()}`;
      localStorage.setItem("communityGuestToken", guestToken);
    }

    return {
      token: localStorage.getItem("yuvaToken") || guestToken,
      email: null,
      name: null,
    };
  }
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function CommunityFeed() {
  const { data: session } = useSession();
  const { theme } = useDaisyTheme();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({ page: 1, hasMore: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [composer, setComposer] = useState({
    content: "",
    category: "experiences",
  });
  const [replyText, setReplyText] = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [pendingAction, setPendingAction] = useState("");

  const viewer = useMemo(() => {
    const storedUser = getStoredUser();
    return {
      token: session?.user?.userToken || storedUser.token || session?.user?.email || "guest",
      email: session?.user?.email || storedUser.email,
      name: session?.user?.name || storedUser.name || "Yuva Member",
    };
  }, [session]);

  const requestHeaders = useCallback(() => {
    const headers = { "Content-Type": "application/json" };
    if (viewer.token) headers["x-yuva-token"] = viewer.token;
    if (viewer.email) headers["x-yuva-email"] = viewer.email;
    return headers;
  }, [viewer]);

  const loadPosts = useCallback(
    async ({ page = 1, append = false } = {}) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError("");

      try {
        const params = new URLSearchParams({
          category: activeCategory,
          search: debouncedSearch,
          page: String(page),
          limit: "8",
        });
        const response = await fetch(`/api/community/posts?${params.toString()}`, {
          headers: requestHeaders(),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load community posts");
        }

        setPosts((currentPosts) => (append ? [...currentPosts, ...data.posts] : data.posts));
        setCounts(data.counts || {});
        setPagination(data.pagination || { page, hasMore: false });
      } catch (loadError) {
        setError(loadError.message || "Unable to load community posts");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [activeCategory, debouncedSearch, requestHeaders]
  );

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    loadPosts({ page: 1 });
  }, [loadPosts]);

  const updatePost = (updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const submitPost = async (event) => {
    event.preventDefault();

    if (!composer.content.trim()) return;

    setPendingAction("post");
    setError("");

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: requestHeaders(),
        body: JSON.stringify({
          ...composer,
          authorName: viewer.name,
          email: viewer.email,
          userToken: viewer.token,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to share post");
      }

      setPosts((currentPosts) => [data.post, ...currentPosts]);
      setComposer({ content: "", category: "experiences" });
      setShowComposer(false);
      setSuccessMessage("Post shared with the community.");
      setTimeout(() => setSuccessMessage(""), 3000);
      await loadPosts({ page: 1 });
    } catch (postError) {
      setError(postError.message || "Unable to share post");
    } finally {
      setPendingAction("");
    }
  };

  const toggleLike = async (postId) => {
    setPendingAction(`like-${postId}`);

    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: requestHeaders(),
        body: JSON.stringify({
          authorName: viewer.name,
          email: viewer.email,
          userToken: viewer.token,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update like");
      }

      updatePost(data.post);
    } catch (likeError) {
      setError(likeError.message || "Unable to update like");
    } finally {
      setPendingAction("");
    }
  };

  const submitReply = async (postId, event) => {
    event.preventDefault();
    const content = replyText[postId]?.trim();

    if (!content) return;

    setPendingAction(`reply-${postId}`);

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: requestHeaders(),
        body: JSON.stringify({
          content,
          authorName: viewer.name,
          email: viewer.email,
          userToken: viewer.token,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add reply");
      }

      updatePost(data.post);
      setReplyText((current) => ({ ...current, [postId]: "" }));
      setOpenReplies((current) => ({ ...current, [postId]: true }));
    } catch (replyError) {
      setError(replyError.message || "Unable to add reply");
    } finally {
      setPendingAction("");
    }
  };

  const visibleCount = counts[activeCategory] || 0;

  return (
    <div className="min-h-screen bg-base-200 text-base-content" data-theme={theme}>
      <div className="border-b border-base-300 bg-base-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold md:text-3xl">Student Community</h1>
            <p className="text-sm text-base-content/60">
              Real posts from learners, interns, and mentors
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-base-300 px-3 py-2 text-sm md:flex">
            <Users className="h-4 w-4 text-primary" />
            <span>{counts.all || 0} posts</span>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-4">
          <div className="bg-base-100 p-4 shadow-sm border border-base-300 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search community"
                className="input input-bordered w-full pl-9"
              />
            </div>
          </div>

          <div className="bg-base-100 p-3 shadow-sm border border-base-300 rounded-lg">
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-base-content/50">
              Categories
            </p>
            <div className="space-y-1">
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-200"
                  }`}
                >
                  <span>{category.label}</span>
                  <span className="text-xs opacity-80">{counts[category.id] || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success">
              <span>{successMessage}</span>
            </div>
          )}

          <div className="bg-base-100 p-4 shadow-sm border border-base-300 rounded-lg">
            {!showComposer ? (
              <button
                onClick={() => setShowComposer(true)}
                className="flex w-full items-center gap-3 rounded-lg border border-dashed border-base-300 p-4 text-left hover:border-primary hover:bg-base-200"
              >
                <div className="avatar placeholder">
                  <div className="w-10 rounded-full bg-primary text-primary-content">
                    <span>{viewer.name.slice(0, 1).toUpperCase()}</span>
                  </div>
                </div>
                <span className="text-base-content/60">
                  Share an experience, question, opportunity, or useful advice...
                </span>
              </button>
            ) : (
              <form onSubmit={submitPost} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    value={composer.category}
                    onChange={(event) =>
                      setComposer((current) => ({ ...current, category: event.target.value }))
                    }
                    className="select select-bordered sm:w-56"
                  >
                    {POST_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <div className="text-sm text-base-content/50 sm:py-3">
                    Posting as {viewer.name}
                  </div>
                </div>

                <textarea
                  value={composer.content}
                  onChange={(event) =>
                    setComposer((current) => ({ ...current, content: event.target.value }))
                  }
                  placeholder="Write something specific and useful for the community..."
                  className="textarea textarea-bordered min-h-32 w-full"
                  maxLength={1000}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-base-content/50">
                    {composer.content.length}/1000
                  </span>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowComposer(false)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!composer.content.trim() || pendingAction === "post"}
                      className="btn btn-primary btn-sm"
                    >
                      {pendingAction === "post" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Share Post
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-base-content/60">
              {`Showing ${visibleCount} ${activeCategory === "all" ? "community" : activeCategory} posts`}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border border-base-300 bg-base-100 py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-lg border border-base-300 bg-base-100 p-10 text-center">
              <MessageSquare className="mx-auto mb-3 h-9 w-9 text-base-content/40" />
              <h2 className="text-lg font-semibold">No posts found</h2>
              <p className="mt-1 text-sm text-base-content/60">
                Start the conversation or change your search/category filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="avatar placeholder">
                      <div className="w-11 rounded-full bg-primary text-primary-content">
                        <span className="text-sm font-semibold">{post.author.avatar}</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold">{post.author.name}</h2>
                        <span className="rounded-full bg-base-200 px-2 py-1 text-xs capitalize text-base-content/70">
                          {post.category}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-base-content/50">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(post.createdAt)}</span>
                        <span>{post.author.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line leading-7">{post.content}</p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-base-300 pt-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      disabled={pendingAction === `like-${post.id}`}
                      className={`btn btn-ghost btn-sm ${
                        post.likedByCurrentUser ? "text-error" : "text-base-content/70"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${post.likedByCurrentUser ? "fill-current" : ""}`}
                      />
                      {post.engagement.likes}
                    </button>

                    <button
                      onClick={() =>
                        setOpenReplies((current) => ({
                          ...current,
                          [post.id]: !current[post.id],
                        }))
                      }
                      className="btn btn-ghost btn-sm text-base-content/70"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {`${post.engagement.comments} replies`}
                    </button>
                  </div>

                  {openReplies[post.id] && (
                    <div className="mt-4 space-y-3 rounded-lg bg-base-200 p-4">
                      <form onSubmit={(event) => submitReply(post.id, event)} className="space-y-3">
                        <textarea
                          value={replyText[post.id] || ""}
                          onChange={(event) =>
                            setReplyText((current) => ({
                              ...current,
                              [post.id]: event.target.value,
                            }))
                          }
                          placeholder="Write a helpful reply..."
                          className="textarea textarea-bordered min-h-24 w-full bg-base-100"
                          maxLength={500}
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={!replyText[post.id]?.trim() || pendingAction === `reply-${post.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            {pendingAction === `reply-${post.id}` && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Reply
                          </button>
                        </div>
                      </form>

                      {post.replies.length > 0 && (
                        <div className="space-y-3">
                          {post.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3 rounded-lg bg-base-100 p-3">
                              <div className="avatar placeholder">
                                <div className="w-8 rounded-full bg-secondary text-secondary-content">
                                  <span className="text-xs font-semibold">{reply.author.avatar}</span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                  <span className="font-medium">{reply.author.name}</span>
                                  <span className="text-xs text-base-content/50">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm leading-6">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {pagination.hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => loadPosts({ page: pagination.page + 1, append: true })}
                disabled={isLoadingMore}
                className="btn btn-primary"
              >
                {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                Load More
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
