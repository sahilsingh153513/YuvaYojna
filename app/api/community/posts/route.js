import connectdb from "@/config/ConnectDb";
import CommunityPost from "@/model/communityPost";
import {
  COMMUNITY_CATEGORIES,
  getCategoryCounts,
  getRequestAuthor,
  serializePost,
} from "@/app/api/community/utils";

export async function GET(request) {
  try {
    await connectdb();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search")?.trim() || "";
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 10), 1), 25);
    const viewerToken = request.headers.get("x-yuva-token");

    const query = { isActive: true };

    if (category !== "all") {
      if (!COMMUNITY_CATEGORIES.includes(category)) {
        return Response.json({ message: "Invalid category" }, { status: 400 });
      }
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const [posts, total, counts] = await Promise.all([
      CommunityPost.find(query)
        .sort(search ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      CommunityPost.countDocuments(query),
      getCategoryCounts(search),
    ]);

    return Response.json({
      posts: posts.map((post) => serializePost(post, viewerToken)),
      counts,
      pagination: {
        page,
        limit,
        total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Community posts fetch error:", error);
    return Response.json({ message: "Unable to load community posts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectdb();

    const body = await request.json();
    const content = body.content?.trim();
    const category = body.category || "experiences";

    if (!content || content.length < 5) {
      return Response.json({ message: "Post content must be at least 5 characters" }, { status: 400 });
    }

    if (!COMMUNITY_CATEGORIES.includes(category)) {
      return Response.json({ message: "Invalid category" }, { status: 400 });
    }

    const attachmentUrl = body.attachmentUrl?.trim();
    const attachmentTitle = body.attachmentTitle?.trim();
    const author = await getRequestAuthor(request, body);

    const post = await CommunityPost.create({
      author,
      content,
      category,
      attachment: attachmentUrl
        ? {
            url: attachmentUrl,
            title: attachmentTitle || attachmentUrl,
          }
        : undefined,
    });

    return Response.json({ post: serializePost(post, author.userToken) }, { status: 201 });
  } catch (error) {
    console.error("Community post create error:", error);
    return Response.json({ message: "Unable to create community post" }, { status: 500 });
  }
}
