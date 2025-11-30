"use client";

import { useState, useEffect } from "react";
import userToken from "@/app/api/user/token";

interface Comment {
  id: number;
  comment: string;
  username: string;
}

export default function CommentSection({
  id,
  onClose,
}: {
  id: number;
  onClose: () => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const token = userToken();

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/comments/${id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setComments(data.data || data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const submitComment = async () => {
    if (!commentInput.trim()) return;
    setLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/comment/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: commentInput }),
      });

      setCommentInput("");
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    }

    setLoading(false);
  };

  return (
    <div className="w-full mt-5 p-4 border rounded-lg shadow-sm relative bg-white">
      {/* X BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-sm mb-3 font-semibold">Comments</h2>

      {/* Add Comment */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 px-3 py-2 text-xs border rounded-md outline-none"
        />
        <button
          onClick={submitComment}
          disabled={loading}
          className="px-3 py-2 bg-gray-700 text-white rounded-md text-xs"
        >
          Send
        </button>
      </div>

      {/* Scrollable Comments */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 && (
          <p className="text-gray-500 text-xs">No comments yet.</p>
        )}

        {comments.map((item) => (
          <div
            key={item.id}
            className="p-1 bg-white rounded-md shadow-sm flex gap-1"
          >
            {/* Profile Icon */}
            <div className="w-8 h-7 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-semibold">
              {item.username.charAt(0).toUpperCase()}
            </div>

            {/* Comment Text */}
            <div className="flex-1">
              <p className="text-[11px] font-semibold">{item.username}</p>
              <p className="text-[11px] text-gray-700">{item.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
