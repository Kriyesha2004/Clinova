import React from 'react';
import { Shield } from 'lucide-react';

interface CityVisitTimeTableProps {
  styles: { [key: string]: React.CSSProperties };
  onClick?: () => void;
}

export default function CityVisitTimeTable({ styles, onClick }: CityVisitTimeTableProps) {
  return (
    <button type="button" style={styles.actionBtn} onClick={onClick}>
      <Shield size={20} />
      <span>City Visit Time Table</span>
    </button>
  );
}
