import ExifReader from 'exifreader';
import { ExifData } from '../types';
import { format, isValid } from 'date-fns';

export const parseExif = async (file: File): Promise<ExifData> => {
  try {
    const tags = await ExifReader.load(file);
    
    // Helper to safely get string values
    const getTag = (name: string): string => {
      const tag = tags[name];
      if (!tag) return '';
      if (typeof tag.value === 'string') return tag.value;
      if (Array.isArray(tag.value) && tag.value.length > 0) return String(tag.value[0]);
      return String(tag.value);
    };

    // Parse specific formats
    let exposureTime = getTag('ExposureTime');
    // Normalize fractions if they come in as decimals (basic handling)
    if (exposureTime && !exposureTime.includes('/') && !isNaN(Number(exposureTime))) {
        const val = Number(exposureTime);
        if (val < 1 && val > 0) {
            exposureTime = `1/${Math.round(1/val)}`;
        }
    }

    // Format Date
    let dateTime = getTag('DateTimeOriginal');
    if (!dateTime) dateTime = getTag('DateTime');
    
    try {
        if (dateTime) {
            const normalizedDate = dateTime.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
            const dateObj = new Date(normalizedDate);
            if (isValid(dateObj)) {
                dateTime = format(dateObj, 'yyyy.MM.dd HH:mm'); // Format matching screenshot: 2022.06.20 22:51
            }
        }
    } catch (e) {
        console.warn("Date parsing error", e);
    }

    // GPS Parsing
    let location = '';
    try {
        if (tags['GPSLatitude'] && tags['GPSLongitude']) {
            const parseCoord = (tag: any, ref: string) => {
                const values = tag.value as number[]; // [degrees, minutes, seconds]
                if (values && values.length === 3) {
                    return `${values[0]}°${values[1]}'${Math.round(values[2])}"${ref}`;
                }
                return '';
            };
            
            const latRef = getTag('GPSLatitudeRef') || 'N';
            const longRef = getTag('GPSLongitudeRef') || 'E';
            
            const lat = parseCoord(tags['GPSLatitude'], latRef);
            const long = parseCoord(tags['GPSLongitude'], longRef);
            
            if (lat && long) {
                location = `${lat} ${long}`;
            }
        }
    } catch (e) {
        console.warn("GPS parsing error", e);
    }


    return {
      make: getTag('Make') || 'Camera',
      model: getTag('Model') || 'Unknown Model',
      dateTime: dateTime || format(new Date(), 'yyyy.MM.dd HH:mm'),
      focalLength: getTag('FocalLength') ? `${Math.round(Number(getTag('FocalLength').replace('mm','')))}mm` : '--mm',
      fNumber: getTag('FNumber') ? `f/${getTag('FNumber')}` : 'f/--',
      exposureTime: exposureTime ? `${exposureTime}s` : '--s',
      iso: getTag('ISOSpeedRatings') ? `ISO${getTag('ISOSpeedRatings')}` : 'ISO--',
      lensModel: getTag('LensModel') || '',
      location: location
    };
  } catch (error) {
    console.error("Error parsing EXIF", error);
    return {
      make: 'Brand',
      model: 'Camera Model',
      dateTime: format(new Date(), 'yyyy.MM.dd HH:mm'),
      focalLength: '35mm',
      fNumber: 'f/1.8',
      exposureTime: '1/100s',
      iso: 'ISO100',
      lensModel: 'Prime Lens',
    };
  }
};