import connectdb from "@/config/ConnectDb";
import CommunityPost from "@/model/communityPost";
import { getRequestAuthor, serializePost } from "@/app/api/community/utils";

export async function POST(request, { params }) {
  try {
    await connectdb();

    const { id } = await params;
    const body = await request.json();
    const content = body.content?.trim();

    if (!content || content.length < 2) {
      return Response.json({ message: "Reply must be at least 2 characters" }, { status: 400 });
    }

    const author = await getRequestAuthor(request, body);
    const post = await CommunityPost.findOneAndUpdate(
      { _id: id, isActive: true },
      { $push: { comments: { author, content } } },
      { new: true, runValidators: true }
    );

    if (!post) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    return Response.json({ post: serializePost(post, author.userToken) }, { status: 201 });
  } catch (error) {
    console.error("Community post comment error:", error);
    return Response.json({ message: "Unable to add reply" }, { status: 500 });
  }
}
