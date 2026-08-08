import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY မရှိသေးပါ။ .env.local တွင် စစ်ဆေးပါ' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'ပုံ ထည့်သွင်းထားခြင်း မရှိပါ' },
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
    console.error('Gemini Parse Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Menu ဖတ်ယူရာတွင် အဆင်မပြေပါ' },
      { status: 500 }
    );
  }
}