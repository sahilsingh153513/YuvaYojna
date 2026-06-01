import connectdb from "@/config/ConnectDb";
import CommunityPost from "@/model/communityPost";
import { getRequestAuthor, serializePost } from "@/app/api/community/utils";

export async function POST(request, { params }) {
  try {
    await connectdb();

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const author = await getRequestAuthor(request, body);

    const existingPost = await CommunityPost.exists({ _id: id, isActive: true });

    if (!existingPost) {
      return Response.json({ message: "Post not found" }, { status: 404 });
    }

    const unlikeResult = await CommunityPost.updateOne(
      { _id: id, isActive: true, likedBy: author.userToken },
      { $pull: { likedBy: author.userToken } }
    );

    const liked = unlikeResult.modifiedCount === 0;

    if (liked) {
      await CommunityPost.updateOne(
        { _id: id, isActive: true },
        { $addToSet: { likedBy: author.userToken } }
      );
    }

    const updatedPost = await CommunityPost.findOne({ _id: id, isActive: true });

    return Response.json({
      post: serializePost(updatedPost, author.userToken),
      liked,
    });
  } catch (error) {
    console.error("Community post like error:", error);
    return Response.json({ message: "Unable to update like" }, { status: 500 });
  }
}
