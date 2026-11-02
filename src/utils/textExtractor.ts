export interface ExtractedPassage {
  title: string;
  wordCount: number;
  content: string;
  preview: string;
}

export function cleanExtractedText(raw: string): string {
  return raw
    // Replace odd typographic quotes and dashes
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    // Replace multiple newlines or tabs with a single space
    .replace(/[\r\n\t]+/g, ' ')
    // Replace consecutive spaces
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function chunkTextIntoPassages(
  text: string,
  wordsPerPassage: number = 60,
  titlePrefix: string = 'Assignment Passage'
): ExtractedPassage[] {
  const cleaned = cleanExtractedText(text);
  if (!cleaned) return [];

  const words = cleaned.split(' ').filter(Boolean);
  if (words.length === 0) return [];

  const passages: ExtractedPassage[] = [];
  let chunkIndex = 1;

  for (let i = 0; i < words.length; i += wordsPerPassage) {
    const chunkWords = words.slice(i, i + wordsPerPassage);
    const chunkText = chunkWords.join(' ');
    passages.push({
      title: `${titlePrefix} (Part ${chunkIndex})`,
      wordCount: chunkWords.length,
      content: chunkText,
      preview: chunkWords.slice(0, 12).join(' ') + '...'
    });
    chunkIndex++;
  }

  return passages;
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // If text, markdown, code, etc.
  if (
    fileName.endsWith('.txt') ||
    fileName.endsWith('.md') ||
    fileName.endsWith('.json') ||
    fileName.endsWith('.csv') ||
    fileName.endsWith('.js') ||
    fileName.endsWith('.py') ||
    fileName.endsWith('.java') ||
    fileName.endsWith('.cpp')
  ) {
    return await file.text();
  }

  // If PDF file
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      // Fast client-side PDF stream text extraction for standard printable streams
      let text = '';
      const decoder = new TextDecoder('utf-8');
      const rawString = decoder.decode(uint8);

      // Extract text within BT ... ET blocks or stream parenthesized strings
      const textMatches = rawString.match(/\((.*?)\)\s*Tj/g) || rawString.match(/\[(.*?)\]\s*TJ/g);
      if (textMatches && textMatches.length > 0) {
        text = textMatches
          .map(match => {
            return match
              .replace(/\\([()\\])/g, '$1')
              .replace(/^\(/, '')
              .replace(/\)\s*Tj$/, '')
              .replace(/^\[/, '')
              .replace(/\]\s*TJ$/, '');
          })
          .join(' ');
      }

      // If PDF text was compressed/encoded, extract printable strings greater than length 3
      if (text.trim().length < 40) {
        const asciiMatches = rawString.match(/[a-zA-Z0-9.,;:!?'"()\s]{4,}/g);
        if (asciiMatches) {
          text = asciiMatches
            .filter(str => !str.includes('endobj') && !str.includes('Filter') && !str.includes('FlateDecode'))
            .join(' ');
        }
      }

      if (text.trim().length > 20) {
        return cleanExtractedText(text);
      }
      throw new Error('PDF content was encrypted or binary stream format. Please paste the text directly.');
    } catch (err: any) {
      throw new Error(err.message || 'Could not extract text from PDF. Use text-paste option.');
    }
  }

  // Fallback try reading as text
  return await file.text();
}
