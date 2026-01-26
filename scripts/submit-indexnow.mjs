#!/usr/bin/env node
/**
 * Submit URLs to Bing via IndexNow.
 * Requires the key file to be publicly accessible at `https://metis-tech.it/<key>.txt`.
 */

const host = process.env.SITE_HOST || 'metis-tech.it'
const key = process.env.INDEXNOW_KEY || 'd1b36c29-4e15-4a8e-9f1b-1f7b3d55c2a3'
const keyLocation = `https://${host}/${key}.txt`
const urls = [
  `https://${host}/`,
]

async function submit() {
  try {
    const payload = {
      host,
      key,
      keyLocation,
      urlList: urls,
    }

    const res = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    console.log('IndexNow status:', res.status, res.statusText)
    const text = await res.text()
    console.log(text)

    if (!res.ok) process.exitCode = 1
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  }
}

submit()
