import React, { useState } from 'react';
import { DeploymentResult, DeploymentStep } from '../types/msp';
import { 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  KeyRound, 
  Globe, 
  MessageCircle,
  Share2,
  QrCode,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DeploymentResult | null;
  currentStep: DeploymentStep;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
  result,
  currentStep,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const stepsList = [
    { key: 'validating', label: 'Validando configuración y slug' },
    { key: 'creating_dokploy_app', label: 'Aprovisionando aplicación en Dokploy' },
    { key: 'configuring_traefik_ssl', label: 'Configurando Traefik & SSL Let\'s Encrypt' },
    { key: 'deploying_container', label: 'Inyectando variables de tema y levantando contenedor' },
  ];

  const getStepStatus = (stepKey: string) => {
    if (result?.success) return 'completed';
    const order = ['idle', 'validating', 'creating_dokploy_app', 'configuring_traefik_ssl', 'deploying_container', 'ready'];
    const currentIndex = order.indexOf(currentStep);
    const targetIndex = order.indexOf(stepKey);

    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex) return 'in_progress';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5">
            {result?.success ? (
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : result?.errorMessage ? (
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {result?.success
                  ? '¡Tu Tienda Está 100% en Línea!'
                  : result?.errorMessage
                  ? 'Error en el Despliegue'
                  : 'Desplegando en Dokploy...'}
              </h2>
              <p className="text-xs text-slate-400">
                {result?.success
                  ? 'Subdominio, certificado SSL y catálogo listos para vender.'
                  : result?.errorMessage
                  ? result.errorMessage
                  : 'Aprovisionamiento agéntico y configuración en curso.'}
              </p>
            </div>
          </div>
        </div>

        {/* Deployment Steps Progression */}
        {!result?.success && !result?.errorMessage && (
          <div className="my-6 space-y-3 p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            {stepsList.map((step) => {
              const status = getStepStatus(step.key);
              return (
                <div key={step.key} className="flex items-center gap-3">
                  {status === 'completed' ? (
                    <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : status === 'in_progress' ? (
                    <span className="p-1 rounded-full bg-indigo-500 text-white">
                      <Loader2 className="w-3 h-3 animate-spin" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-slate-700 bg-slate-800" />
                  )}

                  <span
                    className={`text-xs font-medium ${
                      status === 'completed'
                        ? 'text-emerald-400 font-semibold'
                        : status === 'in_progress'
                        ? 'text-indigo-300 font-semibold animate-pulse'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Success Result Details Card */}
        {result?.success && (
          <div className="space-y-4 my-6">
            {/* Public URL Box */}
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Enlace Público de la Tienda
                </span>
                <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  SSL Seguro
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={result.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-white hover:text-emerald-400 underline truncate flex items-center gap-1"
                >
                  {result.publicUrl}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(result.publicUrl, 'publicUrl')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
                  title="Copiar enlace"
                >
                  {copiedField === 'publicUrl' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Admin Panel Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Panel de Control / Admin
                </span>
                <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                  Gestión de Catálogo
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={result.adminUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm text-slate-300 hover:text-indigo-300 underline truncate flex items-center gap-1"
                >
                  {result.adminUrl}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(result.adminUrl, 'adminUrl')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
                  title="Copiar enlace admin"
                >
                  {copiedField === 'adminUrl' ? <Check className="w-4 h-4 text-indigo-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={result.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Visitar Tienda en Vivo
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Ya puedes conocer nuestro catálogo digital oficial aquí: ${result.publicUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Compartir por WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
