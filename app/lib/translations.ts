interface Translations {
  [key: string]: {
    title: string
    subtitle: string
    menuCreator: {
      dishNameLabel: string
      dishNamePlaceholder: string
      generate: string
      generating: string
      error: string
      apiKeyError: string
      generateError: string
      analyzeError: string
    }
    apiKeys: {
      title: string
      openrouterLabel: string
      falLabel: string
      showKeys: string
      getKeys: string
      openrouterLink: string
      falLink: string
      securityNote: string
    }
  }
}

export const translations: Translations = {
  'en-us': {
    title: 'AI Menu Generator',
    subtitle: 'Create beautiful menu images with AI',
    menuCreator: {
      dishNameLabel: 'Dish Name',
      dishNamePlaceholder: 'Enter the name of your dish',
      generate: 'Generate Image',
      generating: 'Generating...',
      error: 'Error',
      apiKeyError: 'Please enter your API keys first',
      generateError: 'Failed to generate image',
      analyzeError: 'Failed to analyze dish name'
    },
    apiKeys: {
      title: 'API Keys',
      openrouterLabel: 'OpenRouter API Key',
      falLabel: 'FAL.AI API Key',
      showKeys: 'Show API Keys',
      getKeys: 'Get your API keys from:',
      openrouterLink: 'OpenRouter',
      falLink: 'FAL.AI',
      securityNote: 'Your API keys are stored securely in your browser and are never sent to our servers.'
    }
  },
  'zh-cn': {
    title: 'AI菜单生成器',
    subtitle: '使用AI创建精美的菜单图片',
    menuCreator: {
      dishNameLabel: '菜品名称',
      dishNamePlaceholder: '输入您的菜品名称',
      generate: '生成图片',
      generating: '生成中...',
      error: '错误',
      apiKeyError: '请先输入您的API密钥',
      generateError: '生成图片失败',
      analyzeError: '分析菜品名称失败'
    },
    apiKeys: {
      title: 'API密钥',
      openrouterLabel: 'OpenRouter API密钥',
      falLabel: 'FAL.AI API密钥',
      showKeys: '显示API密钥',
      getKeys: '从以下网站获取您的API密钥：',
      openrouterLink: 'OpenRouter',
      falLink: 'FAL.AI',
      securityNote: '您的API密钥安全地存储在浏览器中，永远不会发送到我们的服务器。'
    }
  }
}
