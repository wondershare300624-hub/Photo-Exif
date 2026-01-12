import React, { useRef, useState } from 'react';
import { ExifData, WatermarkConfig, Language, FontType, TemplateType } from '../types';
import { 
    ChevronDown, Upload as UploadIcon, Palette, Link as LinkIcon
} from 'lucide-react';
import { translations } from '../utils/translations';
import { Logo } from './Logo';

interface ControlsProps {
  exif: ExifData;
  config: WatermarkConfig;
  lang: Language;
  onExifChange: (key: keyof ExifData, value: string) => void;
  onConfigChange: (key: keyof WatermarkConfig, value: any) => void;
}

const BRANDS = [
  { name: 'Leica', type: 'red-dot' },
  { name: 'Xiaomi', type: 'text-only' },
  { name: 'Redmi', type: 'text-only' }, 
  { name: 'Sony', type: 'text-only' },
  { name: 'Canon', type: 'text-only' },
  { name: 'Nikon', type: 'text-only' },
  { name: 'Fujifilm', type: 'text-only' },
  { name: 'Hasselblad', type: 'text-only' },
  { name: 'Olympus', type: 'text-only' },
  { name: 'Panasonic', type: 'text-only' },
  { name: 'Pentax', type: 'text-only' },
  { name: 'Ricoh', type: 'text-only' },
  { name: 'Sigma', type: 'text-only' },
  { name: 'Tamron', type: 'text-only' },
  { name: 'Tokina', type: 'text-only' },
  { name: 'Samyang', type: 'text-only' },
  { name: 'Samsung', type: 'text-only' },
  { name: 'Apple', type: 'minimal' },
  { name: 'Huawei', type: 'text-only' },
  { name: 'Honor', type: 'text-only' },
  { name: 'Vivo', type: 'text-only' },
  { name: 'IQOO', type: 'text-only' },
  { name: 'Oppo', type: 'text-only' },
  { name: 'Realme', type: 'text-only' },
  { name: 'OnePlus', type: 'text-only' },
  { name: 'Meizu', type: 'text-only' },
  { name: 'Smartisan', type: 'text-only' },
  { name: 'HTC', type: 'text-only' },
  { name: 'Lenovo', type: 'text-only' },
  { name: 'ZTE', type: 'text-only' },
  { name: 'Nokia', type: 'text-only' },
  { name: 'Google', type: 'text-only' },
  { name: 'Asus', type: 'text-only' },
  { name: 'LG', type: 'text-only' },
  { name: 'Doov', type: 'text-only' },
  { name: 'Gionee', type: 'text-only' },
  { name: 'Hongmo', type: 'text-only' },
  { name: 'DJI', type: 'text-only' },
  { name: 'GoPro', type: 'text-only' },
  { name: 'Insta360', type: 'text-only' },
  { name: 'Zeiss', type: 'text-only' },
  { name: 'Kodak', type: 'text-only' },
  { name: 'RED', type: 'text-only' },
  { name: 'Phase One', type: 'text-only' },
  { name: 'BBK', type: 'text-only' },
  { name: 'Custom', type: 'custom-image' }
];

const FONTS: FontType[] = ['Inter', 'Cinzel', 'Playfair Display', 'Roboto', 'Lato', 'JetBrains Mono', 'Dancing Script', 'Noto Serif SC'];
// Removed 'glass' from THEMES
const THEMES = ['light', 'dark', 'yellow'];
const TEMPLATES: TemplateType[] = ['classic', 'clean', 'cinema', 'polaroid', 'blur', 'blur_glass', 'card', 'overlay', 'adobe'];

const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-sm font-bold text-gray-900 mb-3 mt-1 border-l-4 border-red-600 pl-2">{title}</h3>
);

const InputRow = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="flex items-center gap-3 mb-2">
        <label className="text-xs text-gray-500 w-16 shrink-0 text-right">{label}</label>
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all bg-white text-gray-800"
        />
    </div>
);

