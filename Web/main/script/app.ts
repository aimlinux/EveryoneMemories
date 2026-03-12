const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;
const upload = document.getElementById("imageUpload") as HTMLInputElement;
const preview = document.getElementById("preview") as HTMLImageElement;
const memoryDiv = document.getElementById("memory") as HTMLDivElement;

// We no longer use static memories array.
// Instead, we will call the Gemini API.

upload.addEventListener("change", function(){

    const file = upload.files?.[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = async function(e){
        const result = e.target?.result as string;
        preview.src = result;

        const base64Data = result.split(',')[1];
        if (base64Data) {
            await generateMemory(base64Data);
        }
    }

    reader.readAsDataURL(file);

});


async function generateMemory(base64Image: string) {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        memoryDiv.innerText = "エラー: Gemini API Keyを入力してください。";
        return;
    }

    memoryDiv.innerText = "AIが思い出を生成しています...";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "この写真に基づいて、短くてエモーショナルな架空の思い出（1〜2文程度）を生成してください。" },
                        {
                            inline_data: {
                                mime_type: "image/jpeg", // Assuming JPEG for now, could dynamically determine mime type, but API usually handles base64 well.
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "思い出を生成できませんでした。";
        memoryDiv.innerText = text;
    } catch (error: any) {
        console.error("Gemini API error:", error);
        memoryDiv.innerText = "エラーが発生しました: " + error.message;
    }
}