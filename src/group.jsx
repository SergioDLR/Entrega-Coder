import React, { useEffect, useState } from 'react'
import { PublicClientApplication } from '@azure/msal-browser'
import { getClient } from '@microsoft/microsoft-graph-client'
import { useMsal } from '@azure/msal-react'

const clientId = '2c7b0ab4-6982-4a08-97e1-412f096f492e' // Reemplaza con el Client ID de tu aplicación registrada en Azure AD
const graphScopes = ['Group.Read.All'] // Permisos necesarios para acceder a los grupos

const App = () => {
  const [groups, setGroups] = useState([])
  const log = useMsal()
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const msalConfig = {
          auth: {
            clientId: clientId
          }
        }

        const authProviderOptions = {
          scopes: graphScopes
        }
        const graphClient = getClient(authProviderOptions, log.instance)

        const response = await graphClient.api('/groups').get()
        setGroups(response.value)
      } catch (error) {
        console.log(error)
      }
    }

    fetchGroups()
  }, [])

  return (
    <div>
      <h1>Grupos de Azure AD</h1>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>{group.displayName}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
