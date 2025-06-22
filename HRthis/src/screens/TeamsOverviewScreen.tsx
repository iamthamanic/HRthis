import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useTeamsStore } from '../state/teams';
import { cn } from '../utils/cn';
import { Team } from '../types';

/**
 * Teams Overview Screen Component
 * Allows HR admins to manage teams within the organization
 * Features include team creation, editing, deletion, and member/lead overview
 */
export const TeamsOverviewScreen = () => {
  const navigate = useNavigate();
  const { user, getAllUsers } = useAuthStore();
  const { 
    getAllTeams, 
    createTeam, 
    updateTeam, 
    deleteTeam,
    getTeamMembers,
    getTeamLeads,
    isLoading 
  } = useTeamsStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Check if current user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Zugriff verweigert</h2>
          <p className="text-gray-600">Diese Seite ist nur für Administratoren verfügbar.</p>
        </div>
      </div>
    );
  }

  const allTeams = getAllTeams();
  const allUsers = getAllUsers();

  const filteredTeams = allTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Create a new team with validation
   * Ensures team name is not empty and handles errors gracefully
   */
  const handleCreateTeam = async () => {
    // Validate team name
    if (!newTeam.name.trim()) {
      alert('Bitte geben Sie einen Team-Namen ein');
      return;
    }
    
    try {
      await createTeam({
        name: newTeam.name.trim(),
        description: newTeam.description.trim(),
        organizationId: user!.organizationId,
        leadIds: [],
        memberIds: []
      });
      setNewTeam({ name: '', description: '' });
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Fehler beim Erstellen des Teams');
    }
  };

  const handleUpdateTeam = async () => {
    if (editingTeam && editingTeam.name.trim()) {
      try {
        await updateTeam(editingTeam.id, {
          name: editingTeam.name,
          description: editingTeam.description
        });
        setEditingTeam(null);
      } catch (error) {
        console.error('Error updating team:', error);
      }
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Team löschen möchten?')) {
      try {
        await deleteTeam(teamId);
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/team-management')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              ← Zurück
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teams verwalten</h1>
              <p className="text-gray-600">Erstellen und verwalten Sie Teams in Ihrer Organisation</p>
            </div>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Neues Team
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <span className="text-blue-600">🏢</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gesamt Teams</p>
                <p className="text-xl font-semibold">{allTeams.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <span className="text-green-600">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mitglieder insgesamt</p>
                <p className="text-xl font-semibold">
                  {allTeams.reduce((sum, team) => sum + team.memberIds.length, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <span className="text-orange-600">👑</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Team Leads</p>
                <p className="text-xl font-semibold">
                  {allTeams.reduce((sum, team) => sum + team.leadIds.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Teams durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Create Team Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Neues Team erstellen</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="z.B. Entwicklung, Marketing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Beschreibung des Teams..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleCreateTeam}
                  disabled={!newTeam.name.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Erstellen...' : 'Erstellen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team bearbeiten</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                <textarea
                  value={editingTeam.description || ''}
                  onChange={(e) => setEditingTeam(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingTeam(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleUpdateTeam}
                  disabled={!editingTeam.name.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const teamMembers = getTeamMembers(team.id, allUsers);
          const teamLeads = getTeamLeads(team.id, allUsers);

          return (
            <div key={team.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{team.name}</h3>
                  {team.description && (
                    <p className="text-sm text-gray-600 mb-3">{team.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTeam(team)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">{teamMembers.length}</div>
                  <div className="text-xs text-blue-600">Mitglieder</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-semibold text-orange-600">{teamLeads.length}</div>
                  <div className="text-xs text-orange-600">Leads</div>
                </div>
              </div>

              {/* Team Leads */}
              {teamLeads.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Team Leads:</div>
                  <div className="space-y-1">
                    {teamLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center text-sm">
                        <span className="text-orange-500 mr-2">👑</span>
                        <span className="text-gray-900">{lead.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members Preview */}
              {teamMembers.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Mitglieder:</div>
                  <div className="space-y-1">
                    {teamMembers.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center text-sm">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-gray-900">{member.name}</span>
                        {teamLeads.some(lead => lead.id === member.id) && (
                          <span className="ml-1 text-orange-500">👑</span>
                        )}
                      </div>
                    ))}
                    {teamMembers.length > 3 && (
                      <div className="text-xs text-gray-500 pl-8">
                        +{teamMembers.length - 3} weitere
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/team-management/team/${team.id}`}
                  className="flex-1 px-3 py-2 text-center bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
                >
                  Details
                </Link>
                <button className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium">
                  Mitglieder
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">🏢</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Teams gefunden</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Versuchen Sie einen anderen Suchbegriff.' : 'Erstellen Sie Ihr erstes Team.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Erstes Team erstellen
            </button>
          )}
        </div>
      )}
    </div>
  );
};