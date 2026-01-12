
import React, { forwardRef } from 'react';
import { ExifData, WatermarkConfig, Language } from '../types';
import { Logo } from './Logo';
import clsx from 'clsx';
import { Aperture, Battery } from 'lucide-react';

interface PhotoFrameProps {
  imageSrc: string;
  exif: ExifData;
  config: WatermarkConfig;
  lang?: Language;
}

// --- 原子组件：负责具体信息的显示逻辑 ---

const DeviceBrandGroup: React.FC<{ exif: ExifData, config: WatermarkConfig, themeStyles: any, className?: string }> = ({ exif, config, themeStyles, className }) => {
  if (!config.showDevice && !config.showDate) return null;
  return (
    <div className={clsx("flex flex-col", className)}>
      {config.showDevice && (
        <h3 
          className="text-xl md:text-2xl font-bold uppercase tracking-tight leading-none"
          style={{ color: config.customColorModel || themeStyles.mainText }}
        >
          {exif.model}
        </h3>
      )}
      {config.showDate && (
        <p 
          className="text-[11px] font-medium tracking-wide uppercase mt-1"
          style={{ color: config.customColorDate || themeStyles.subText }}
        >
          {exif.dateTime}
        </p>
      )}
    </div>
  );
};

const ExifParamsGroup: React.FC<{ exif: ExifData, config: WatermarkConfig, themeStyles: any, className?: string, variant?: 'row' | 'grid' | 'mono' }> = ({ exif, config, themeStyles, className, variant = 'row' }) => {
  if (!config.showExif) return null;

  const color = config.customColorLens || themeStyles.mainText;
  const subColor = config.customColorLocation || themeStyles.subText;

  if (variant === 'mono') {
    return (
      <div className={clsx("text-sm font-semibold tracking-tight opacity-70 flex gap-3 font-mono", className)} style={{ color }}>
         <span>{exif.focalLength}</span>
         <span className="opacity-30">/</span>
         <span>{exif.fNumber}</span>
         <span className="opacity-30">/</span>
         <span>{exif.exposureTime}</span>
         <span className="opacity-30">/</span>
         <span>{exif.iso}</span>
      </div>
    );
  }

  return (
    <div className={clsx("flex flex-col", className)}>
      <div className="flex items-baseline gap-3 font-bold text-base md:text-xl tracking-tight leading-none" style={{ color }}>
        <span>{exif.focalLength}</span>
        <span>{exif.fNumber}</span>
        <span>{exif.exposureTime}</span>
        <span>{exif.iso}</span>
      </div>
      {config.showLens && (exif.location || exif.lensModel) && (
        <div className="text-[10px] uppercase tracking-wide font-medium mt-1 opacity-80" style={{ color: subColor }}>
          {exif.location || exif.lensModel}
        </div>
      )}
    </div>
  );
};

// --- 模板引擎：只负责定义 EXIF 组件放在哪里 ---

