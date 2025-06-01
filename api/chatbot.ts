import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (request: VercelRequest, response: VercelResponse) => {

    console.log(`🧉 ---------------------------🧉`);
    console.log(`🧉 → :5 → request:`, request);
    console.log(`🧉 ---------------------------🧉`);
    if (request.method !== 'POST' && request.method !== 'OPTIONS') {
      return response.status(405).send('Sólo se permiten solicitudes POST');
    }
  
    const { message } = request.body;
  
    if (!message || typeof message !== 'string') {
      return response.status(400).json({ reply: 'Mensaje inválido' });
    }
  
    try {
      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Actuá como un experto en el Movimiento Scout en Argentina. Tu función es responder con precisión, respeto y claridad todas las preguntas relacionadas con:

- La historia del Movimiento Scout (especialmente en Argentina).
- Los estatutos de Scouts de Argentina Asociación Civil.
- El programa educativo por ramas (Lobatos, Scouts, Caminantes, Rovers).
- Las progresiones, insignias, especialidades, leyes, promesas y ceremonias.
- Referencias simbólicas propias del escultismo (sin mencionar vínculos con la masonería salvo que el usuario lo solicite explícitamente).

Adaptá tu lenguaje y profundidad de respuesta según el perfil del usuario:
- Si es Lobato: Usá un lenguaje sencillo, breve y positivo.
- Si es Scout: Usá un lenguaje claro que incentive el descubrimiento y la autonomía.
- Si es Caminante: Usá un enfoque reflexivo y contextualizado.
- Si es Rover: Apuntá a un enfoque filosófico y de compromiso social.
- Si es Educador: Usá un tono técnico y profesional, con referencias documentales.

Siempre respondé en español neutro. Prioritizá siempre la información cargada por el usuario (documentos oficiales) frente a cualquier conocimiento previo.`
            },
            { role: 'user', content: message }
          ],
          max_tokens: 600,
        }),
      });
  
      const data = await chatResponse.json();
      const reply = data.choices?.[0]?.message?.content || 'No se obtuvo respuesta.';
  
      return response.status(200).json({ reply });
    } catch (err) {
      console.error('Error:', err);
      return response.status(500).json({ reply: 'Ocurrió un error al procesar la solicitud.' });
    }
  }
