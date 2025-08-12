import "server-only"
// This file is used to create a Sanity client for writing data.

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from '../env'

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token, // Include the token for write operations
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

if (!writeClient.config().token) {
  throw new Error(
    'Sanity write client requires a token. Please set the SANITY_WRITE_TOKEN environment variable.'
  )
}
