import { Outlet } from 'react-router-dom';

const Index = () => {

  // 檢查主題是否正確設定
console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
console.log('Primary color CSS var:', getComputedStyle(document.documentElement).getPropertyValue('--p'));

  return (
    <div className="min-h-screen w-full bg-base-100 flex flex-col">
      {/* Header: 強制貼齊上方 & 左右，背景也貼齊 */}
      <header className="bg-primary text-white px-6 py-3 flex justify-between items-center w-full fixed top-0 left-0 right-0 z-10">
        <div className="font-bold text-lg">🎬 Video Highlight Tool</div>
        {/* <button className="btn btn-sm btn-accent">💾 儲存</button> */}
      </header>

      {/* content 往下推 header 高度 */}
      <main className="flex-1 mt-16 px-4 w-full flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};


export default Index;
