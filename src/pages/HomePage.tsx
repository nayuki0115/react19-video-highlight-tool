import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '@/store/videoStore';

const HomePage = () => {
  const navigate = useNavigate();
  const setFile = useVideoStore((s) => s.setFile);
  const setVideoURL = useVideoStore((s) => s.setVideoURL);
  const setTranscript = useVideoStore((s) => s.setTranscript);

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    setLoading(true);

    // 用 blob URL 作為播放來源
    const url = URL.createObjectURL(file);
    setVideoURL(url);

    // 模擬 AI 延遲，並存 transcript
    setTimeout(() => {
      // 假資料
      import('@/mock/transcript').then(({ mockTranscript }) => {
        setTranscript(mockTranscript);
        setLoading(false);
        navigate('/editor');
      });
    }, 2000);
  };

  return (
    <div className="flex flex-1 items-center justify-center flex-col">
      <h1 className="text-2xl font-bold mb-4">📤 上傳你的影片</h1>
      <input
        type="file"
        accept="video/*"
        className="file-input file-input-bordered w-full max-w-xs"
        onChange={handleFileChange}
      />
      {loading && <p className="mt-4 text-neutral">AI 處理中，請稍候…</p>}
    </div>
  );
};

export default HomePage;