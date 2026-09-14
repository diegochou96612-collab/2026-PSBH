// ============================================================
// Footer – medical safety disclaimer (always visible)
// ============================================================

import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-slate-100 border-t border-slate-200 px-6 py-2 text-center">
    <p className="text-[11px] text-slate-500">
      本系統為研究 Prototype，數值與警示門檻皆為模擬資料，不作為臨床診斷或治療依據。
      &nbsp;|&nbsp;
      This system is a research prototype. All values and alert thresholds are simulated data and not clinically validated.
    </p>
  </footer>
);

export default Footer;
