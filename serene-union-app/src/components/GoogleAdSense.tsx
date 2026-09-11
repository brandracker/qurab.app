import React, { useEffect } from 'react';
import { ADSENSE_CONFIG, pushAdSense } from '../services/adsenseService';

interface GoogleAdSenseProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style
}) => {
  useEffect(() => {
    pushAdSense();
  }, [slot]);

  return (
    <div className={`adsense-container w-full overflow-hidden my-4 flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', textAlign: 'center' }}
        data-ad-client={ADSENSE_CONFIG.publisherId}
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default GoogleAdSense;
