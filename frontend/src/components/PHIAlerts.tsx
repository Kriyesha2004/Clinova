import React from 'react';
import { FileText } from 'lucide-react';

interface PHIAlertsProps {
  styles: { [key: string]: React.CSSProperties };
  onClick?: () => void;
}

export default function PHIAlerts({ styles, onClick }: PHIAlertsProps) {
  return (
    <button type="button" style={styles.actionBtn} onClick={onClick}>
      <FileText size={20} />
      <span>Alerts </span>
    </button>
  );
}
