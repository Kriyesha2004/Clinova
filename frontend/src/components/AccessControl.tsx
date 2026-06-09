import React from 'react';
import { Lock } from 'lucide-react';

interface AccessControlProps {
  styles: { [key: string]: React.CSSProperties };
  onClick?: () => void;
}

export default function AccessControl({ styles, onClick }: AccessControlProps) {
  return (
    <button type="button" style={styles.actionBtn} onClick={onClick}>
      <Lock size={20} />
      <span>Access Control</span>
    </button>
  );
}
