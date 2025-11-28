"use client";

import { useState, useEffect } from "react";
import userToken from "@/app/api/user/token";

interface Comment {
    id: number,
    // comment:string,
    // username:string
}

export default function CommentSection({id}:Comment) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const token = userToken(); 
  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/comments/${id}/`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        }
      );
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Submit comment
  const submitComment = async () => {
    if (!commentInput.trim()) return;

    setLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/comments/${id}/user_id/${}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`, // JWT token
        },
        body: JSON.stringify({ comment: commentInput }),
      });

      setCommentInput("");
      fetchComments(); // refresh list
    } catch (error) {
      console.error("Error posting comment:", error);
    }

    setLoading(false);
  };

  return (
    <div className="w-full mt-5 p-4 border rounded-lg">
      <h2 className="text-md  mb-3 text-sm">Comments</h2>

      {/* Add Comment */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border rounded-md outline-none"
        />
        <button
          onClick={submitComment}
          disabled={loading}
          className="px-2  bg-gray-600 text-white rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="blue" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"  style={{ transform: "rotate(-50deg)" }} >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>

        </button>
      </div>

      {/* List Comments */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        {comments.map((item) => (
          <div key={item.id} className="p-3 bg-gray-100 rounded-md">
            {/* <p className="font-semibold">{item.username}</p>
            <p>{item.comment}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}
