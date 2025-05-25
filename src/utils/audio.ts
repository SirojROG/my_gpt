
/**
 * Audio utility functions for managing sound and music
 */

// Check if audio file exists before attempting to play
const checkAudioFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (e) {
    console.error(`Error checking audio file ${url}:`, e);
    return false;
  }
};

// Create and setup an audio element with error handling
export const createAudio = async (
  url: string, 
  volume = 0.5, 
  loop = false
): Promise<HTMLAudioElement | null> => {
  // Try different possible paths for Vercel deployment
  const possiblePaths = [
    url,
    url.startsWith('/') ? url.slice(1) : `/${url}`,
    `./public${url}`,
    `${window.location.origin}${url}`,
    `/public${url}`
  ];
  
  let audio: HTMLAudioElement | null = null;
  
  for (const path of possiblePaths) {
    try {
      const exists = await checkAudioFileExists(path);
      if (exists) {
        audio = new Audio(path);
        break;
      }
    } catch (e) {
      console.log(`Trying next path for audio: ${path}`);
      continue;
    }
  }
  
  if (!audio) {
    console.error(`Audio file not found in any path: ${url}`);
    return null;
  }
  
  try {
    audio.volume = volume;
    audio.loop = loop;
    audio.preload = "auto";
    
    return new Promise((resolve) => {
      const handleCanPlay = () => {
        audio?.removeEventListener('canplaythrough', handleCanPlay);
        audio?.removeEventListener('error', handleError);
        resolve(audio);
      };
      
      const handleError = () => {
        audio?.removeEventListener('canplaythrough', handleCanPlay);
        audio?.removeEventListener('error', handleError);
        console.error(`Error loading audio from ${audio?.src}`);
        resolve(null);
      };
      
      audio?.addEventListener('canplaythrough', handleCanPlay);
      audio?.addEventListener('error', handleError);
      
      // Fallback timeout
      setTimeout(() => {
        if (audio && audio.readyState >= 3) {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve(audio);
        } else {
          console.warn(`Audio loading timeout for ${url}`);
          resolve(audio);
        }
      }, 5000);
    });
  } catch (e) {
    console.error(`Error creating audio for ${url}:`, e);
    return null;
  }
};

// Play audio with proper error handling
export const playAudio = async (audio: HTMLAudioElement | null): Promise<boolean> => {
  if (!audio) return false;
  
  try {
    audio.currentTime = 0;
    
    // For Vercel and modern browsers, ensure user interaction
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      await playPromise;
      return true;
    }
    
    return true;
  } catch (e) {
    // Silently handle autoplay restrictions
    if (e instanceof Error && e.name === 'NotAllowedError') {
      console.log('Audio autoplay prevented. User interaction needed.');
      return false;
    }
    console.error("Error playing audio:", e);
    return false;
  }
};

// Pause audio with error handling
export const pauseAudio = (audio: HTMLAudioElement | null): boolean => {
  if (!audio) return false;
  
  try {
    audio.pause();
    return true;
  } catch (e) {
    console.error("Error pausing audio:", e);
    return false;
  }
};

// Set audio volume
export const setAudioVolume = (audio: HTMLAudioElement | null, volume: number): boolean => {
  if (!audio) return false;
  
  try {
    audio.volume = Math.max(0, Math.min(1, volume));
    return true;
  } catch (e) {
    console.error("Error setting audio volume:", e);
    return false;
  }
};
