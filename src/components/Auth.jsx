import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth({ onAuthSuccess }) {
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onAuthSuccess(data.user)
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        })
        if (error) throw error
        
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please login instead.')
        } else if (data.session) {
          // Auto-login if email confirmation is disabled
          setSuccess('Account created successfully!')
          onAuthSuccess(data.user)
        } else {
          setSuccess('Account created! Please check your email to verify your account, then login.')
          setIsLogin(true)
          setPassword('')
        }
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <h1>🔐 Password Manager</h1>
      <p className="subtitle">
        {isLogin ? 'Welcome back! Sign in to access your passwords.' : 'Create an account to get started.'}
      </p>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleAuth}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div className="toggle-auth">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button onClick={() => {
          setIsLogin(!isLogin)
          setError('')
          setSuccess('')
        }}>
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

