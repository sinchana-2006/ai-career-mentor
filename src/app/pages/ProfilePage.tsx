import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  User, Github, Code2, Upload, Camera, Save,
  ExternalLink, FileText, CheckCircle, Loader2,
  Calendar, Sparkles, Trash2
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  githubUrl: string;
  leetcodeUrl: string;
  bio: string;
  profilePicture: string | null;
  resumeFile: { name: string; size: number } | null;
}

interface ProfilePageProps {
  initialEmail?: string;
  initialName?: string;
  initialAvatar?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-5">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h2 className="font-semibold text-foreground text-sm">{title}</h2>
    </div>
    {children}
  </div>
);

// ─── Input field ──────────────────────────────────────────────────────────────
const Field = ({
  label, value, onChange, placeholder, type = 'text', prefix, optional = false
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; prefix?: string; optional?: boolean;
}) => (
  <div>
    <label className="flex items-center gap-1 text-xs font-medium text-foreground mb-1.5">
      {label}
      {optional && <span className="text-muted-foreground font-normal">(optional)</span>}
    </label>
    <div className="relative flex">
      {prefix && (
        <span className="flex items-center px-3 rounded-l-xl border border-r-0 border-input bg-secondary/40 text-muted-foreground text-sm">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 px-4 py-2.5 text-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
          prefix ? 'rounded-r-xl' : 'rounded-xl'
        }`}
      />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage({ initialEmail = '', initialName = '', initialAvatar = '' }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>({
    firstName: initialName.split(' ')[0] || '',
    lastName:  initialName.split(' ')[1] || '',
    age:       '',
    email:     initialEmail,
    githubUrl:   '',
    leetcodeUrl: '',
    bio:         '',
    profilePicture: initialAvatar || null,
    resumeFile:     null,
  });

  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  const profilePicRef = useRef<HTMLInputElement>(null);
  const resumeRef     = useRef<HTMLInputElement>(null);

  const update = (key: keyof UserProfile, value: any) => {
    setProfile(p => ({ ...p, [key]: value }));
    setSaved(false);
  };

  // ── Profile Picture ──────────────────────────────────────────────────────
  const handleProfilePic = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => update('profilePicture', e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Resume Upload ────────────────────────────────────────────────────────
  const handleResume = (file: File) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Please upload a PDF or Word document.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5 MB.');
      return;
    }
    update('resumeFile', { name: file.name, size: file.size });
    // In production: upload to Firebase Storage or your backend
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    // In production: save to Firestore / your backend API
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
  };

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials    = [(profile.firstName[0] || ''), (profile.lastName[0] || '')].join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-md shadow-primary/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Profile</h1>
              <p className="text-xs text-muted-foreground">Personalise your LakshyaSetu experience</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              : saved
                ? <><CheckCircle className="w-4 h-4" /> Saved!</>
                : <><Save className="w-4 h-4" /> Save Profile</>
            }
          </button>
        </div>

        <div className="flex flex-col gap-5">

          {/* ── Profile Picture ── */}
          <Section title="Profile Picture" icon={Camera}>
            <div className="flex items-center gap-6">
              {/* Avatar preview */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-border bg-secondary/40 flex items-center justify-center">
                  {profile.profilePicture
                    ? <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    : <span className="text-2xl font-bold text-primary">{initials}</span>
                  }
                </div>
                {profile.profilePicture && (
                  <button
                    onClick={() => update('profilePicture', null)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-foreground font-medium mb-1">{displayName}</p>
                <p className="text-xs text-muted-foreground mb-3">{profile.email || 'No email set'}</p>
                <button
                  onClick={() => profilePicRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/70 transition-all text-sm text-foreground"
                >
                  <Camera className="w-4 h-4 text-primary" />
                  {profile.profilePicture ? 'Change photo' : 'Upload photo'}
                </button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG up to 2 MB</p>
                <input
                  ref={profilePicRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleProfilePic(e.target.files[0])}
                />
              </div>
            </div>
          </Section>

          {/* ── Personal Info ── */}
          <Section title="Personal Information" icon={User}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field
                label="First Name"
                value={profile.firstName}
                onChange={v => update('firstName', v)}
                placeholder="e.g. Sinchana"
              />
              <Field
                label="Last Name"
                value={profile.lastName}
                onChange={v => update('lastName', v)}
                placeholder="e.g. Sharma"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field
                label="Age"
                value={profile.age}
                onChange={v => update('age', v)}
                placeholder="e.g. 18"
                type="number"
              />
              <Field
                label="Email"
                value={profile.email}
                onChange={v => update('email', v)}
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Short Bio <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                value={profile.bio}
                onChange={e => update('bio', e.target.value)}
                placeholder="Tell us a bit about yourself and your career goals…"
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{profile.bio.length}/200</p>
            </div>
          </Section>

          {/* ── Dev Profiles ── */}
          <Section title="Developer Profiles" icon={Code2}>
            <div className="flex flex-col gap-4">
              <Field
                label="GitHub Profile"
                value={profile.githubUrl}
                onChange={v => update('githubUrl', v)}
                placeholder="yourUsername"
                prefix="github.com/"
                optional
              />
              {profile.githubUrl && (
                <a
                  href={`https://github.com/${profile.githubUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline -mt-2 ml-1"
                >
                  <ExternalLink className="w-3 h-3" /> View profile
                </a>
              )}

              <Field
                label="LeetCode Profile"
                value={profile.leetcodeUrl}
                onChange={v => update('leetcodeUrl', v)}
                placeholder="yourUsername"
                prefix="leetcode.com/u/"
                optional
              />
              {profile.leetcodeUrl && (
                <a
                  href={`https://leetcode.com/u/${profile.leetcodeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline -mt-2 ml-1"
                >
                  <ExternalLink className="w-3 h-3" /> View profile
                </a>
              )}
            </div>
          </Section>

          {/* ── Resume Upload ── */}
          <Section title="Resume / CV" icon={FileText}>
            {profile.resumeFile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-primary/30 bg-primary/5"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{profile.resumeFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(profile.resumeFile.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => resumeRef.current?.click()}
                    className="text-xs text-primary hover:underline"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => update('resumeFile', null)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ) : (
              <div
                onClick={() => resumeRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault(); setDragOver(false);
                  e.dataTransfer.files[0] && handleResume(e.dataTransfer.files[0]);
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                }`}
              >
                <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-sm font-medium text-foreground mb-1">
                  {dragOver ? 'Drop it here!' : 'Upload your resume'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or click to browse · PDF or Word · Max 5 MB
                </p>
              </div>
            )}
            <input
              ref={resumeRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleResume(e.target.files[0])}
            />
          </Section>

          {/* ── Save Button (mobile) ── */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {saving
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving your profile…</>
              : saved
                ? <><CheckCircle className="w-4 h-4" /> Profile Saved!</>
                : <><Save className="w-4 h-4" /> Save Profile</>
            }
          </button>

        </div>
      </div>
    </div>
  );
}
