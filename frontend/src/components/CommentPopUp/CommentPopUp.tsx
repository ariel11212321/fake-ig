import React, { useState } from 'react';
import { MessageCircle, X } from "lucide-react";
import Comment from '../Comment';
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../../contexts/AuthContext";

export default function CommentPopUp({ comments, isOpen, setIsOpen }: {comments: any, isOpen: boolean, setIsOpen: any}) {
  const { sendRequest } = useHttp();
  const { token } = useAuth();
  

  return (
    <div className="relative">
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Comments</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4">
              {comments.map((comment: any) => (
                <Comment id={comment} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}