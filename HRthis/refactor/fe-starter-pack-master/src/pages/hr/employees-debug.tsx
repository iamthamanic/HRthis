import React from 'react';
import { useSession } from 'next-auth/react';

export default function EmployeesDebugPage() {
  const { data: session, status } = useSession();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Debug Page</h1>
      <p>Session Status: {status}</p>
      <p>User: {session?.user?.name || 'No user'}</p>
      <p>This is a test page to check if rendering works.</p>
    </div>
  );
}