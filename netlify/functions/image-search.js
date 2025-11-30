exports.handler = async function(event) {
  // Controleer of de request een POST request is
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Haal de afbeeldingsdata uit de body van de request
    const { imageData, mimeType } = JSON.parse(event.body);
    
    // Haal de API sleutel veilig uit de environment variables
    const googleApiKey = process.env.GEMINI_API_KEY;

    if (!googleApiKey) {
        throw new Error("API sleutel niet gevonden op de server.");
    }

    const prompt = "Analyseer deze afbeelding van een LEGO-onderdeel. Let goed op de vorm, de afmetingen en het aantal noppen (studs). Identificeer het specifieke onderdeel en geef als antwoord alleen het meest waarschijnlijke Rebrickable onderdeelnummer (part_num). Geef geen extra tekst of uitleg, alleen het nummer.";
    const payload = {
      contents: [{
        parts: [
          { text: prompt },
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
      throw new Error('Fout bij de communicatie met de Google AI API.');
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