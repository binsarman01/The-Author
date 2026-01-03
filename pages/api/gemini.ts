import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

// A small proxy that forwards requests to a Gemini-compatible endpoint using process.env.GEMINI_API_KEY.
// NOTE: Adjust the default endpoints to your provider. This proxy expects the client to POST JSON with:
// { type: 'text'|'image', payload: { ... } }

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const key = process.env.GEMINI_API_KEY
  if(!key) return res.status(500).json({ error: 'Missing GEMINI_API_KEY. Set in environment (Vercel env vars).' })

  const { type, payload } = req.body || {}
  if(!type || !payload) return res.status(400).json({ error: 'Invalid request: expected { type, payload } in body' })

  // Default endpoints - replace with actual Gemini endpoints if needed via GEMINI_API_URL env var
  const defaultTextEndpoint = 'https://api.gemini.example/v1/text:generate'
  const defaultImageEndpoint = 'https://api.gemini.example/v1/image:generate'

  const url = (type === 'image') ? (process.env.GEMINI_IMAGE_ENDPOINT || defaultImageEndpoint) : (process.env.GEMINI_TEXT_ENDPOINT || defaultTextEndpoint)

  try{
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      timeout: 120000
    })

    // Forward the provider response directly. Do NOT log the key.
    return res.status(response.status).json(response.data)
  }catch(err:any){
    const status = err?.response?.status || 500
    const data = err?.response?.data || { message: err.message }
    return res.status(status).json({ error: 'Upstream request failed', details: data })
  }
}
