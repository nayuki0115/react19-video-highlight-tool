// src/components/TranscriptPanel.tsx
import React from "react";

type Props = {
  transcript: Section[];
  onToggle: (secIdx: number, sentIdx: number) => void;
  onClickTime: (secIdx: number, sentIdx: number) => void;
};

const TranscriptPanel: React.FC<Props> = ({
  transcript,
  onToggle,
  onClickTime,
}) => {
  return (
    <div className="p-4 space-y-4">
      {transcript.map((section: Section, secIdx: number) => (
        <div key={secIdx} className="space-y-2">
          {/* 段落標題 */}
          <div className="text-sm font-medium text-neutral mb-1">
            {section.title}
          </div>

          {/* 句子列表 */}
          <div className="space-y-1">
            {section.sentences.map((sent: Sentence, sentIdx: number) => (
              <div
                key={sentIdx}
                className={`flex items-center px-2 py-1 rounded ${
                  sent.selected ? "bg-secondary/20" : "hover:bg-gray-100"
                }`}
              >
                {/* 勾選框 */}
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary mr-2"
                  checked={sent.selected}
                  onChange={() => onToggle(secIdx, sentIdx)}
                />
                {/* 句子文字 */}
                <div className="flex-1 text-sm text-neutral">
                  {sent.text}
                </div>
                {/* 點擊時間戳跳影片 */}
                <button
                  className="text-xs text-accent hover:underline ml-2"
                  onClick={() => onClickTime(secIdx, sentIdx)}
                >
                  {new Date(sent.timestamp * 1000)
                    .toISOString()
                    .substr(14, 5)}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptPanel;
