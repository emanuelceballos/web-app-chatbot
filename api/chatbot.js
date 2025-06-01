export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).send('Sólo se permiten solicitudes POST');
    }
  
    const { message } = req.body;
  
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ reply: 'Mensaje inválido' });
    }
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer TU_API_KEY_ACÁ', // 🔐 Pegá tu clave
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Actuá como un experto en el Movimiento Scout en Argentina...` // ⬅️ Pegá tu prompt
            },
            { role: 'user', content: message }
          ],
          max_tokens: 600,
        }),
      });
  
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'No se obtuvo respuesta.';
  
      return res.status(200).json({ reply });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ reply: 'Ocurrió un error al procesar la solicitud.' });
    }
  }
  