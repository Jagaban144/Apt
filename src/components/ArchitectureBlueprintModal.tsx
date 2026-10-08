import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Database, 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  ArrowRight,
  GitBranch,
  Lock,
  Boxes
} from 'lucide-react';
import { 
  ARCHITECTURE_SERVICES, 
  POSTGRES_DDL_SCHEMA, 
  DOCKERFILE_CODE, 
  GITHUB_ACTIONS_CI_CD 
} from '../data/architectureBlueprint';

interface ArchitectureBlueprintModalProps {
  onClose: () => void;
}

export const ArchitectureBlueprintModal: React.FC<ArchitectureBlueprintModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'database' | 'devops' | 'security'>('services');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0A192F] text-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-blue-500/30 flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-[#0A192F]/95 backdrop-blur-md px-6 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  System Architecture & Technical Blueprint
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-400/30">
                  v3.4 Production Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Specifications for Microservices, PostgreSQL Schema, Row-Level Lock Transactions & AWS DevOps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-900/60 px-6 py-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
          {[
            { id: 'services', label: '1. Microservices & API Architecture', icon: Boxes },
            { id: 'database', label: '2. PostgreSQL Relational Schema (DDL)', icon: Database },
            { id: 'devops', label: '3. Docker & CI/CD Pipeline', icon: Terminal },
            { id: 'security', label: '4. Security, PCI-DSS & Cloud Infrastructure', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB 1: Microservices */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 text-xs text-blue-200 flex items-start space-x-3">
                <Cpu className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm mb-1">
                    Modular Monolith to Distributed Microservices Architecture
                  </strong>
                  The platform uses event-driven communication via Kafka/RabbitMQ between decoupled domains,
                  providing ultra-fast spatial search, resilient idempotent payments, and ACID transactions for inventory holds.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ARCHITECTURE_SERVICES.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
                          {srv.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{srv.name}</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {srv.description}
                      </p>

                      {/* Tech stack */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {srv.technologies.map((t, ti) => (
                          <span
                            key={ti}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Endpoints */}
                      <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Key API Endpoints:
                        </span>
                        {srv.endpoints.map((ep, ei) => (
                          <div
                            key={ei}
                            className="text-[11px] font-mono flex items-center justify-between text-slate-300 bg-slate-950/60 px-2 py-1 rounded"
                          >
                            <span className="font-bold text-cyan-400 mr-2">{ep.method}</span>
                            <span className="text-slate-200 truncate flex-1">{ep.path}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span>{srv.resiliencePattern}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PostgreSQL Schema */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">PostgreSQL 16 Enterprise DDL</h3>
                  <p className="text-xs text-slate-400">
                    Includes PostGIS spatial geometry, check constraints, foreign keys, and indexes.
                  </p>
                </div>

                <button
                  onClick={() => handleCopy('ddl', POSTGRES_DDL_SCHEMA)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
                >
                  {copiedKey === 'ddl' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied Schema!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy DDL Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-[500px] overflow-y-auto">
                <pre>{POSTGRES_DDL_SCHEMA}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: DevOps & CI/CD */}
          {activeTab === 'devops' && (
            <div className="space-y-6">
              {/* Docker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Multi-Stage Dockerfile (Alpine Minimal)</span>
                  <button
                    onClick={() => handleCopy('docker', DOCKERFILE_CODE)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded-lg flex items-center space-x-1"
                  >
                    {copiedKey === 'docker' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'docker' ? 'Copied' : 'Copy Dockerfile'}</span>
                  </button>
                </div>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto">
                  <pre>{DOCKERFILE_CODE}</pre>
                </div>
              </div>

              {/* GitHub Actions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">GitHub Actions Pipeline (.github/workflows/deploy.yml)</span>
                  <button
                    onClick={() => handleCopy('actions', GITHUB_ACTIONS_CI_CD)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded-lg flex items-center space-x-1"
                  >
                    {copiedKey === 'actions' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'actions' ? 'Copied' : 'Copy Workflow'}</span>
                  </button>
                </div>
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto">
                  <pre>{GITHUB_ACTIONS_CI_CD}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Cloud Infrastructure & Compliance */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
                    <Cloud className="w-4 h-4" />
                    <span>AWS Multi-AZ Cloud Topography</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>AWS CloudFront Global CDN with Edge SSL termination & Brotli compression.</li>
                    <li>AWS ECS Fargate autoscaling cluster with zero-downtime rolling deploys.</li>
                    <li>Amazon RDS PostgreSQL with Multi-AZ synchronous replication & automated snapshots.</li>
                    <li>AWS ElastiCache Redis 7 for sub-millisecond session & inventory locks.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <Lock className="w-4 h-4" />
                    <span>PCI-DSS & Security Compliance</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>PCI-DSS Level 1 compliance via Stripe tokenized client-side Elements.</li>
                    <li>Zero credit card PAN/CVV storage on AuraStay servers.</li>
                    <li>OWASP Top 10 mitigation: strict Content Security Policy (CSP), SQL parameterization, rate limiting.</li>
                    <li>JWT tokens signed with asymmetric RS256 private/public key pairs.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
