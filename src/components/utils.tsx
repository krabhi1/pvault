export type ReactProps<T> = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & T;
