import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserRole } from '@/lib/admin-auth';
import { getRestaurantSubscription } from '@/lib/subscription';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to use the AI menu parser.' },
        { status: 401 }
      );
    }

    // Verify user authorization: super-admin/staff OR owner with a valid restaurant
    const { isAdminOrStaff } = await getCurrentUserRole(supabase);
    if (!isAdminOrStaff) {
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (!restaurant) {
        return NextResponse.json(
          { error: 'Forbidden: No restaurant owned by this account.' },
          { status: 403 }
        );
      }
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No menu image file provided.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please provide an image file.' },
        { status: 400 }
      );
    }

    // Max 10MB image limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const ai = new GoogleGenAI({ apiKey });

    // Model name ကို 'gemini-2.5-flash' သို့မဟုတ် 'gemini-2.0-flash' အသုံးပြုပါ
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          inlineData: {
            mimeType: file.type || 'image/jpeg',
            data: base64Data,
          },
        },
        'Extract all food/drink items, categories, prices, and descriptions from this menu image. Return prices as numbers without currency symbols.',
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              description: { type: Type.STRING },
            },
            required: ['category', 'name', 'price'],
          },
        },
      },
    });

    const parsedData = JSON.parse(response.text!);
    return NextResponse.json({ data: parsedData });
  } catch (error: any) {
    console.error('[api:parse-menu] Error parsing menu:', error);
    return NextResponse.json(
      { error: 'Failed to extract menu data from image. Please ensure the image is clear and try again.' },
      { status: 500 }
    );
  }
}