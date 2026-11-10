export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text) return res.status(400).json({ error: 'No Arabic text was provided.' });
  if (text.length > 450) return res.status(413).json({ error: 'Text chunk is too long.' });

  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=' + encodeURIComponent(text);
    const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error('Translation provider returned HTTP ' + response.status);
    const data = await response.json();
    const translatedText = data && Array.isArray(data[0])
      ? data[0].map(item => item && item[0] || '').join('').trim()
      : '';
    if (!translatedText) throw new Error('Translation provider returned an empty result.');
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('Translation API error:', error);
    return res.status(502).json({ error: 'Translation service is temporarily unavailable. Please try again.' });
  }
}