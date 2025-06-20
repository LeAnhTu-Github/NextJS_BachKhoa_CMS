"use client";

import React, { useState, useMemo } from "react";

interface ExpandableTextProps {
  htmlContent: string;
  maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({
  htmlContent,
  maxLength = 100,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const textContent = useMemo(() => {
    if (typeof window === "undefined") {
      return htmlContent.replace(/<[^>]*>?/gm, "");
    }
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    return element.textContent || element.innerText || "";
  }, [htmlContent]);

  const isTruncated = textContent.length > maxLength;

  const toggleExpansion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      {isExpanded ? (
        <div
          className="prose prose-sm max-w-none break-words overflow-wrap-anywhere whitespace-normal"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      ) : (
        <p className="text-sm text-gray-700 break-words overflow-wrap-anywhere whitespace-normal">
          {isTruncated
            ? `${textContent.substring(0, maxLength)}...`
            : textContent}
        </p>
      )}
      {isTruncated && (
        <div className="w-full flex justify-end lg:justify-start">
          <button
            onClick={toggleExpansion}
            className="text-sm font-semibold text-red-500 hover:text-red-700 hover:underline focus:outline-none block"
          >
            <p className="underline"> {isExpanded ? "Ẩn đi" : "Xem thêm"}</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpandableText;