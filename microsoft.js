import axios from 'axios'

export async function getMicrosoftToken() {
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }
    )
    return response.data.access_token
  } catch (error) {
    console.error('Error getting token:', error.message)
    throw new Error('Failed to authenticate')
  }
}

export async function getFileFromOneDrive(fileName) {
  try {
    const token = await getMicrosoftToken()
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer',
      }
    )
    return response.data
  } catch (error) {
    console.error('Error fetching file:', error.message)
    throw new Error('Failed to fetch file from OneDrive')
  }
}
