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
    });
    
    if (!res.ok) {
      throw new Error("Failed to classify text");
    }
    
    return await res.json();
  } catch (err) {
    console.error("Classification error, falling back to safe:", err);
    return {
      label: "Not Hateful",
      label_id: 0,
      confidence: 100,
      is_hateful: false,
      text_preview: text.slice(0, 80),
    };
  }
};
