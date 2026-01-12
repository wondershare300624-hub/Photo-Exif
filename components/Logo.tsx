import React, { useState, useEffect } from 'react';
import { Camera, Aperture } from 'lucide-react';

interface LogoProps {
  type: 'red-dot' | 'text-only' | 'minimal' | 'custom-image';
  customText: string;
  customUrl?: string;
  theme: 'light' | 'dark' | 'yellow' | 'glass';
}

// Map brands to filenames (GitHub CDN) or full URLs (User provided)
const BRAND_LOGOS: Record<string, string> = {
  // Mainstream
  'Canon': 'https://cdn.explorecams.com/images/canon.png',
  'Sony': 'https://cdn.explorecams.com/images/sony.png',
  'Nikon': 'https://cdn.explorecams.com/images/nikon.png',
  'Fujifilm': 'https://cdn.explorecams.com/images/fujifilm.png',
  'Leica': 'https://cdn.explorecams.com/images/leica.png',
  'Hasselblad': 'https://cdn.explorecams.com/images/hasselblad.png',
  'Olympus': 'https://cdn.explorecams.com/images/olympus.png',
  'Panasonic': 'https://cdn.explorecams.com/images/panasonic.png',
  'Pentax': 'https://cdn.explorecams.com/images/pentax.png',
  'Ricoh': 'Ricoh.svg',
  'Sigma': 'https://cdn.explorecams.com/images/sigma.png',
  'Zeiss': 'https://cdn.explorecams.com/images/zeiss.png',
  'Tamron': 'https://cdn.explorecams.com/images/tamron.png',
  'Tokina': 'https://cdn.explorecams.com/images/tokina.png',
  'Samyang': 'https://cdn.explorecams.com/images/samyang.png',
  
  // Mobile / Tech
  'Xiaomi': 'https://cdn.explorecams.com/images/xiaomi.png',
  'Redmi': 'https://youke1.picui.cn/s1/2025/12/08/69366e2437d0d.png',
  'Apple': 'https://cdn.explorecams.com/images/apple.png', 
  'Samsung': 'https://cdn.explorecams.com/images/samsung.png',
  'Huawei': 'https://cdn.explorecams.com/images/huawei.png',
  'Honor': 'https://youke1.picui.cn/s1/2025/12/08/69366df64a22e.png',
  'Vivo': 'https://cdn.explorecams.com/images/vivo.png',
  'IQOO': 'https://youke1.picui.cn/s1/2025/12/08/69366e083a6e2.png',
  'Oppo': 'https://cdn.explorecams.com/images/oppo.png',
  'Realme': 'Realme.svg',
  'OnePlus': 'https://cdn.explorecams.com/images/oneplus.png',
  'Google': 'https://cdn.explorecams.com/images/google.png',
  'Meizu': 'https://cdn.explorecams.com/images/meizu.png',
  'Smartisan': 'https://youke1.picui.cn/s1/2025/12/08/69366e24d8024.png',
  'HTC': 'https://cdn.explorecams.com/images/htc.png',
  'Lenovo': 'https://youke1.picui.cn/s1/2025/12/08/69366e084e31b.png',
  'ZTE': 'https://cdn.explorecams.com/images/zte.png',
  'Motorola': 'https://cdn.explorecams.com/images/motorola.png',
  'Nokia': 'https://cdn.explorecams.com/images/nokia.png',
  'Asus': 'https://cdn.explorecams.com/images/asus.png',
  'LG': 'https://cdn.explorecams.com/images/lg.png',
  'Doov': 'https://youke1.picui.cn/s1/2025/12/08/69366df61737c.png',
  'Gionee': 'https://youke1.picui.cn/s1/2025/12/08/69366df594f3a.png',
  'Hongmo': 'https://youke1.picui.cn/s1/2025/12/08/69366df61815c.png',
  
  // Action / Drones
  'DJI': 'DJI.svg',
  'GoPro': 'GoPro.svg',
  'Insta360': 'Insta360.svg',
  
  // Cinema / Other
  'RED': 'Red.svg',
  'Kodak': 'Kodak.svg',
  'Phase One': 'PhaseOne.svg',
  'BBK': 'https://youke1.picui.cn/s1/2025/12/08/69366e32b1079.png'
};

const CDN_BASE = "https://cdn.jsdelivr.net/gh/dearDreamWeb/camera-watermark@main/src/assets/images";

export const Logo: React.FC<LogoProps> = ({ type, customText, customUrl, theme }) => {
  const isDark = theme === 'dark';
  const isYellow = theme === 'yellow';
  const [imgError, setImgError] = useState(false);
  
  // Reset error state when inputs change
  useEffect(() => {
    setImgError(false);
  }, [type, customText, customUrl]);

  // Text color
  let textColor = 'text-black';
  if (isDark) textColor = 'text-white';
  if (isYellow) textColor = 'text-[#FFD700]';

  // Border color
  let borderColor = 'border-black/10';
  if (isDark) borderColor = 'border-white/20';
  if (isYellow) borderColor = 'border-[#FFD700]/30';

  // Helper to proxy external images for CORS support and format conversion
  const getSafeUrl = (url: string) => {
      if (!url.startsWith('http')) return url; // Relative, Blob, or Data URIs
      
      // We force ALL external URLs through wsrv.nl to:
      // 1. Ensure valid CORS headers (Access-Control-Allow-Origin: *)
      // 2. Convert SVGs (from jsdelivr) to PNGs to prevent canvas tainting issues in html-to-image
      // 3. Ensure HTTPS
      // 4. Resize slightly to ensure fast loading
      return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png&n=-1`;
  };

  // 1. Custom User Upload
  if (type === 'custom-image' && customUrl) {
      const isBlob = customUrl.startsWith('blob:');
      const safeCustomUrl = isBlob ? customUrl : getSafeUrl(customUrl);
      
      return (
          <img 
            src={safeCustomUrl} 
            alt="Brand Logo" 
            className="h-8 md:h-10 w-auto object-contain" 
            {...(!isBlob ? { crossOrigin: "anonymous", referrerPolicy: "no-referrer" } : {})}
            onError={() => setImgError(true)}
          />
      );
  }

  // 2. Known Brand Logo
  const brandKey = Object.keys(BRAND_LOGOS).find(key => 
    key.toLowerCase() === customText.toLowerCase()
  );

  // Fallback to text if image fails to load
  if (brandKey && !imgError) {
      const logoValue = BRAND_LOGOS[brandKey];
      const rawUrl = logoValue.startsWith('http') ? logoValue : `${CDN_BASE}/${logoValue}`;
      
      // Always proxy to ensure PNG format (fixing SVG issues) and CORS
      const safeUrl = getSafeUrl(rawUrl);
      
      let style: React.CSSProperties = {};
      if (brandKey !== 'Leica') {
        if (isDark) {
            style = { filter: 'brightness(0) invert(1)' };
        } else if (isYellow) {
            // Filter to turn black into #FFD700 (Gold)
            style = { filter: 'brightness(0) saturate(100%) invert(73%) sepia(91%) saturate(760%) hue-rotate(359deg) brightness(102%) contrast(107%)' };
        }
      }

      return (
        <img 
            src={safeUrl} 
            alt={customText} 
            className="h-6 md:h-8 w-auto object-contain" 
            style={style}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            onError={(e) => {
                console.warn("Logo load failed, falling back to text", e);
                setImgError(true);
            }}
        />
      );
  }

  // 3. Fallback: Text or Icon (Red Dot)
  if (type === 'red-dot') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-10 h-10 bg-[#D40000] rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white font-['Cinzel'] font-bold text-[8px] tracking-widest italic transform -rotate-12">
            {customText || 'LEICA'}
          </span>
        </div>
      </div>
    );
  }

  if (type === 'minimal') {
    return (
        <div className={`p-1.5 rounded-lg border ${borderColor}`}>
             <Aperture className={`w-6 h-6 ${textColor}`} strokeWidth={1.5} />
        </div>
    );
  }

  // Default Text Fallback
  return (
      <span className={`font-['Cinzel'] text-xl font-bold tracking-widest ${textColor}`}>
          {customText || 'SHOT ON'}
      </span>
  );
};