export const PhotoFrame = forwardRef<HTMLDivElement, PhotoFrameProps>(
  ({ imageSrc, exif, config, lang = 'en' }, ref) => {
    
    // 基础主题颜色定义
    const isDark = config.theme === 'dark';
    const isYellow = config.theme === 'yellow';
    
    const themeStyles = {
      bg: isDark ? 'bg-[#121212]' : (isYellow ? 'bg-black' : 'bg-white'),
      mainText: isDark ? '#ffffff' : (isYellow ? '#FFD700' : '#000000'),
      subText: isDark ? '#9ca3af' : (isYellow ? 'rgba(255, 215, 0, 0.7)' : '#6b7280'),
      divider: isDark ? 'bg-gray-700' : (isYellow ? 'bg-[#FFD700]/30' : 'bg-gray-300'),
    };

    const fontStyle = { fontFamily: config.font };
    const paddingPx = config.padding * 1.5;

    // 渲染布局：根据配置切换不同的结构容器
    const renderLayout = () => {
      switch (config.template) {
        case 'classic':
          return (
            <div className={clsx("px-12 pb-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6", themeStyles.bg)} style={fontStyle}>
              <DeviceBrandGroup exif={exif} config={config} themeStyles={themeStyles} className="order-2 md:order-1 flex-1 items-center md:items-start text-center md:text-left" />
              <div className="flex items-center gap-6 order-1 md:order-2 h-12">
                <Logo type={config.logoType} customText={config.customLogoText} customUrl={config.customLogoUrl} theme={config.theme} />
                <div className={clsx("w-px h-10", themeStyles.divider)}></div>
                <ExifParamsGroup exif={exif} config={config} themeStyles={themeStyles} />
              </div>
            </div>
          );

        case 'clean':
          return (
            <div className={clsx("px-12 pb-12 pt-8 flex flex-col items-center justify-center gap-5 text-center", themeStyles.bg)} style={fontStyle}>
              <Logo type={config.logoType} customText={config.customLogoText} customUrl={config.customLogoUrl} theme={config.theme} />
              <div className="flex flex-col gap-2 items-center">
                 <ExifParamsGroup exif={exif} config={config} themeStyles={themeStyles} className="border-t pt-4 px-6 border-current/10" />
                 <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-semibold mt-1">
                    <span style={{ color: config.customColorModel || themeStyles.mainText }}>{exif.model}</span>
                    <span className="opacity-30">•</span>
                    <span style={{ color: config.customColorDate || themeStyles.subText }}>{exif.dateTime}</span>
                 </div>
              </div>
            </div>
          );

        case 'cinema':
          return (
            <div className={clsx("px-10 py-6 flex flex-row items-center justify-between mt-2", themeStyles.bg)} style={fontStyle}>
              <div className="flex items-center gap-5">
                 <Logo type={config.logoType} customText={config.customLogoText} customUrl={config.customLogoUrl} theme={config.theme} />
                 <div className={clsx("h-8 w-[1px] opacity-10", isYellow ? "bg-[#FFD700]" : "bg-current")}></div>
                 <DeviceBrandGroup exif={exif} config={config} themeStyles={themeStyles} />
              </div>
              <ExifParamsGroup exif={exif} config={config} themeStyles={themeStyles} variant="mono" />
            </div>
          );

        case 'polaroid':
          return (
            <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden p-0" style={{ fontFamily: 'monospace' }}>
              <img src={imageSrc} className="w-full h-auto" alt="dv-main" />
              <div className="absolute inset-0 z-20 p-6 md:p-12 flex flex-col justify-between pointer-events-none text-white">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div><span className="font-bold text-red-500">REC</span></div>
                    <Battery className="w-8 h-8 text-green-400" />
                 </div>
                 <div className="flex justify-between items-end">
                    <div className="flex flex-col font-bold text-[#FFFF00] text-lg">
                      <span>{exif.dateTime.split(' ')[1]} PM</span>
                      <span>{exif.dateTime.split(' ')[0]}</span>
                    </div>
                    <div className="text-right">
                       <div className="font-bold uppercase">{exif.model}</div>
                       <ExifParamsGroup exif={exif} config={config} themeStyles={{...themeStyles, mainText: '#fff'}} className="text-xs opacity-80" />
                    </div>
                 </div>
              </div>
            </div>
          );

        case 'blur_glass':
          const isGlassLight = config.theme === 'light';
          return (
            <div className="relative overflow-hidden w-full flex flex-col items-center justify-center p-0">
               <div className="absolute inset-[-50px] z-0">
                  <img src={imageSrc} className="w-full h-full object-cover filter blur-[80px] brightness-75" alt="bg" />
               </div>
               <div className="relative z-10 w-full flex flex-col items-center py-[8vh] px-[6vw]">
                  <div className="relative inline-block shadow-2xl rounded-sm overflow-hidden">
                    <img src={imageSrc} className="block w-full h-auto max-h-[80vh] object-contain" alt="main" />
                    <div className={clsx(
                      "absolute bottom-6 left-6 right-6 backdrop-blur-xl border rounded-2xl p-5 flex items-center justify-between",
                      isGlassLight ? "bg-white/60 border-white/40" : "bg-black/40 border-white/10"
                    )}>
                      <DeviceBrandGroup exif={exif} config={config} themeStyles={{...themeStyles, mainText: isGlassLight ? '#000' : '#fff'}} />
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <ExifParamsGroup exif={exif} config={config} themeStyles={{...themeStyles, mainText: isGlassLight ? '#000' : '#fff'}} className="text-xs" />
                        <Logo type={config.logoType} customText={config.customLogoText} customUrl={config.customLogoUrl} theme={isGlassLight ? 'light' : 'dark'} />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          );

        default:
          return null;
      }
    };

    // 包装器：处理边框和背景逻辑
    const isSpecialLayout = ['blur', 'blur_glass', 'card', 'overlay', 'adobe', 'polaroid'].includes(config.template);

    return (
      <div 
        ref={ref}
        id="photo-frame-export-target"
        className={clsx(
            "relative transition-all duration-300 ease-in-out mx-auto overflow-hidden",
            !isSpecialLayout && themeStyles.bg,
            config.shadow && "shadow-2xl"
        )}
        style={{ width: '100%', maxWidth: '1200px' }} 
      >
        {!isSpecialLayout && (
          <div style={{ padding: `${paddingPx}px` }} className="w-full">
              <img src={imageSrc} alt="Main" className="w-full h-auto block shadow-sm" />
          </div>
        )}

        {renderLayout()}
      </div>
    );
  }
);

PhotoFrame.displayName = 'PhotoFrame';
