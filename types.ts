
export type Language = 'en' | 'zh';

export type TemplateType = 'classic' | 'clean' | 'cinema' | 'polaroid' | 'blur' | 'blur_glass' | 'card' | 'overlay' | 'adobe';

export type FontType = 'Inter' | 'Cinzel' | 'Playfair Display' | 'Roboto' | 'Lato' | 'JetBrains Mono' | 'Dancing Script' | 'Noto Serif SC';

export interface ExifData {
  make: string;
  model: string;
  dateTime: string;
  focalLength: string;
  fNumber: string;
  exposureTime: string;
  iso: string;
  lensModel: string;
  location?: string; // New field for GPS coordinates
}

export interface WatermarkConfig {
  theme: 'light' | 'dark' | 'yellow' | 'glass';
  logoType: 'red-dot' | 'text-only' | 'minimal' | 'custom-image';
  customLogoText: string;
  customLogoUrl?: string; 
  template: TemplateType; 
  font: FontType; 
  showExif: boolean;
  showDate: boolean;
  showDevice: boolean;
  showLens: boolean; // Also controls showing Location in Classic mode
  padding: number; 
  shadow: boolean;
  
  // Custom Color Overrides
  customColorModel?: string;
  customColorLens?: string;
  customColorDate?: string;
  customColorLocation?: string;
}

export type ParsedImage = {
  src: string;
  file: File;
  exif: ExifData;
};
