import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TranscriptPanel from "@/components/TranscriptPanel";
import { useVideoStore } from "@/store/videoStore";

const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  // 從全域 store 拿影片 URL、轉錄資料，以及設定轉錄資料的方法
  const videoURL = useVideoStore((s) => s.videoURL);
  const transcript = useVideoStore((s) => s.transcript);
  const setTranscript = useVideoStore((s) => s.setTranscript);

  // 如果沒有上傳流程的資料，就導回首頁
  if (!videoURL || !transcript) {
    navigate("/", { replace: true });
    return null;
  }

  // 解析檔名
  const fileName = videoURL.split("/").pop() || "video.mp4";
  const videoRef = useRef<HTMLVideoElement>(null);

  // 同步播放需要的 state
  const [current, setCurrent] = useState<{ secIdx: number; sentIdx: number } | null>(null);
  const [duration, setDuration] = useState<number>(0);

  // Highlight 播放模式相關 state
  const [segments, setSegments] = useState<{ start: number; end: number }[]>([]);
  const [segIdx, setSegIdx] = useState(0);
  const [playingHighlight, setPlayingHighlight] = useState(false);

  // 淡入／淡出的遮罩透明度 (0=透明, 1=不透明)
  const [fadeOpacity, setFadeOpacity] = useState(0);

  // 每次 transcript 或影片長度改變，就重算要播放的片段列表
  useEffect(() => {
    const timestamps = transcript
      .flatMap((sec) => sec.sentences.filter((s) => s.selected))
      .map((s) => s.timestamp)
      .sort((a, b) => a - b);
    const segs = timestamps.map((t) => ({
      start: t,
      end: Math.min(t + 4, duration),
    }));
    setSegments(segs);
  }, [transcript, duration]);

  // 一般播放時：同步高亮、滾動到當前句
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    for (let i = 0; i < transcript.length; i++) {
      const sec = transcript[i];
      if (t >= sec.start && t <= sec.end) {
        let idx: number | null = null;
        sec.sentences.forEach((s, j) => {
          if (t >= s.timestamp) idx = j;
        });
        if (
          idx !== null &&
          (!current || current.secIdx !== i || current.sentIdx !== idx)
        ) {
          setCurrent({ secIdx: i, sentIdx: idx });
          const el = document.getElementById(`sentence-${i}-${idx}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }
    if (current) setCurrent(null);
  };

  // Highlight 模式下：播放到段尾時自動跳到下一段（並加淡入淡出）
  const handleTimeUpdateHL = () => {
    if (!videoRef.current || !playingHighlight) return;
    const t = videoRef.current.currentTime;
    const seg = segments[segIdx];
    if (seg && t >= seg.end) {
      // 淡出
      setFadeOpacity(1);
      setTimeout(() => {
        if (segIdx + 1 < segments.length) {
          // 下一段
          const next = segIdx + 1;
          setSegIdx(next);
          videoRef.current!.currentTime = segments[next].start;
          // 淡入
          setFadeOpacity(0);
          videoRef.current!.play();
        } else {
          // 全部片段播放完畢
          setPlayingHighlight(false);
          videoRef.current!.pause();
          setFadeOpacity(0);
        }
      }, 500); // 等待 500ms 的淡出動畫
    }
  };

  // 切換句子是否被選中
  const handleToggle = (secIdx: number, sentIdx: number) => {
    const copy = JSON.parse(JSON.stringify(transcript)) as Section[];
    copy[secIdx].sentences[sentIdx].selected =
      !copy[secIdx].sentences[sentIdx].selected;
    setTranscript(copy);
  };

  // 點擊時間戳：跳到該句時間並播放
  const handleClickTime = (secIdx: number, sentIdx: number) => {
    const t = transcript[secIdx].sentences[sentIdx].timestamp;
    if (videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.play();
    }
  };

  // 點擊段落標題：跳到該段開始時間並播放
  const handleClickSection = (secIdx: number) => {
    const t = transcript[secIdx].start;
    if (videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.play();
    }
  };

  // 影片 metadata 載入完成後取得影片總長度
  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  // 組出所有被選中的句子，用於 Timeline 標記
  const highlights = transcript
    .flatMap((sec, si) =>
      sec.sentences
        .filter((s) => s.selected)
        .map((s) => ({ secIdx: si, timestamp: s.timestamp, text: s.text }))
    )
    .sort((a, b) => a.timestamp - b.timestamp);
  
  // 按下「儲存 Highlight」要下載的資料結構
  const handleDownload = () => {
    // 我們下載的物件，可依需求擴充
    const data = {
      segments,   // 每段 { start, end }
      highlights, // 每句 { secIdx, timestamp, text }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "highlights.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-base-100">
      {/* Header 區塊 */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-primary text-primary-content px-6 flex items-center justify-between z-50">
        <span className="font-semibold text-lg truncate">
          🎬 編輯中：{fileName}
        </span>
        <div className="space-x-2">
          {/* 播放 Highlight 片段 */}
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              if (!segments.length) return;
              setSegIdx(0);
              setPlayingHighlight(true);
              // 先淡入（確保遮罩透明）
              setFadeOpacity(0);
              videoRef.current!.currentTime = segments[0].start;
              videoRef.current!.play();
            }}
          >
            ▶️ 播放 Highlight
          </button>
          <button className="btn btn-sm btn-secondary" onClick={handleDownload}>💾 儲存 Highlight</button>
        </div>
      </header>

      {/* Main 內容 */}
      <main className="flex-1 flex flex-col md:flex-row pt-14 w-full">
        {/* 左側 Editing 區 */}
        <aside className="w-full md:w-2/5 bg-base-200 border-r border-base-300 overflow-y-auto">
          <div className="sticky top-0 bg-base-200 px-4 py-2 border-b border-base-300 z-10">
            <h2 className="text-md font-semibold text-neutral">Editing Area</h2>
          </div>
          <TranscriptPanel
            transcript={transcript}
            onToggle={handleToggle}
            onClickTime={handleClickTime}
          />
        </aside>

        {/* 右側 Preview 區 */}
        <section className="w-full md:w-3/5 p-4 overflow-y-auto flex flex-col">
          {/* 影片播放器與字幕 */}
          <div className="mb-6 relative">
            <h2 className="text-md font-semibold text-neutral mb-3">
              Preview Area
            </h2>
            <div className="relative w-full h-[50vh] bg-black rounded-lg overflow-hidden shadow-lg">
              {/* 影片 */}
              <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                controls
                src={videoURL}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={() => {
                  handleTimeUpdate();
                  handleTimeUpdateHL();
                }}
                onPause={() => {
                  if (playingHighlight) setPlayingHighlight(false);
                }}
                onPlay={() => {
                  if (playingHighlight) setPlayingHighlight(false);
                }}
              />
              {/* 淡入/淡出遮罩 */}
              <div
                className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
                style={{ opacity: fadeOpacity }}
              />
              {/* 字幕 Overlay */}
              {current && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-lg px-4 py-2 rounded">
                  {transcript[current.secIdx].sentences[current.sentIdx].text}
                </div>
              )}
            </div>
          </div>

          {/* Timeline 區塊 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral mb-2">Timeline</h3>
            <div className="relative w-full h-8 bg-base-300 rounded overflow-hidden">
              {/* 顯示各段落範圍 */}
              {duration > 0 &&
                transcript.map((sec, i) => {
                  const left = (sec.start / duration) * 100;
                  const width = ((sec.end - sec.start) / duration) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 h-full bg-secondary/10"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  );
                })}

              {/* 刻度與時間標籤 */}
              {Array.from({ length: 6 }).map((_, i) => {
                const pct = (i / 5) * 100;
                const label = new Date(((duration * i) / 5) * 1000)
                  .toISOString()
                  .substr(14, 5);
                return (
                  <React.Fragment key={i}>
                    <div
                      className="absolute top-0 h-full w-px bg-base-400"
                      style={{ left: `${pct}%` }}
                    />
                    <span
                      className="absolute top-full mt-1 text-xs text-neutral"
                      style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
                    >
                      {label}
                    </span>
                  </React.Fragment>
                );
              })}

              {/* Highlight 標記 */}
              {duration > 0 &&
                highlights.map((h, idx) => {
                  const left = (h.timestamp / duration) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute top-0 h-full w-2 bg-accent rounded cursor-pointer"
                      style={{
                        left: `${left}%`,
                        transform: "translateX(-50%)",
                      }}
                      title={`${h.text} (${new Date(
                        h.timestamp * 1000
                      )
                        .toISOString()
                        .substr(14, 5)})`}
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = h.timestamp;
                          videoRef.current.play();
                        }
                      }}
                    />
                  );
                })}
            </div>
          </div>

          {/* 其他功能區 */}
          <div className="flex-1 text-center text-xs text-gray-500">
            
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditorPage;