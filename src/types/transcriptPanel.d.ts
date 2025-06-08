type Props = {
  transcript: Section[];
  onToggle: (secIdx: number, sentIdx: number) => void;
  onClickTime: (secIdx: number, sentIdx: number) => void;
};
