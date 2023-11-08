import { useEffect, useState } from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'

import './App.css'

function App() {
  const log = useMsal()
  const [groups, setGroups] = useState([])
  const handleLogin = () =>
    log.instance.loginRedirect({
      scopes: ['user.read']
    })
  async function getGroupNames() {
    const accessToken = await log.instance.acquireTokenSilent({
      scopes: ['group.read.all'] // Permisos de la API de Microsoft Graph
    })

    const response = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
      headers: {
        Authorization: `Bearer ${accessToken.accessToken}`
      }
    })
    console.log({ accessToken })

    const data = await response.json()

    // Obtén los nombres de los grupos
    const groupNames = data.value.map((group) => group.displayName)
    setGroups(groupNames)
    console.log({ groupNames })
  }

  useEffect(() => {
    if (log?.accounts[0]) {
      console.log(log?.accounts[0])
      log.instance.setActiveAccount(log?.accounts[0])
      getGroupNames()
    }

    console.log(log.instance.getAllAccounts())
  }, [log])

  return (
    <div className="App">
      {log?.accounts[0]?.name}
      Ms
      <button onClick={ getGroupNames}>ddd</button>
      <AuthenticatedTemplate>
        {groups.map((element: string) => (
          <p>{element}</p>
        ))}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleLogin}>Login</button>
      </UnauthenticatedTemplate>
    </div>
  )
}

export default App
