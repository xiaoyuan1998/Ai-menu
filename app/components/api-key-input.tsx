'use client'

import { useApiKeys } from '../contexts/api-keys-context'
import { useState } from 'react'

export function ApiKeyInput() {
  const { openrouterKey, falKey, setOpenrouterKey, setFalKey } = useApiKeys()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="openrouter-key" className="block text-sm font-medium text-gray-700">
            OpenRouter API Key
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={isVisible ? "text" : "password"}
              id="openrouter-key"
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={openrouterKey}
              onChange={(e) => setOpenrouterKey(e.target.value)}
              placeholder="sk-or-v1-..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="fal-key" className="block text-sm font-medium text-gray-700">
            FAL.AI API Key
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={isVisible ? "text" : "password"}
              id="fal-key"
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={falKey}
              onChange={(e) => setFalKey(e.target.value)}
              placeholder="sk-fal..."
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="show-keys"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
          />
          <label htmlFor="show-keys" className="ml-2 block text-sm text-gray-900">
            Show API Keys
          </label>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Your API keys are stored securely in your browser and are never sent to our servers.
        Get your API keys from:{' '}
        <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
          OpenRouter
        </a>
        {' '}and{' '}
        <a href="https://www.fal.ai/dashboard/keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
          FAL.AI
        </a>
      </p>
    </div>
  )
}
