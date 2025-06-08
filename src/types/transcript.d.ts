interface Sentence {
  text: string;
  timestamp: number; // 秒數
  selected: boolean;
}

interface Section {
  title: string;
  start: number;
  end: number;
  sentences: Sentence[];
}