const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
    <div 
        className="flex items-center justify-between py-2.5 cursor-pointer group select-none hover:bg-gray-50 -mx-2 px-2 rounded-md transition-colors"
        onClick={() => onChange(!checked)}
    >
        <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900">{label}</span>
        <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${checked ? 'bg-red-500' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
    </div>
);

const renderTemplateThumbnail = (type: TemplateType) => {
    switch (type) {
        case 'classic':
            return (
                <div className="w-full h-full bg-gray-200 flex flex-col">
                    <div className="flex-1 bg-gray-300"></div>
                    <div className="h-[25%] bg-white flex items-center justify-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-red-500"></div>
                        <div className="w-6 h-0.5 bg-gray-200"></div>
                    </div>
                </div>
            );
        case 'clean':
            return (
                <div className="w-full h-full bg-white flex flex-col items-center justify-center gap-1 border border-gray-100">
                     <div className="w-[80%] h-[60%] bg-gray-200 rounded-sm"></div>
                     <div className="w-[40%] h-0.5 bg-gray-300"></div>
                </div>
            );
        case 'cinema':
            return (
                <div className="w-full h-full bg-black flex flex-col justify-center">
                    <div className="h-[70%] bg-gray-700 w-full flex items-end p-1">
                         <div className="w-full h-2 flex justify-between">
                             <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                             <div className="w-10 h-0.5 bg-white/20"></div>
                         </div>
                    </div>
                </div>
            );
        case 'polaroid':
            return (
                <div className="w-full h-full bg-black p-2 flex flex-col items-center justify-center relative border border-gray-800">
                    <div className="w-full h-[60%] bg-gray-700"></div>
                    <div className="text-[6px] text-red-500 font-bold mt-1">REC</div>
                </div>
            );
        case 'blur':
             return (
                 <div className="w-full h-full bg-gray-400 overflow-hidden relative">
                     <div className="absolute inset-0 bg-blue-300 opacity-50 blur-md scale-150"></div>
                     <div className="absolute inset-2 bg-gray-100 shadow-lg"></div>
                 </div>
             );
        case 'blur_glass':
            return (
                 <div className="w-full h-full bg-gray-800 overflow-hidden relative">
                     <div className="absolute inset-0 bg-purple-400 opacity-30 blur-md scale-150"></div>
                     <div className="absolute inset-2 bg-gray-200 shadow-lg z-10"></div>
                     <div className="absolute bottom-2 left-3 right-3 h-1.5 bg-white/30 backdrop-blur z-20 rounded-[1px] border border-white/20"></div>
                 </div>
            );
        case 'card':
            return (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <div className="w-[85%] h-[60%] bg-white rounded-md shadow-sm flex overflow-hidden">
                        <div className="w-[45%] bg-gray-200"></div>
                        <div className="flex-1"></div>
                    </div>
                </div>
            );
         case 'overlay':
             return (
                 <div className="w-full h-full bg-gray-300 relative">
                     <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-1 left-1 right-1 flex flex-col items-center">
                        <div className="w-4 h-0.5 bg-white/80"></div>
                        <div className="w-6 h-1 bg-white/40 mt-0.5"></div>
                     </div>
                 </div>
             );
         case 'adobe':
             return (
                 <div className="w-full h-full bg-[#333] flex items-center justify-center p-1">
                     <div className="w-[90%] h-[70%] bg-white rounded-[2px] flex overflow-hidden">
                         <div className="w-[35%] bg-white border-r border-gray-100"></div>
                         <div className="flex-1 bg-gray-800"></div>
                     </div>
                 </div>
             );
    }
};

