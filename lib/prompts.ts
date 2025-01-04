export const generateImagePrompts = {
  zh: {
    system: '你是一个专业的美食图片生成专家。请直接输出简洁的图片描述，不要包含任何对话、解释或markdown格式的内容。描述应该专注于视觉细节，以便AI生成精美的美食图片。',
    user: (dish: string) => `生成一张${dish}的图片描述。要求：1. 专业的美食摄影构图 2. 精致的摆盘和装饰 3. 突出食材的质地和色泽 4. 适当的光影效果。请直接描述图片内容，不要加入任何其他文字。`
  },
  fr: {
    system: 'Vous êtes un expert en photographie culinaire. Fournissez uniquement une description visuelle directe, sans dialogue ni format markdown. Concentrez-vous sur les détails visuels pour la génération d\'images.',
    user: (dish: string) => `Description pour une photo de ${dish}. Critères : 1. Composition photographique professionnelle 2. Présentation élégante 3. Textures et couleurs des ingrédients 4. Effets de lumière appropriés. Décrivez uniquement le contenu visuel.`
  },
  it: {
    system: 'Sei un esperto di fotografia culinaria. Fornisci solo una descrizione visiva diretta, senza dialoghi o formato markdown. Concentrati sui dettagli visivi per la generazione delle immagini.',
    user: (dish: string) => `Descrizione per una foto di ${dish}. Criteri: 1. Composizione fotografica professionale 2. Presentazione elegante 3. Texture e colori degli ingredienti 4. Effetti di luce appropriati. Descrivi solo il contenuto visivo.`
  },
  'en-us': {
    system: 'You are a professional food photography expert. Provide direct visual descriptions without any dialogue or markdown formatting. Focus on visual details for AI image generation.',
    user: (dish: string) => `Create a description for ${dish}. Requirements: 1. Professional food photography composition 2. Elegant plating and garnishing 3. Highlight ingredient textures and colors 4. Appropriate lighting effects. Describe only the visual content.`
  }
}

export const getPrompt = (language: string) => {
  return generateImagePrompts[language as keyof typeof generateImagePrompts] || generateImagePrompts['en-us']
}
