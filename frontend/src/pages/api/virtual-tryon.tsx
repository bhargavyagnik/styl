import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const formData = await req.formData();
    const personImage = formData.get('personImage') as File;
    const garmentImageUrl = formData.get('garmentImageUrl') as string;
    if (!personImage || !garmentImageUrl) {
      return NextResponse.json({ error: 'Missing required files' }, { status: 400 });
    }

    // Prepare form data for Cloudinary upload
    const formd = new FormData();
    formd.append('file', personImage);
    formd.append('upload_preset', 'ml_default');
    formd.append('api-key', '157479452371397');
    formd.append('public_id', 'hZe6S_ltrY61M8rSs2pwGDTLJFg');

    // Upload person image to Cloudinary
    const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dhq2cfjxo/image/upload', {
      method: 'POST',
      body: formd,
    });

    // Assume Cloudinary upload is successful and assign a static URL for testing
    const personImageUrl = 'https://levi.in/cdn/shop/files/360870659_01_Style_Shot_5d84db9d-2e32-4fcb-b1b9-070ec2eebaaa.jpg?v=1695725691';

    console.log('Person image URL:', personImageUrl);

    // Prepare data for the virtual try-on
    const data = {
      data: [
        { path: personImageUrl },
        { path: garmentImageUrl },
        0,
        true,
      ],
    };

    // Call the virtual try-on API using fetch
    const tryOnResponse = await fetch('https://kwai-kolors-kolors-virtual-try-on.hf.space/call/tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const initialResult = await tryOnResponse.json();
    const eventId = initialResult.event_id;
    console.log('Event ID:', eventId,data);

    // Function to fetch updates (polling)
    const fetchUpdates = async () => {
      try {
        const response = await fetch(`https://kwai-kolors-kolors-virtual-try-on.hf.space/call/tryon/${eventId}`);
        
        if (response.ok) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder('utf-8');
          let buffer = '';

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              let lines = buffer.split('\n');

              for (let i = 0; i < lines.length - 1; i++) {
                if (lines[i].startsWith('event:')) {
                  const event = lines[i].split('event: ')[1];
                  const data = JSON.parse(lines[i + 1].split('data: ')[1]);
                  
                  if (event === 'complete' && data && data[0]) {
                    const resultUrl = data[0].url;
                    console.log('Result URL:', resultUrl);
                    return NextResponse.json({ image: resultUrl });
                  } else if (event === 'error') {
                    return NextResponse.json({
                      error: 'Could not do virtual try-on. Kolors is busy, please try again later.'
                    }, { status: 500 });
                  }
                }
              }
              buffer = lines[lines.length - 1];
            }
          }
        } else {
          throw new Error(`Error fetching updates: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error in fetching updates:', error);
        setTimeout(fetchUpdates, 2000); // Retry after a delay
      }
    };

    // Start polling for updates
    fetchUpdates();

  } catch (error) {
    console.error('Error occurred:', error);
    let errorMessage = 'An error occurred during the virtual try-on process';
    if (error instanceof TypeError) {
      errorMessage = 'There was a type error during the process';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