export const Controls: React.FC<ControlsProps> = ({ 
  exif, config, lang, onExifChange, onConfigChange 
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeColorTarget, setActiveColorTarget] = useState<'model' | 'lens' | 'date' | 'location'>('model');

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const brandName = e.target.value;
      const brand = BRANDS.find(b => b.name === brandName);
      if (brand) {
          const newText = brandName === 'Custom' ? config.customLogoText : brandName;
          onConfigChange('customLogoText', newText);
          onConfigChange('logoType', brand.type);
      }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          onConfigChange('customLogoUrl', url);
          onConfigChange('logoType', 'custom-image');
      }
  };

  const getCurrentColorKey = () => {
     switch (activeColorTarget) {
         case 'model': return 'customColorModel';
         case 'lens': return 'customColorLens';
         case 'date': return 'customColorDate';
         case 'location': return 'customColorLocation';
         default: return 'customColorModel';
     }
  };

  const handleThemeChange = (theme: string) => {
    onConfigChange('theme', theme);
  };

  return (
    <div className="w-full h-full bg-white shadow-xl flex flex-col overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-8">
        
        {/* Themes Selector (Styled as "Style" in UI) */}
        <section>
             <SectionTitle title={t.theme} />

             <div className="grid grid-cols-3 gap-2 mb-4">
                {THEMES.map(theme => {
                    const isSelected = config.theme === theme;
                    let btnClass = "relative h-14 rounded-xl border text-sm font-bold transition-all flex flex-col items-center justify-center overflow-hidden shadow-sm";
                    
                    if (theme === 'light') {
                        btnClass += " bg-white text-gray-900 border-gray-200 hover:border-gray-300";
                    } else if (theme === 'dark') {
                        btnClass += " bg-[#121212] text-white border-gray-800 hover:bg-black";
                    } else if (theme === 'yellow') {
                        btnClass += " bg-black text-[#FFD700] border-[#FFD700]/30 hover:border-[#FFD700]";
                    }

                    if (isSelected) {
                        btnClass += " ring-2 ring-red-500 ring-offset-2 border-transparent";
                    }

                    return (
                        <button
                            key={theme}
                            onClick={() => handleThemeChange(theme)}
                            className={btnClass}
                        >
                             <span className="z-10">{t.themes[theme as keyof typeof t.themes]}</span>
                             
                             {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                             )}
                        </button>
                    );
                })}
             </div>
        </section>

        {/* Templates Selector */}
        <section>
          <SectionTitle title={t.selectTemplate} />
          <div className="grid grid-cols-3 gap-3 mb-2">
            {TEMPLATES.map(tmpl => (
                <button
                   key={tmpl}
                   onClick={() => onConfigChange('template', tmpl)}
                   className={`group flex flex-col items-center gap-1.5 p-1 rounded-lg transition-all ${config.template === tmpl ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                   <div className={`w-full aspect-[4/3] rounded border overflow-hidden relative shadow-sm transition-all ${config.template === tmpl ? 'border-red-500 ring-1 ring-red-500 shadow-md' : 'border-gray-200 group-hover:border-gray-300'}`}>
                       {renderTemplateThumbnail(tmpl)}
                   </div>
                   <span className={`text-[10px] font-medium leading-none ${config.template === tmpl ? 'text-red-600' : 'text-gray-500'}`}>
                      {t.templates[tmpl]}
                   </span>
                </button>
            ))}
          </div>
        </section>

        {/* Brand Section */}
        <section>
            <div className="flex items-center justify-between mb-2">
                 <SectionTitle title={t.cameraLogo} />
            </div>

            <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                    <select 
                        className="w-full border border-gray-200 rounded-md py-2.5 px-3 text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:border-red-500"
                        onChange={handleBrandChange}
                        value={BRANDS.find(b => b.name === config.customLogoText)?.name || 'Custom'}
                    >
                        {BRANDS.map(b => (
                            <option key={b.name} value={b.name}>{b.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-11 h-11 shrink-0 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-red-200 overflow-hidden relative group transition-all"
                  title={t.uploadLogo}
                >
                   <div className="transform scale-75 opacity-80 group-hover:opacity-20 transition-opacity">
                       <Logo type={config.logoType} customText={config.customLogoText} customUrl={config.customLogoUrl} theme={config.theme} />
                   </div>
                   
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <UploadIcon className="w-5 h-5 text-red-500" />
                   </div>
                </button>
            </div>

            {config.logoType === 'custom-image' && (
                <div className="flex items-center gap-2 mt-2">
                    <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                    <input 
                        type="text" 
                        placeholder={t.logoUrl || "https://..."}
                        value={config.customLogoUrl || ''}
                        onChange={(e) => onConfigChange('customLogoUrl', e.target.value)}
                        className="w-full border border-gray-200 rounded-md py-2 px-3 text-xs text-gray-600 focus:outline-none focus:border-red-500 bg-gray-50/50"
                    />
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleLogoUpload} 
            />
        </section>

        {/* Global Settings */}
        <section>
             <SectionTitle title={t.style} />

             {/* Font Selector */}
             <div className="flex items-center gap-3 mb-4 mt-3">
                  <label className="text-xs text-gray-500 w-16 shrink-0 text-right">{t.font}</label>
                  <div className="relative flex-1">
                    <select 
                        className="w-full border border-gray-200 rounded-md py-1.5 px-2 text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:border-red-500"
                        value={config.font}
                        onChange={(e) => onConfigChange('font', e.target.value)}
                    >
                        {FONTS.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>
                     <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
             </div>
             
             {/* Custom Text Colors */}
             <div className="mt-3 bg-gray-50/80 rounded-md p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700">{t.textColor}</label>
                    <Palette className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <select
                            className="w-full border border-gray-200 rounded-md py-1.5 px-2 text-xs text-gray-600 appearance-none bg-white focus:outline-none focus:border-red-500"
                            value={activeColorTarget}
                            onChange={(e) => setActiveColorTarget(e.target.value as any)}
                        >
                            <option value="model">{t.targets.model}</option>
                            <option value="lens">{t.targets.lens}</option>
                            <option value="date">{t.targets.date}</option>
                            <option value="location">{t.targets.location}</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative w-10 shrink-0">
                         <input 
                            type="color" 
                            className="w-full h-full rounded-md border border-gray-200 p-0.5 cursor-pointer bg-white"
                            value={(config as any)[getCurrentColorKey()] || '#000000'}
                            onChange={(e) => onConfigChange(getCurrentColorKey() as any, e.target.value)}
                         />
                    </div>
                </div>
             </div>

             {/* Toggles */}
             <div className="space-y-1 mt-4">
                 <Toggle label={t.hideLeft} checked={config.showDevice} onChange={(v) => {
                     onConfigChange('showDevice', v);
                     onConfigChange('showDate', v); 
                 }} />
                 <Toggle label={t.hideRight} checked={config.showExif} onChange={(v) => onConfigChange('showExif', v)} />
                 <div className="h-px bg-gray-100 my-2"></div>
                 <Toggle label="Shadow" checked={config.shadow} onChange={(v) => onConfigChange('shadow', v)} />
             </div>
        </section>

        {/* Lens Params */}
        <section>
            <SectionTitle title={t.lensParams} />
            <div className="space-y-1 mt-3">
                <InputRow label={t.focalLength} value={exif.focalLength} onChange={(v) => onExifChange('focalLength', v)} />
                <InputRow label={t.aperture} value={exif.fNumber} onChange={(v) => onExifChange('fNumber', v)} />
                <InputRow label={t.shutter} value={exif.exposureTime} onChange={(v) => onExifChange('exposureTime', v)} />
                <InputRow label={t.iso} value={exif.iso} onChange={(v) => onExifChange('iso', v)} />
            </div>
        </section>

        {/* Camera Params */}
        <section>
            <SectionTitle title={t.cameraParams} />
            <div className="space-y-1 mt-3">
                <InputRow label={t.camera} value={exif.model} onChange={(v) => onExifChange('model', v)} />
                <InputRow label={t.lens} value={exif.lensModel} onChange={(v) => onExifChange('lensModel', v)} />
                <InputRow label="GPS" value={exif.location || ''} onChange={(v) => onExifChange('location', v)} />
                <InputRow label={t.date} value={exif.dateTime} onChange={(v) => onExifChange('dateTime', v)} />
            </div>
        </section>

      </div>
    </div>
  );
};
