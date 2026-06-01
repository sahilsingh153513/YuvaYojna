import CommunityPost from "@/model/communityPost";
import YuserRegister from "@/model/yuserRegister";

export const COMMUNITY_CATEGORIES = ["experiences", "tips", "questions", "success"];

const fallbackNames = ["Yuva Member", "Community Member", "Student"];

export function getInitials(name = "YM") {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "YM";
}

export async function getRequestAuthor(request, body = {}) {
  const token = request.headers.get("x-yuva-token") || body.userToken || null;
  const email = request.headers.get("x-yuva-email") || body.email || null;

  if (token || email) {
    const user = await YuserRegister.findOne(
      token ? { userToken: token } : { email: email.toLowerCase() }
    ).lean();

    if (user) {
      return {
        userToken: user.userToken || token || user._id.toString(),
        name: user.fullName || user.email?.split("@")[0] || fallbackNames[0],
        email: user.email || email,
        avatar: getInitials(user.fullName || user.email),
        location: body.location || "Yuva Yojna Community",
      };
    }
  }

  const suppliedName = body.authorName?.trim();
  const name = suppliedName || fallbackNames[0];

  return {
    userToken: token || email || "guest",
    name,
    email,
    avatar: getInitials(name),
    location: body.location || "Yuva Yojna Community",
  };
}

export function serializePost(post, viewerToken = null) {
  const doc = typeof post.toObject === "function" ? post.toObject() : post;
  const likedBy = doc.likedBy || [];
  const comments = doc.comments || [];

  return {
    id: doc._id.toString(),
    author: doc.author,
    content: doc.content,
    category: doc.category,
    attachment: doc.attachment?.url ? doc.attachment : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    likedByCurrentUser: viewerToken ? likedBy.includes(viewerToken) : false,
    engagement: {
      likes: likedBy.length,
      comments: comments.length,
    },
    replies: comments.map((comment) => ({
      id: comment._id.toString(),
      author: comment.author,
      content: comment.content,
      createdAt: comment.createdAt,
    })),
  };
}

export async function getCategoryCounts(searchQuery = "") {
  const match = { isActive: true };

  if (searchQuery) {
    match.$text = { $search: searchQuery };
  }

  const counts = await CommunityPost.aggregate([
    { $match: match },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const byCategory = Object.fromEntries(counts.map((item) => [item._id, item.count]));
  const total = counts.reduce((sum, item) => sum + item.count, 0);

  return {
    all: total,
    experiences: byCategory.experiences || 0,
    tips: byCategory.tips || 0,
    questions: byCategory.questions || 0,
    success: byCategory.success || 0,
  };
}
