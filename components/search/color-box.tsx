interface ColorBoxProps {
  color: string;
}

export const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: color }} />
);
