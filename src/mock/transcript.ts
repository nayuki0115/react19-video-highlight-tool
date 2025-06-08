// 假資料：兩個 section，每段有三句 sample sentence
export const mockTranscript: Section[] = [
  {
    title: "第一段：開場介紹",
    start: 0,
    end: 60,            // 0–60 秒
    sentences: [
      {
        text: "這是影片的開頭，畫面呈現森林的景色。",
        timestamp: 5,    // 00:05
        selected: false,
      },
      {
        text: "接著出現主角 Big Buck Bunny，在草地上跳動。",
        timestamp: 20,   // 00:20
        selected: false,
      },
      {
        text: "牠正在享受陽光與綻放的花朵。",
        timestamp: 45,   // 00:45
        selected: false,
      },
    ],
  },
  {
    title: "第二段：遭遇麻煩",
    start: 60,
    end: 300,          // 60–300 秒
    sentences: [
      {
        text: "突然三隻惡蟲闖入，開始騷擾牠的家園。",
        timestamp: 75,   // 01:15
        selected: false,
      },
      {
        text: "Big Buck Bunny 嘗試趕走牠們，卻遭到攻擊。",
        timestamp: 150,  // 02:30
        selected: false,
      },
      {
        text: "蟲子們破壞了牠的花園與雕像。",
        timestamp: 250,  // 04:10
        selected: false,
      },
    ],
  },
  {
    title: "第三段：歸於平靜",
    start: 300,
    end: 596,          // 300–596 秒
    sentences: [
      {
        text: "兔子終於反擊成功，蟲子們逃散。",
        timestamp: 320,  // 05:20
        selected: false,
      },
      {
        text: "森林恢復和平，牠開始重建被破壞的家園。",
        timestamp: 450,  // 07:30
        selected: false,
      },
      {
        text: "影片在美麗的夕陽中畫下完美句點。",
        timestamp: 550,  // 09:10
        selected: false,
      },
    ],
  },
];