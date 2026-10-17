import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Wifi, WifiOff, Database } from 'lucide-react';
import { probeSupabaseConnection, isSupabaseConfigured, SupabaseStatus } from '../../lib/supabase';

/**
 * SupabaseStatusBadge — Development connection indicator.
 *
 * Runs a single real round-trip to the configured Supabase project
 * to confirm that credentials are valid and the project is reachable.
 *
 * Keys are never displayed. This component should only be rendered
 * in development or on a dedicated settings/debug screen.
 */
export const SupabaseStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<SupabaseStatus>('checking');
  const [latencyMs, setLatencyMs] = useState<number | undefined>();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!isSupabaseConfigured) {
        setStatus('not-configured');
        setChecked(true);
        return;
      }

      setStatus('checking');
      const result = await probeSupabaseConnection();
      if (cancelled) return;
      setStatus(result.status);
      setLatencyMs(result.latencyMs);
      setChecked(true);
    }

    check();
    return () => { cancelled = true; };
  }, []);

  const config = {
    checking: {
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
      text: 'Verifying connection…',
      bg: 'bg-[#FAF6EE] border-[#E4DACA]',
      dot: 'bg-amber-400 animate-pulse',
      label: 'text-[#77736B]',
    },
    connected: {
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#829675]" />,
      text: `Supabase connected${latencyMs !== undefined ? ` · ${latencyMs} ms` : ''}`,
      bg: 'bg-[#E9EFE7]/70 border-[#829675]/40',
      dot: 'bg-[#829675]',
      label: 'text-[#42523D]',
    },
    failed: {
      icon: <XCircle className="w-3.5 h-3.5 text-red-500" />,
      text: 'Connection failed — check network or project status',
      bg: 'bg-red-50 border-red-200',
      dot: 'bg-red-500',
      label: 'text-red-700',
    },
    'not-configured': {
      icon: <WifiOff className="w-3.5 h-3.5 text-[#77736B]" />,
      text: 'Supabase not configured — running in demo mode',
      bg: 'bg-[#FAF6EE] border-[#E4DACA]',
      dot: 'bg-[#A39D93]',
      label: 'text-[#77736B]',
    },
  } as const;

  const c = config[status];

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium ${c.bg} transition-all duration-300`}
      title={
        status === 'connected'
          ? 'A live auth.getSession() call to Supabase succeeded. No keys are displayed.'
          : status === 'failed'
          ? 'The connection probe failed. Credentials may be wrong or the project may be paused.'
          : status === 'not-configured'
          ? 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or invalid in .env'
          : 'Testing connection…'
      }
    >
      {/* Animated status dot */}
      <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />

      {/* Icon */}
      <span className={c.label}>{c.icon}</span>

      {/* Status label */}
      <span className={c.label}>{c.text}</span>

      {/* Database icon — dev signal */}
      <Database className="w-3 h-3 text-[#A39D93] ml-auto opacity-60" />
    </div>
  );
};
