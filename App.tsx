
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, Globe, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { toPng } from 'html-to-image';
import { parseExif } from './utils/exifHelper';
import { ExifData, WatermarkConfig, Language } from './types';
import { PhotoFrame } from './components/PhotoFrame';
import { Controls } from './components/Controls';
import { translations } from './utils/translations';
import clsx from 'clsx';

const App: React.FC = () => {
  const [image, setImage] = useState<{ src: string; file: File } | null>(null);
  const [exif, setExif] = useState<ExifData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('zh'); 
  const [key, setKey] = useState(0); 
  
  const frameRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
  }, []);

  const [config, setConfig] = useState<WatermarkConfig>({
    theme: 'light',
    logoType: 'red-dot',
    customLogoText: 'LEICA',
    template: 'classic',
    font: 'Inter',
    showExif: true,
    showDate: true,
    showDevice: true,
    showLens: true,
    padding: 24,
    shadow: true,
    customColorModel: undefined,
    customColorLens: undefined,
    customColorDate: undefined,
    customColorLocation: undefined,
  });

  const t = translations[lang];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file.type.startsWith('image/')) {
        setError('Please choose a valid image file.');
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const exifData = await parseExif(file);
        setExif(exifData);
        if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
        const src = URL.createObjectURL(file);
        imageUrlRef.current = src;
        setImage({ src, file });
        setKey(prev => prev + 1); 

        const make = exifData.make.toLowerCase();
        const model = exifData.model.toLowerCase();
        const combined = make + " " + model;

        const setBrand = (brandName: string, type: 'text-only' | 'minimal' | 'red-dot' | 'custom-image' = 'text-only') => {
            setConfig(prev => ({ ...prev, logoType: type, customLogoText: brandName }));
        };

        if (combined.includes('redmi')) setBrand('Redmi');
        else if (combined.includes('xiaomi')) setBrand('Xiaomi');
        else if (combined.includes('sony')) setBrand('Sony');
        else if (combined.includes('canon')) setBrand('Canon');
        else if (combined.includes('nikon')) setBrand('Nikon');
        else if (combined.includes('fujifilm') || combined.includes('fuji')) setBrand('Fujifilm');
        else if (combined.includes('leica')) setBrand('Leica', 'red-dot');
        else if (combined.includes('hasselblad')) setBrand('Hasselblad');
        else if (combined.includes('apple') || combined.includes('iphone')) setBrand('Apple', 'minimal');
        else if (combined.includes('dji')) setBrand('DJI');
      } catch (err) {
        console.error("Failed to load image", err);
        setError("Unable to read that image. Please try another file.");
      } finally {
        setLoading(false);
      }
    }
  };

  const updateExif = (key: keyof ExifData, value: string) => {
    setExif(prev => prev ? ({ ...prev, [key]: value }) : null);
  };

  const updateConfig = (key: keyof WatermarkConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleDownload = useCallback(async () => {
    if (frameRef.current === null) return;
    setIsDownloading(true);
    try {
      await document.fonts.ready;
      await new Promise((resolve) => setTimeout(resolve, 800));
      const maxExportSide = 4096;
      const largestSide = Math.max(frameRef.current.offsetWidth, frameRef.current.offsetHeight);
      const pixelRatio = Math.max(1, Math.min(2, maxExportSide / largestSide));
      const dataUrl = await toPng(frameRef.current, { quality: 1.0, pixelRatio, cacheBust: true });
      const link = document.createElement('a');
      link.download = `gleam-imprint-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      setError('Export failed. Please try again after the preview finishes loading.');
    } finally {
      setIsDownloading(false);
    }
  }, [frameRef]);

  const MockCamera = () => (
    <div className="relative w-36 h-36 md:w-48 md:h-48 bg-neutral-900 rounded-[1.75rem] shadow-[0_28px_70px_-18px_rgba(15,23,42,0.75)] flex flex-col items-center justify-center border-[6px] border-neutral-800 z-20 mx-auto transform transition-transform hover:scale-[1.03] duration-500">
        <div className="absolute -inset-3 rounded-[2.1rem] border border-white/60 -z-10"></div>
        <div className="absolute top-0 w-1/2 h-2 bg-neutral-800 rounded-b-lg"></div>
        <div className="absolute top-4 md:top-6 flex w-full px-6 justify-between items-start">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)] animate-pulse"></div>
            <div className="w-10 h-6 md:w-14 md:h-8 bg-neutral-700 rounded-lg border-2 border-neutral-600 shadow-inner"></div>
        </div>
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-800 border-[6px] border-neutral-700 flex items-center justify-center shadow-2xl mt-2 md:mt-4 relative group cursor-pointer">
            <div className="w-16 h-16 md:w-22 md:h-22 rounded-full bg-black border-[3px] border-neutral-600 flex items-center justify-center overflow-hidden relative">
                <div className="absolute w-8 h-8 bg-white/10 rounded-full top-2 right-2 blur-[2px]"></div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0a0a0a] border border-neutral-800 relative z-10"></div>
            </div>
        </div>
        <div className="absolute bottom-[-4px] w-32 md:w-40 h-3 bg-neutral-950 rounded-b-xl border-x border-b border-neutral-800 shadow-md"></div>
    </div>
  );

  const MockPhoto = ({ src, type = 'classic', rotate = 0, className, delay = 0 }: any) => (
    <div className={clsx("absolute bg-white/95 ring-1 ring-black/[0.04] shadow-[0_18px_35px_-14px_rgba(15,23,42,0.42)] transition-all duration-500 hover:scale-105 hover:z-50 hover:shadow-2xl", className)} style={{ transform: `rotate(${rotate}deg)`, animationDelay: `${delay}ms` }}>
        {type === 'classic' ? (
            <div className="w-32 md:w-44 p-1 pb-3 bg-white rounded-sm">
                 <div className="h-24 md:h-32 w-full bg-gray-100 overflow-hidden relative"><img src={src} className="w-full h-full object-cover" alt="mock" /></div>
                 <div className="mt-2 px-1.5 flex justify-between items-center">
                    <div><div className="h-1.5 w-12 bg-neutral-800 rounded-full mb-1"></div><div className="h-1 w-8 bg-neutral-300 rounded-full"></div></div>
                    <div className="flex gap-1.5 items-center"><div className="h-3 w-3 bg-[#D40000] rounded-full"></div><div className="h-4 w-[1px] bg-neutral-200"></div><div className="h-1 w-6 bg-neutral-400 rounded-full"></div></div>
                 </div>
            </div>
        ) : (
            <div className="w-28 md:w-36 p-2 pb-6 bg-white shadow-sm">
                <div className="h-24 md:h-32 w-full bg-gray-100 overflow-hidden mb-2 filter contrast-[1.1] sepia-[0.2]"><img src={src} className="w-full h-full object-cover" alt="mock" /></div>
                <div className="h-2 w-16 bg-neutral-200 rounded-full mx-auto"></div>
            </div>
        )}
    </div>
  );

  const LandingPage = () => (
    <div className="min-h-full flex flex-col items-center justify-center w-full relative overflow-hidden bg-[#f6f4f1]">
        <div className="absolute inset-4 md:inset-7 rounded-[2rem] border border-black/[0.045] pointer-events-none" />
        <div className="absolute top-[-25%] right-[-10%] w-[560px] h-[560px] bg-rose-200/40 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-[-18%] left-[-14%] w-[620px] h-[620px] bg-sky-200/35 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[28%] left-[8%] hidden lg:block text-[10px] font-bold tracking-[0.28em] text-gray-400 [writing-mode:vertical-rl]">KEEP THE MOMENT</div>
        <div className="z-10 flex flex-col items-center text-center px-5 max-w-6xl w-full py-10 md:py-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/75 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-gray-600 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-[#D40000]" />
                {t.landingEyebrow}
            </div>
            <div className="relative w-full h-[255px] sm:h-[310px] md:h-[345px] mt-5 mb-8 md:mb-10 flex items-center justify-center">
                <div className="absolute h-40 w-40 md:h-56 md:w-56 rounded-full border border-dashed border-gray-300/80 animate-[spin_24s_linear_infinite]" />
                <MockCamera />
                <div className="absolute top-[54%] md:top-[56%] z-10 animate-[slideDown_1s_ease-out_forwards]">
                    <MockPhoto src="https://cdn.explorecams.com/storage/photos/OuPA14axhO_440.jpg" rotate={-2} type="classic" />
                </div>
                <MockPhoto src="https://cdn.explorecams.com/storage/photos/7m1zHuTP1U_440.jpg" rotate={-12} type="polaroid" className="top-7 left-[-28px] sm:left-[3%] md:left-[12%] opacity-0 animate-[fadeIn_0.8s_0.2s_ease-out_forwards]" />
                <MockPhoto src="https://cdn.explorecams.com/storage/photos/h2pPo8kd6t_440.jpg" rotate={8} type="classic" className="top-10 right-[-24px] sm:right-[4%] md:right-[15%] opacity-0 animate-[fadeIn_0.8s_0.4s_ease-out_forwards]" />
                <MockPhoto src="https://cdn.explorecams.com/storage/photos/mBK0RHQZEA_440.jpg" rotate={15} type="polaroid" className="top-[-12px] left-[20%] md:left-[29%] opacity-0 scale-90 blur-[1px] z-0 animate-[fadeIn_0.8s_0.6s_ease-out_forwards]" />
                <MockPhoto src="https://cdn.explorecams.com/storage/photos/RwDI4UkALl_440.jpg" rotate={-6} type="classic" className="bottom-[-16px] right-[1%] md:right-[10%] opacity-0 z-30 animate-[fadeIn_0.8s_0.5s_ease-out_forwards]" />
                <MockPhoto src="https://cdn.explorecams.com/storage/photos/EC4imWR5bc_440.jpg" rotate={-18} type="classic" className="bottom-[-34px] left-[-30px] md:left-[8%] opacity-0 scale-75 blur-[0.5px] z-20 animate-[fadeIn_0.8s_0.7s_ease-out_forwards]" />
                <MockPhoto src="https://cdn.explorecams.com/storage/photos/QA91U29X8u_440.jpg" rotate={22} type="polaroid" className="top-[-24px] right-[12%] md:right-[25%] opacity-0 scale-90 blur-[1px] z-0 animate-[fadeIn_0.8s_0.8s_ease-out_forwards]" />
            </div>
            <div className="relative z-50">
                <h1 className="text-[2.55rem] sm:text-5xl md:text-6xl font-black text-gray-900 mb-5 tracking-[-0.055em] leading-[1.06] max-w-4xl mx-auto">{t.landingTitle}</h1>
                <p className="text-[15px] md:text-lg text-gray-500 mb-7 md:mb-8 leading-relaxed max-w-xl mx-auto">{t.landingSubtitle}</p>
                <button onClick={() => fileInputRef.current?.click()} className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#D40000] text-white rounded-full font-bold text-base shadow-[0_16px_34px_-14px_rgba(212,0,0,0.7)] hover:bg-[#b30000] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    <Upload className="w-4 h-4" />
                    {t.landingBtn}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-gray-500">
                    <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#D40000]" />{t.landingPrivate}</span>
                    <span className="h-3 w-px bg-gray-300 hidden sm:block" />
                    <span>{t.landingTemplates}</span>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="h-[100dvh] w-screen bg-gray-100 flex flex-col font-sans overflow-hidden">
        <header className="h-16 bg-white/85 border-b border-gray-200/70 flex items-center justify-between px-5 md:px-8 z-50 backdrop-blur-xl shrink-0">
             <div className="flex items-center gap-2.5">
                 <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><Camera className="w-4 h-4" /></span>
                 <h1 className="font-bold text-[17px] tracking-tight text-gray-900">{t.appTitle}</h1>
                 <span className="hidden sm:inline-block h-4 w-px bg-gray-200" />
                 <span className="hidden sm:inline text-[10px] font-bold tracking-[0.16em] text-gray-400">PHOTO STUDIO</span>
             </div>
             <button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')} className="rounded-full border border-gray-200/80 bg-white px-2.5 py-1.5 hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5 text-xs font-semibold shadow-sm">
                 <Globe className="w-3.5 h-3.5" />
                 {lang.toUpperCase()}
             </button>
        </header>

        {!image ? (
            <div className="flex-1 relative overflow-y-auto">
                <LandingPage />
            </div>
        ) : (
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                <div className="min-h-[52vh] flex-1 bg-[#F0F0F0] overflow-hidden flex flex-col relative lg:min-h-0">
                     <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto custom-scrollbar relative bg-gray-200">
                         
                         {/* 复古拍立得相机外观 (吐纸槽) */}
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-[100] pointer-events-none">
                             <div className="relative h-20 bg-neutral-800 rounded-b-[3rem] shadow-2xl flex flex-col items-center border-x-[8px] border-b-[8px] border-neutral-900 animate-[slotVibrate_0.8s_0.2s_ease-in-out]">
                                 {/* 吐纸口缝隙 */}
                                 <div className="w-[85%] h-3 bg-black mt-10 rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] relative">
                                     <div className="absolute inset-x-4 inset-y-0.5 bg-neutral-900/50 rounded-full"></div>
                                 </div>
                                 {/* 细节质感 */}
                                 <div className="absolute bottom-2 left-10 w-4 h-4 rounded-full bg-neutral-700 border border-neutral-600"></div>
                                 <div className="absolute bottom-3 right-12 w-20 h-1 bg-neutral-900 rounded-full"></div>
                             </div>
                         </div>
                         
                         {loading ? (
                             <div className="flex flex-col items-center gap-3 text-gray-400 animate-pulse">
                                 <div className="w-12 h-12 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                                 <span className="text-sm font-medium">Processing...</span>
                             </div>
                         ) : (
                             <div 
                                key={key}
                                className="relative animate-[polaroidEject_1.5s_cubic-bezier(0.18,0,0.2,1)_forwards] will-change-transform origin-top mt-10"
                                style={{ zIndex: 40 }}
                             >
                                 <PhotoFrame ref={frameRef} imageSrc={image.src} exif={exif!} config={config} lang={lang} />
                                 {/* 显影效果遮罩 */}
                                 <div className="absolute inset-0 bg-white/60 animate-[polaroidDevelop_3s_1s_ease-out_forwards] pointer-events-none z-[45]"></div>
                             </div>
                         )}
                     </div>
                </div>
                <div className="w-full max-h-[48vh] border-t border-gray-200 bg-white z-[110] flex flex-col shadow-xl lg:w-[340px] lg:max-h-none lg:border-l lg:border-t-0">
                    <Controls exif={exif!} config={config} lang={lang} onExifChange={updateExif} onConfigChange={updateConfig} />
                    <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 space-y-3">
                         <button onClick={handleDownload} disabled={isDownloading} className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D40000] hover:bg-[#b30000]'}`}>
                            {isDownloading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Upload className="w-4 h-4 rotate-180" />}
                            {isDownloading ? 'Exporting...' : t.download}
                         </button>
                         <button onClick={() => { if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current); imageUrlRef.current = null; setImage(null); setExif(null); setError(null); }} className="w-full py-2.5 rounded-lg border border-gray-300 font-medium text-gray-600 hover:bg-white transition-all text-sm">{t.changePhoto}</button>
                    </div>
                </div>
            </div>
        )}
        {error && <div role="alert" className="fixed bottom-4 left-1/2 z-[200] -translate-x-1/2 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-lg">{error}</div>}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        <style>{`
            @keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes fadeIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes shimmer { 100% { transform: translateX(100%); } }
            
            /* 拍立得吐纸动画 */
            @keyframes polaroidEject {
                0% { transform: translateY(-100%) scaleY(0.2); opacity: 0; filter: brightness(1.5); }
                30% { transform: translateY(0) scaleY(1.1); opacity: 1; filter: brightness(1.2); }
                100% { transform: translateY(0) scaleY(1); opacity: 1; filter: brightness(1); }
            }

            /* 出片槽轻微震动反馈 */
            @keyframes slotVibrate {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                10%, 30%, 50% { transform: translateX(-51%) translateY(1px); }
                20%, 40%, 60% { transform: translateX(-49%) translateY(-1px); }
            }
            
            /* 模拟相纸显影 */
            @keyframes polaroidDevelop {
                0% { opacity: 1; backdrop-filter: blur(15px); }
                50% { opacity: 0.6; backdrop-filter: blur(5px); }
                100% { opacity: 0; backdrop-filter: blur(0); }
            }

            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
        `}</style>
    </div>
  );
};

export default App;

