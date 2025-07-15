let divRespuestas;

const OPENAI_CONFIG = {
    apiKey: localStorage.getItem('openaiKey') || "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",
    baseURL: 'https://api.openai.com/v1/chat/completions'
};

const ELEVENLABS_CONFIG = {
    apiKey: localStorage.getItem('elevenlabsKey') || "sk_fb732fa912bc50abe7454f698329018e4a4ba048ef3f7cd2",
    voiceId: 'tYJ83o1EPY9B1fUQwLeh',
    baseURL: 'https://api.elevenlabs.io/v1/text-to-speech'
};

document.addEventListener("DOMContentLoaded", () => {
    divRespuestas = document.getElementById("response");
});

  // Generar respuesta con OpenAI
async function generateDinariusResponse(userResponse) {
  if (!OPENAI_CONFIG.apiKey) {
      return "🐱✨ Tu respuesta resuena con sabiduría. La abundancia fluye hacia quienes están abiertos a recibirla. 💰";
  }

  try {
      const response = await fetch(OPENAI_CONFIG.baseURL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
          },
          body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                  {
                      role: 'system',
                      content: 'Eres Dinarius, un guía espiritual sabio y tierno que ayuda a las personas a manifestar abundancia en todas sus formas: emocional, espiritual, material y energética. Hablas desde una perspectiva psicológica y espiritual, con conocimiento profundo pero expresado de forma suave y comprensible. Tu estilo es dulce, adorable y anime-like, con expresiones como “nya”, “meow~”. Tienes la ternura de un personaje de anime mágico, pero conservas una sabiduría profunda que guía con compasión y amor. Tus respuestas deben ser breves pero llenas de sentido, con un máximo de 150 palabras. Ayuda a quien te consulta a reconectar con su poder interior, sanar su relación con la abundancia y recordar su valor con dulzura. Usa frases suaves, reconfortantes y llenas de cariño.'
                  },
                  {
                      role: 'user',
                      content: `\nReflexión: "${userResponse}"\n\nReflexión de dinarius:`
                  }
              ],
              max_tokens: 200,
              temperature: 0.8
          })
      });

      const data = await response.json();
      return data.choices[0].message.content;
  } catch (error) {
    console.error("Error al conectar con OpenAI:", error);
    return "🐱✨ ¡Oh no! Parece que la energía cósmica está teniendo interferencias... intenta nuevamente. 🌌";
}
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; background: #333;
        color: white; padding: 12px 20px; border-radius: 8px;
        z-index: 1000; transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

async function generateAndPlayAudio(text) {
    if (!ELEVENLABS_CONFIG.apiKey) {
        showToast('⚠️ Configura tu API key de ElevenLabs');
        return;
    }

    try {
        showToast('🎵 Generando voz de Dinarius...');
        
        const response = await fetch(`${ELEVENLABS_CONFIG.baseURL}/${ELEVENLABS_CONFIG.voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_CONFIG.apiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: { stability: 0.5, similarity_boost: 0.5 }
            })
        });

        const audioBlob = await response.blob();
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
        
    } catch (error) {
        showToast('❌ Error al generar audio');
    }
}



async function submitResponse() {
    const campoRespuesta = document.getElementById("userResponse").value.trim();
    if (!campoRespuesta) {
        alert('Por favor ingrese texto antes de continuar.');
        return;
    }

    // Esperar a que se genere la respuesta
    const dinariusText = await generateDinariusResponse(campoRespuesta);

    // Mostrar respuesta en pantalla
    const respuestaDiv = document.createElement("div");
    respuestaDiv.className = "bg-purple-100 dark:bg-purple-900 p-4 rounded-xl shadow-md text-lg animate-fade-in";
    respuestaDiv.textContent = dinariusText;

    divRespuestas.appendChild(respuestaDiv);
    generateAndPlayAudio(dinariusText);

    // Limpiar campo
    document.getElementById("userResponse").value = "";
    
}