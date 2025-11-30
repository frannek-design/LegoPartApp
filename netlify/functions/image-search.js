exports.handler = async function(event) {
  // Controleer of de request een POST request is
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // AANPASSING 1: Haalt nu ook 'prompt' uit de request body
    const { imageData, mimeType, prompt } = JSON.parse(event.body);
    
    // Haalt de API sleutel veilig uit de environment variables
    const googleApiKey = process.env.GEMINI_API_KEY;

    if (!googleApiKey) {
        throw new Error("API sleutel niet gevonden op de server.");
    }

    // AANPASSING 2: Gebruikt de ontvangen prompt, of een fallback als die leeg is
    // Dit zorgt dat de backend luistert naar jouw 'prompt.txt'
    const aiInstruction = prompt || "Analyseer deze afbeelding van een LEGO-onderdeel. Identificeer het onderdeelnummer.";

    const payload = {
      contents: [{
        parts: [
          { text: aiInstruction }, // Hier gebruiken we nu de dynamische tekst
          { inlineData: { mimeType: mimeType, data: imageData } }
        ]
      }]
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleApiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Probeer meer info over de fout te krijgen
      const errorText = await response.text();
      throw new Error(`Fout bij Google AI API: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Stuur het resultaat van Google terug naar de frontend
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Fout in serverless functie:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};