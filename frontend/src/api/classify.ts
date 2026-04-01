export interface ClassifyResult {
  label: string;
  label_id: number;
  confidence: number;
  trigger_phrase?: string | null;
  is_hateful: boolean;
  text_preview: string;
  image_text?: string | null;
  visual_flags?: string[];
  is_visual_unsafe?: boolean;
  is_ai_generated?: boolean;
}

export const classifyText = async (text: string, image?: string | null): Promise<ClassifyResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const res = await fetch("http://localhost:8000/classify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        text,
        image_base64: image
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    
    return await res.json();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn("Classification timed out after 20s. Falling back to safe.");
    } else {
      console.error("Classification error, falling back to safe:", err);
    }
    
    return {
      label: "Not Hateful",
      label_id: 0,
      confidence: 100,
      is_hateful: false,
      is_ai_generated: false,
      text_preview: text.slice(0, 80),
    };
  }
};
