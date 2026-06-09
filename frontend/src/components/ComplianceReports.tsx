import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ComplianceReportsProps {
  styles: { [key: string]: React.CSSProperties };
  onClick?: () => void;
}

export default function ComplianceReports({ styles, onClick }: ComplianceReportsProps) {
  return (
    <button type="button" style={styles.actionBtn} onClick={onClick}>
      <AlertCircle size={20} />
      <span>Compliance Reports</span>
    </button>
  );
}
