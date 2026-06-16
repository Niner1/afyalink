import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Avatar, Button, Input, SectionHeader } from '../components/UI';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { trpc } from '../lib/trpc';

export default function Clients() {
  const { setSelectedClient, setActivePage } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch real clients from backend
  const { data: clients, isLoading, refetch } = trpc.clients.list.useQuery({
    status: statusFilter === 'All' ? undefined : statusFilter,
  });

  const deleteMutation = trpc.clients.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    return clients.filter(c => {
      const matchesSearch = !search || 
        c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search);
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const statusCounts = useMemo(() => {
    if (!clients) return {};
    return {
      All: clients.length,
      Active: clients.filter(c => c.status === 'Active').length,
      Inactive: clients.filter(c => c.status === 'Inactive').length,
    };
  }, [clients]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading clients...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <SectionHeader title="Clients" subtitle={`${filteredClients.length} total`} />
        <Button style={{ background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add Client
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: 'var(--text-muted)', marginTop: 8 }} />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['All', 'Active', 'Inactive'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: statusFilter === status ? '2px solid var(--accent)' : '1px solid var(--border-light)',
                background: statusFilter === status ? 'var(--accent-light)' : 'transparent',
                color: statusFilter === status ? 'var(--accent)' : 'var(--text-muted)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {status} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Client</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Contact</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Diagnoses</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Registered</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'var(--transition)' }}
                  onMouseEnter={e => (e.currentTarget).style.background = 'var(--bg-surface-2)'}
                  onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={client.fullName} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{client.fullName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {client.clientId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13 }}>
                      <div style={{ color: 'var(--text-primary)' }}>{client.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{client.phone}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge variant={client.status === 'Active' ? 'success' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {client.currentDiagnoses ? (
                        typeof client.currentDiagnoses === 'string' 
                          ? JSON.parse(client.currentDiagnoses).slice(0, 2).join(', ')
                          : client.currentDiagnoses.slice(0, 2).join(', ')
                      ) : 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {new Date(client.registrationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'var(--transition)' }}
                        onMouseEnter={e => (e.currentTarget).style.background = 'var(--bg-surface-2)'}
                        onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                      >
                        <Eye size={16} style={{ color: 'var(--accent)' }} />
                      </button>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'var(--transition)' }}
                        onMouseEnter={e => (e.currentTarget).style.background = 'var(--bg-surface-2)'}
                        onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                      >
                        <Edit2 size={16} style={{ color: 'var(--warning)' }} />
                      </button>
                      <button onClick={() => {
                        if (window.confirm(`Delete client ${client.fullName}?`)) {
                          deleteMutation.mutate({ id: client.id });
                        }
                      }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, transition: 'var(--transition)' }}
                        onMouseEnter={e => (e.currentTarget).style.background = 'var(--bg-surface-2)'}
                        onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                      >
                        <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredClients.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 16, marginBottom: 8 }}>No clients found</div>
          <div style={{ fontSize: 14 }}>Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}
