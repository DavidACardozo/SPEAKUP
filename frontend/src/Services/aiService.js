import { HfInference } from "@huggingface/inference";

const hf = process.env.REACT_APP_HF_TOKEN;

export const generarParrafoIA = async (categoria, palabrasClave) => {
  const MODELO = "Qwen/Qwen2.5-7B-Instruct";
  
  const prompt = `Act as an English teacher. 
    Topic: ${categoria}. 
    Keywords to use: ${palabrasClave.join(", ")}.

    INSTRUCTIONS:
    1. Write a short paragraph (min 60 words) in English using these words: ${palabrasClave.join(", ")}.
    2. In the "texto" field, replace those words with "___".
    3. In the "soluciones" field, put the ORIGINAL words that you hid, in the same order.
    4. Provide a full Spanish translation in "traduccion".

    STRICT JSON FORMAT:
    {
      "texto": "The English text with ___",
      "soluciones": ["word1", "word2"],
      "traduccion": "Traducción completa"
    }`;

  try {
    const response = await hf.chatCompletion({
      model: MODELO,
      messages: [
        { role: "system", content: "You are a helpful teacher. You ONLY respond with valid JSON code. No explanations." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3 
    });

    const contenido = response.choices[0].message.content;
    const inicio = contenido.indexOf('{');
    const fin = contenido.lastIndexOf('}') + 1;
    
    if (inicio === -1) throw new Error("No se encontró JSON en la respuesta");
    
    return JSON.parse(contenido.substring(inicio, fin));

  } catch (error) {
    console.error("Error en generarParrafoIA:", error.message);
    throw error; 
  }
};