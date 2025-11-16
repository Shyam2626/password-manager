import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { encryptPassword, decryptPassword, generatePassword } from '../utils/encryption'

export default function PasswordManager({ user, onLogout }) {
  const [passwords, setPasswords] = useState([])
  const [loading, setLoading] = useState(true)
  const [masterKey, setMasterKey] = useState('')
  const [masterKeySet, setMasterKeySet] = useState(false)
  const [showMasterKeyForm, setShowMasterKeyForm] = useState(true)
  
  // Form state
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notes, setNotes] = useState('')
  const [url, setUrl] = useState('')
  const [editingId, setEditingId] = useState(null)
  
  // Visibility state
  const [visiblePasswords, setVisiblePasswords] = useState({})
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (masterKeySet) {
      fetchPasswords()
    }
  }, [masterKeySet])

  const handleSetMasterKey = (e) => {
    e.preventDefault()
    if (masterKey.length < 6) {
      setError('Master key must be at least 6 characters')
      return
    }
    setMasterKeySet(true)
    setShowMasterKeyForm(false)
    setError('')
    setSuccess('Master key set! Your passwords will be encrypted with this key.')
    setTimeout(() => setSuccess(''), 3000)
  }

  const fetchPasswords = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPasswords(data || [])
    } catch (error) {
      setError('Error fetching passwords: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const encryptedPassword = encryptPassword(password, masterKey)
      
      const passwordData = {
        title,
        username,
        password: encryptedPassword,
        notes,
        url,
        user_id: user.id,
      }

      if (editingId) {
        const { error } = await supabase
          .from('passwords')
          .update(passwordData)
          .eq('id', editingId)
          .eq('user_id', user.id)

        if (error) throw error
        setSuccess('Password updated successfully!')
      } else {
        const { error } = await supabase
          .from('passwords')
          .insert([passwordData])

        if (error) throw error
        setSuccess('Password saved successfully!')
      }

      // Reset form
      setTitle('')
      setUsername('')
      setPassword('')
      setNotes('')
      setUrl('')
      setEditingId(null)
      
      fetchPasswords()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Error saving password: ' + error.message)
    }
  }

  const handleEdit = (pass) => {
    setEditingId(pass.id)
    setTitle(pass.title)
    setUsername(pass.username)
    setPassword(decryptPassword(pass.password, masterKey))
    setNotes(pass.notes || '')
    setUrl(pass.url || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this password?')) return

    try {
      const { error } = await supabase
        .from('passwords')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      setSuccess('Password deleted successfully!')
      fetchPasswords()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Error deleting password: ' + error.message)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setTitle('')
    setUsername('')
    setPassword('')
    setNotes('')
    setUrl('')
  }

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setSuccess(`${type} copied to clipboard!`)
    setTimeout(() => setSuccess(''), 2000)
  }

  if (showMasterKeyForm) {
    return (
      <div className="container">
        <div className="auth-container">
          <h1>🔐 Set Master Key</h1>
          <p className="subtitle">
            Create a master key to encrypt your passwords. Remember this key - you'll need it to decrypt your passwords!
          </p>
          
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSetMasterKey}>
            <div className="form-group">
              <label htmlFor="masterKey">Master Key</label>
              <input
                id="masterKey"
                type="password"
                placeholder="Enter a strong master key"
                value={masterKey}
                onChange={(e) => setMasterKey(e.target.value)}
                required
                minLength={6}
              />
              <small style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                This key will be used to encrypt/decrypt your passwords locally.
              </small>
            </div>
            <button type="submit" className="btn-primary">
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="app-container">
        <div className="header">
          <h1>🔐 My Passwords</h1>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="password-list">
          <h2>📋 Saved Passwords ({passwords.length})</h2>

          {loading ? (
            <div className="loading">Loading your passwords...</div>
          ) : passwords.length === 0 ? (
            <div className="empty-state">
              <h3>No passwords saved yet</h3>
              <p>Add your first password using the form above</p>
            </div>
          ) : (
            passwords.map((pass) => (
              <div key={pass.id} className="password-item">
                <div className="password-header">
                  <div>
                    <div className="password-title">{pass.title}</div>
                    <div className="password-username">👤 {pass.username}</div>
                    {pass.url && (
                      <div className="password-username">
                        🔗{" "}
                        <a
                          href={pass.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pass.url}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="password-actions">
                    <button
                      onClick={() => handleEdit(pass)}
                      className="btn-edit btn-small"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pass.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="password-field">
                  <div className="password-value">
                    {visiblePasswords[pass.id]
                      ? decryptPassword(pass.password, masterKey)
                      : "••••••••••••"}
                  </div>
                  <button
                    onClick={() => togglePasswordVisibility(pass.id)}
                    className="btn-icon"
                  >
                    {visiblePasswords[pass.id] ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        decryptPassword(pass.password, masterKey),
                        "Password"
                      )
                    }
                    className="btn-icon"
                  >
                    Copy
                  </button>
                </div>

                {pass.notes && (
                  <div className="notes">
                    <div className="notes-label">📝 Notes:</div>
                    {pass.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="add-password-section">
          <h2>{editingId ? "✏️ Edit Password" : "➕ Add New Password"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title / Service Name *</label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Gmail, Facebook, Netflix"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username / Email *</label>
              <input
                id="username"
                type="text"
                placeholder="your@email.com or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  id="password"
                  type="text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setPassword(generatePassword())}
                  className="btn-icon"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="url">Website URL</label>
              <input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                placeholder="Additional notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="form-actions">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="btn-success">
                {editingId ? "Update Password" : "Save Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

