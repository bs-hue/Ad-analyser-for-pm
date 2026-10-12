import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Extracts Google Drive file ID from arbitrary drive links
 */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  // Match patterns:
  // https://drive.google.com/file/d/1A2B3C4D5E/view
  // https://drive.google.com/open?id=1A2B3C4D5E
  // https://drive.google.com/uc?id=1A2B3C4D5E
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch) return fileDMatch[1];

  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];

  return null;
}

/**
 * Extracts Google Drive folder ID from folder URLs
 */
export function extractDriveFolderId(url: string): string | null {
  if (!url) return null;
  // Match patterns:
  // https://drive.google.com/drive/folders/1A2B3C4D5E
  // https://drive.google.com/drive/u/0/folders/1A2B3C4D5E
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];
  return null;
}

/**
 * Verifies if a Google Drive link (file or folder) is public and accessible
 */
export async function verifyPublicDriveAccess(url: string): Promise<{
  success: boolean;
  type: 'folder' | 'file';
  id: string;
  message: string;
}> {
  if (!url) {
    throw new Error('No Google Drive URL provided.');
  }

  const folderId = extractDriveFolderId(url);
  const fileId = extractDriveFileId(url);

  if (folderId) {
    // Check folder access
    try {
      const res = await fetch(`https://drive.google.com/drive/folders/${folderId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        redirect: 'manual'
      });

      // If Google returns 302/301 redirecting to accounts.google.com, it is restricted/private
      const location = res.headers.get('location') || '';
      if (location.includes('accounts.google.com') || location.includes('ServiceLogin')) {
        return {
          success: false,
          type: 'folder',
          id: folderId,
          message: 'Folder is restricted. Please change General Access in Google Drive to "Anyone with the link can view".'
        };
      }

      return {
        success: true,
        type: 'folder',
        id: folderId,
        message: 'Public Google Drive folder verified. Creative videos will be accessible for AI teardowns.'
      };
    } catch (e: any) {
      return {
        success: false,
        type: 'folder',
        id: folderId,
        message: `Failed to verify folder access: ${e.message}`
      };
    }
  }

  if (fileId) {
    return {
      success: true,
      type: 'file',
      id: fileId,
      message: 'Direct video file link verified.'
    };
  }

  throw new Error('Invalid Google Drive URL. Must be a folder link (/drive/folders/...) or file link (/file/d/...).');
}

/**
 * Downloads a public Google Drive video file directly to a temporary path without OAuth
 */
export async function downloadPublicDriveVideo(
  driveUrlOrId: string,
  outputFilenamePrefix: string = 'ad_creative'
): Promise<{ filePath: string; sizeBytes: number; fileId: string }> {
  const fileId = extractDriveFileId(driveUrlOrId) || driveUrlOrId;
  if (!fileId || fileId.length < 5) {
    throw new Error(`Invalid Google Drive URL or File ID: ${driveUrlOrId}`);
  }

  const tmpDir = os.tmpdir();
  const targetPath = path.join(tmpDir, `${outputFilenamePrefix}_${fileId}_${Date.now()}.mp4`);

  // Direct export download URL
  const initialUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;

  const response = await fetch(initialUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download from Google Drive (status ${response.status})`);
  }

  // Check if Google returned an HTML confirmation page (happens with very large files)
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const htmlText = await response.text();
    // Look for confirm token in the html form
    const confirmMatch = htmlText.match(/confirm=([a-zA-Z0-9_-]+)/) || htmlText.match(/download_warning_[^=]+=([a-zA-Z0-9_-]+)/);
    if (confirmMatch) {
      const confirmToken = confirmMatch[1];
      const confirmedUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmToken}`;
      const confirmedRes = await fetch(confirmedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!confirmedRes.ok) {
        throw new Error(`Google Drive download confirmation failed (status ${confirmedRes.status})`);
      }
      const buffer = Buffer.from(await confirmedRes.arrayBuffer());
      fs.writeFileSync(targetPath, buffer);
      return { filePath: targetPath, sizeBytes: buffer.length, fileId };
    }
    throw new Error('Google Drive file appears to be private or requires authorization. Please set link to "Anyone with the link can view".');
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetPath, buffer);

  return {
    filePath: targetPath,
    sizeBytes: buffer.length,
    fileId
  };
}
