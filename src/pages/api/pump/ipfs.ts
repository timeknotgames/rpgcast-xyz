import type { APIRoute } from 'astro';

// Use Pinata for reliable IPFS uploads
const PINATA_API = 'https://api.pinata.cloud';

export const POST: APIRoute = async ({ request, locals }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  // Get Pinata JWT from environment
  const PINATA_JWT = (locals as any).runtime?.env?.PINATA_JWT ||
    import.meta.env.PINATA_JWT ||
    '';

  try {
    const incomingFormData = await request.formData();

    // Extract metadata fields
    const name = incomingFormData.get('name') as string;
    const symbol = incomingFormData.get('symbol') as string;
    const description = incomingFormData.get('description') as string;
    const twitter = incomingFormData.get('twitter') as string;
    const telegram = incomingFormData.get('telegram') as string;
    const website = incomingFormData.get('website') as string;
    const file = incomingFormData.get('file') as File | null;

    let imageUrl = '';

    // Step 1: Upload image to Pinata if provided
    if (file && file.size > 0) {
      const imageFormData = new FormData();
      imageFormData.append('file', file, file.name);

      const imageRes = await fetch(`${PINATA_API}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
        },
        body: imageFormData,
      });

      if (!imageRes.ok) {
        const errText = await imageRes.text();
        console.error('[Pinata] Image upload failed:', errText);
        return new Response(JSON.stringify({
          success: false,
          error: `Image upload failed: ${imageRes.status}`,
        }), { status: 500, headers });
      }

      const imageData = await imageRes.json();
      imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;
    }

    // Step 2: Create and upload metadata JSON
    const metadata = {
      name,
      symbol,
      description,
      image: imageUrl,
      showName: true,
      createdOn: 'https://rpgcast.xyz',
      ...(twitter && { twitter }),
      ...(telegram && { telegram }),
      ...(website && { website }),
    };

    const metadataRes = await fetch(`${PINATA_API}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${symbol}-metadata`,
        },
      }),
    });

    if (!metadataRes.ok) {
      const errText = await metadataRes.text();
      console.error('[Pinata] Metadata upload failed:', errText);
      return new Response(JSON.stringify({
        success: false,
        error: `Metadata upload failed: ${metadataRes.status}`,
      }), { status: 500, headers });
    }

    const metadataData = await metadataRes.json();
    const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;

    // Return in the same format PumpPortal expects
    return new Response(JSON.stringify({
      metadataUri,
      metadata,
    }), { headers });

  } catch (error: any) {
    console.error('[PumpIPFS] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to upload to IPFS',
    }), { status: 500, headers });
  }
};
