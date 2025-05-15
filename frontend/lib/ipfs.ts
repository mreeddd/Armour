/**
 * IPFS integration for the LOVE platform.
 * 
 * This module provides functions for uploading and retrieving files from IPFS.
 */

import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// IPFS configuration
const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || 'https://ipfs.infura.io:5001';
const IPFS_API_PROJECT_ID = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID || '';
const IPFS_API_SECRET = process.env.NEXT_PUBLIC_IPFS_API_SECRET || '';
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';

// Initialize IPFS client
let ipfsClient: IPFSHTTPClient | undefined;

try {
  const auth = 'Basic ' + Buffer.from(IPFS_API_PROJECT_ID + ':' + IPFS_API_SECRET).toString('base64');
  
  ipfsClient = create({
    url: IPFS_API_URL,
    headers: {
      authorization: auth,
    },
  });
} catch (error) {
  console.error('IPFS client initialization error:', error);
  ipfsClient = undefined;
}

/**
 * Upload a file to IPFS.
 * 
 * @param file - The file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns The IPFS CID of the uploaded file
 */
export async function uploadFileToIPFS(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!ipfsClient) {
    throw new Error('IPFS client not initialized');
  }

  try {
    // Create a buffer from the file
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Upload to IPFS with progress tracking
    let lastProgress = 0;
    const added = await ipfsClient.add(
      { path: file.name, content: fileBuffer },
      { 
        progress: (bytes: number) => {
          const progress = Math.round((bytes / file.size) * 100);
          if (progress > lastProgress + 5) { // Update every 5%
            lastProgress = progress;
            onProgress?.(progress);
          }
        }
      }
    );

    // Return the CID
    return added.cid.toString();
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Upload JSON metadata to IPFS.
 * 
 * @param metadata - The metadata object to upload
 * @returns The IPFS CID of the uploaded metadata
 */
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  if (!ipfsClient) {
    throw new Error('IPFS client not initialized');
  }

  try {
    // Convert metadata to JSON string
    const metadataString = JSON.stringify(metadata);
    const metadataBuffer = Buffer.from(metadataString);

    // Upload to IPFS
    const added = await ipfsClient.add(
      { path: 'metadata.json', content: metadataBuffer }
    );

    // Return the CID
    return added.cid.toString();
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Get the IPFS gateway URL for a CID.
 * 
 * @param cid - The IPFS CID
 * @returns The gateway URL
 */
export function getIPFSGatewayURL(cid: string): string {
  // Remove ipfs:// prefix if present
  const cleanCid = cid.replace('ipfs://', '');
  return `${IPFS_GATEWAY}${cleanCid}`;
}

/**
 * Upload an agent's avatar and metadata to IPFS.
 * 
 * @param avatar - The avatar file
 * @param metadata - The agent metadata
 * @param onProgress - Optional callback for upload progress
 * @returns Object containing the avatar CID, metadata CID, and full metadata URI
 */
export async function uploadAgentToIPFS(
  avatar: File,
  metadata: any,
  onProgress?: (stage: string, progress: number) => void
): Promise<{ avatarCid: string; metadataCid: string; metadataUri: string }> {
  try {
    // Upload avatar
    onProgress?.('avatar', 0);
    const avatarCid = await uploadFileToIPFS(
      avatar,
      (progress) => onProgress?.('avatar', progress)
    );
    onProgress?.('avatar', 100);

    // Add avatar CID to metadata
    const metadataWithAvatar = {
      ...metadata,
      image: `ipfs://${avatarCid}`,
    };

    // Upload metadata
    onProgress?.('metadata', 0);
    const metadataCid = await uploadMetadataToIPFS(metadataWithAvatar);
    onProgress?.('metadata', 100);

    // Return CIDs and URI
    return {
      avatarCid,
      metadataCid,
      metadataUri: `ipfs://${metadataCid}`,
    };
  } catch (error) {
    console.error('Error uploading agent to IPFS:', error);
    throw new Error('Failed to upload agent to IPFS');
  }
}

/**
 * Fetch metadata from IPFS.
 * 
 * @param cid - The IPFS CID of the metadata
 * @returns The parsed metadata object
 */
export async function fetchMetadataFromIPFS(cid: string): Promise<any> {
  try {
    // Remove ipfs:// prefix if present
    const cleanCid = cid.replace('ipfs://', '');
    
    // Fetch from gateway
    const response = await fetch(`${IPFS_GATEWAY}${cleanCid}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    
    // Parse JSON
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching metadata from IPFS:', error);
    throw new Error('Failed to fetch metadata from IPFS');
  }
}
