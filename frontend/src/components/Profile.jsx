import React, { useState } from 'react';
import { User, Shield, CreditCard, Lock, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', msg: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', msg: 'Password must be at least 6 characters.' });
      return;
    }
    if (currentPassword !== 'admin') {
      setStatus({ type: 'error', msg: 'Current password is incorrect.' });
      return;
    }
    
    // Simulate API success
    setStatus({ type: 'success', msg: 'Password updated successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1.5rem', maxWidth: '800px' }}>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Profile Info Side */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <User size={24} color="var(--primary-color)" /> Driver Settings
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
               <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={30} color="var(--text-muted)" />
               </div>
               <div>
                 <h4 style={{ margin: 0 }}>System Administrator</h4>
                 <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>admin@fleetconsole.com</div>
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-color)', borderRadius: '4px', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                   <Shield size={12} /> VERIFIED DRIVER
                 </div>
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
               <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>License Number</div>
               <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <CreditCard size={16} /> FL-10023-A9
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
               <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Assigned Vehicle</div>
               <div style={{ fontWeight: '500' }}>Heavy Goods Transport (Class 1)</div>
            </div>
          </div>
        </div>

        {/* Change Password Side */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
            <Lock size={24} color="var(--secondary-color)" /> Security
          </h3>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {status && (
              <div style={{ 
                padding: '1rem', 
                background: status.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                color: status.type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)', 
                borderRadius: '8px', 
                border: `1px solid ${status.type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {status.type === 'success' && <CheckCircle2 size={18} />}
                {status.msg}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white',
                  fontFamily: 'var(--font-main)', outline: 'none'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white',
                  fontFamily: 'var(--font-main)', outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white',
                  fontFamily: 'var(--font-main)', outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="btn" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              Update Password
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
