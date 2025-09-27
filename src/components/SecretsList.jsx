import React from 'react'

const SecretsList = ({ secrets = [] }) => {
  return (
    <div className="flex-1 lg:w-2/3">
      <h2 className="text-2xl font-bold text-card-foreground mb-6">Your Secrets</h2>
      <div className="space-y-4">
        {secrets.length ? secrets.map((secret) => (
          <div key={secret.id} className="bg-background border border-border rounded-md p-4 hover:p-6 transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-foreground">{secret.title}</h3>
              <span className="text-sm text-muted-foreground">{secret.date}</span>
            </div>
            <p className="text-muted-foreground">{secret.description}</p>
          </div>
        )) : <div className="text-muted-foreground">We know you got some secrets 😉</div>}
      </div>
    </div>
  )
}

export default SecretsList
