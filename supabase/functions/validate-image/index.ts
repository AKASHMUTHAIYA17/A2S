import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid image magic bytes
const MAGIC_BYTES = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      console.error('Invalid content type:', contentType);
      return new Response(
        JSON.stringify({ valid: false, error: 'Content must be multipart/form-data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('No file provided');
      return new Response(
        JSON.stringify({ valid: false, error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validating file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.size);
      return new Response(
        JSON.stringify({ valid: false, error: 'File exceeds 5MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check MIME type
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validMimeTypes.includes(file.type)) {
      console.error('Invalid MIME type:', file.type);
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid file type. Only JPEG and PNG allowed.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Read file bytes to validate magic number
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Validate magic bytes
    const isJpeg = MAGIC_BYTES.jpeg.every((byte, index) => bytes[index] === byte);
    const isPng = MAGIC_BYTES.png.every((byte, index) => bytes[index] === byte);

    if (!isJpeg && !isPng) {
      console.error('Magic bytes validation failed - file content does not match image format');
      return new Response(
        JSON.stringify({ valid: false, error: 'File content does not match a valid image format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cross-check MIME type with magic bytes
    if ((file.type.includes('jpeg') || file.type.includes('jpg')) && !isJpeg) {
      console.error('MIME type claims JPEG but magic bytes disagree');
      return new Response(
        JSON.stringify({ valid: false, error: 'File content does not match declared type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (file.type.includes('png') && !isPng) {
      console.error('MIME type claims PNG but magic bytes disagree');
      return new Response(
        JSON.stringify({ valid: false, error: 'File content does not match declared type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File validation passed:', file.name);
    
    return new Response(
      JSON.stringify({ 
        valid: true, 
        filename: file.name,
        size: file.size,
        type: isJpeg ? 'jpeg' : 'png'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Validation error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: 'Failed to validate file' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
