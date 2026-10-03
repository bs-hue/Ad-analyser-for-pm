import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Optimizes video file to 720p 24fps MP4 for high-speed Gemini AI multimodal analysis
 * Shrinks 100MB+ raw exports to ~4MB to 6MB with crystal sharp on-screen text.
 */
export async function optimizeVideoForAI(inputFilePath: string): Promise<{
  processedFilePath: string;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  wasCompressed: boolean;
}> {
  const stats = fs.statSync(inputFilePath);
  const originalSizeBytes = stats.size;

  // If already under 15MB, no re-encoding required
  if (originalSizeBytes <= 15 * 1024 * 1024) {
    return {
      processedFilePath: inputFilePath,
      originalSizeBytes,
      optimizedSizeBytes: originalSizeBytes,
      wasCompressed: false
    };
  }

  const tmpDir = os.tmpdir();
  const outputFilePath = path.join(tmpDir, `optimized_720p_${Date.now()}_${path.basename(inputFilePath)}`);

  try {
    // 720p scale with 24fps and crf 26 (fast preset)
    const cmd = `ffmpeg -y -i "${inputFilePath}" -vf "scale='min(1280,iw)':-2:flags=lanczos,fps=24" -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 96k "${outputFilePath}"`;
    await execAsync(cmd, { timeout: 30000 });

    if (fs.existsSync(outputFilePath)) {
      const optStats = fs.statSync(outputFilePath);
      // Remove original bloated file to preserve disk space
      try {
        fs.unlinkSync(inputFilePath);
      } catch (e) {
        // ignore
      }

      return {
        processedFilePath: outputFilePath,
        originalSizeBytes,
        optimizedSizeBytes: optStats.size,
        wasCompressed: true
      };
    }
  } catch (err) {
    console.warn('FFmpeg optimization warning; falling back to original file:', err);
  }

  // Fallback to original file if ffmpeg fails
  return {
    processedFilePath: inputFilePath,
    originalSizeBytes,
    optimizedSizeBytes: originalSizeBytes,
    wasCompressed: false
  };
}

/**
 * Safely removes temporary video files from /tmp
 */
export function cleanupTempVideo(filePath: string): void {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`Failed to cleanup temp video file ${filePath}:`, err);
  }
}
