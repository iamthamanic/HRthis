import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useTeamsStore } from '../state/teams';
import { useLeavesStore } from '../state/leaves';
// import { useCoinsStore } from '../state/coins';
import { cn } from '../utils/cn';
import { User } from '../types';

/**
 * Team Member Details Screen Component
 * Allows HR admins to view and edit detailed information about team members
 * Features include personal info editing, team assignment, lead designation, and coin management
 */
export const TeamMemberDetailsScreen = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, getAllUsers, updateUser } = useAuthStore();
  const { 
    getAllTeams, 
    getTeamsByUserId, 
    getTeamsLedByUser,
    addMemberToTeam,
    removeMemberFromTeam,
    setTeamLead
  } = useTeamsStore();
  const { getVacationBalance, getUserLeaveRequests } = useLeavesStore();
  // const { getCoinBalance, addCoins, removeCoins } = useCoinsStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [coinAmount, setCoinAmount] = useState<number>(0);
  const [coinReason, setCoinReason] = useState<string>('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [leadTeams, setLeadTeams] = useState<string[]>([]);

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN';

  const allUsers = getAllUsers();
  const allTeams = getAllTeams();
  const targetUser = allUsers.find(u => u.id === userId);

  useEffect(() => {
    if (targetUser) {
      setEditedUser(targetUser);
      const userTeams = getTeamsByUserId(targetUser.id);
      const userLeadTeams = getTeamsLedByUser(targetUser.id);
      setSelectedTeams(userTeams.map(t => t.id));
      setLeadTeams(userLeadTeams.map(t => t.id));
    }
  }, [targetUser, userId]);

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

  if (!targetUser) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Mitarbeiter nicht gefunden</h2>
          <p className="text-gray-600">Der angegebene Mitarbeiter existiert nicht.</p>
          <Link to="/team-management" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Zurück zur Teamverwaltung
          </Link>
        </div>
      </div>
    );
  }

  const vacationBalance = getVacationBalance(targetUser.id);
  const coinBalance = { balance: targetUser.coinWallet || 0, progress: targetUser.coinProgress || 0, level: targetUser.level || 1 };
  const userRequests = getUserLeaveRequests(targetUser.id);
  const userTeams = getTeamsByUserId(targetUser.id);
  const userLeadTeams = getTeamsLedByUser(targetUser.id);

  /**
   * Save user changes including personal info and team assignments
   * Handles team membership updates and lead role assignments
   */
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUser(targetUser.id, editedUser);
      
      // Update team memberships
      const currentTeamIds = userTeams.map(t => t.id);
      
      // Remove from teams that were deselected
      for (const teamId of currentTeamIds) {
        if (!selectedTeams.includes(teamId)) {
          await removeMemberFromTeam(teamId, targetUser.id);
        }
      }
      
      // Add to newly selected teams
      for (const teamId of selectedTeams) {
        if (!currentTeamIds.includes(teamId)) {
          await addMemberToTeam(teamId, targetUser.id);
        }
      }
      
      // Update lead status for all selected teams
      for (const teamId of selectedTeams) {
        const isLead = leadTeams.includes(teamId);
        await setTeamLead(teamId, targetUser.id, isLead);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      // In production, show user-friendly error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCoins = async () => {
    if (coinAmount > 0) {
      try {
        // await addCoins(targetUser.id, coinAmount, coinReason || 'Manuell hinzugefügt');
        console.log('Add coins:', coinAmount, coinReason);
        setCoinAmount(0);
        setCoinReason('');
      } catch (error) {
        console.error('Error adding coins:', error);
      }
    }
  };

  const handleRemoveCoins = async () => {
    if (coinAmount > 0) {
      try {
        // await removeCoins(targetUser.id, coinAmount, coinReason || 'Manuell entfernt');
        console.log('Remove coins:', coinAmount, coinReason);
        setCoinAmount(0);
        setCoinReason('');
      } catch (error) {
        console.error('Error removing coins:', error);
      }
    }
  };

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleLeadToggle = (teamId: string) => {
    setLeadTeams(prev => 
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/team-management')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              ← Zurück
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{targetUser.name}</h1>
              <p className="text-gray-600">{targetUser.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Speichern...' : 'Speichern'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Bearbeiten
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Persönliche Informationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.firstName || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.firstName || 'Nicht angegeben'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.lastName || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.lastName || 'Nicht angegeben'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail (System)</label>
                <p className="py-2 text-gray-500">{targetUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Private E-Mail</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.privateEmail || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, privateEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.privateEmail || 'Nicht angegeben'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedUser.phone || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.phone || 'Nicht angegeben'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eintrittsdatum</label>
                <p className="py-2 text-gray-500">{targetUser.joinDate || 'Nicht angegeben'}</p>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Arbeitsinformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.position || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.position || 'Nicht angegeben'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Abteilung</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.department || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.department || 'Nicht angegeben'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wochenstunden</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedUser.weeklyHours || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, weeklyHours: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.weeklyHours || 0} Stunden</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urlaubsanspruch</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedUser.vacationDays || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, vacationDays: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="py-2 text-gray-900">{targetUser.vacationDays || 0} Tage/Jahr</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschäftigungsstatus</label>
                {isEditing ? (
                  <select
                    value={editedUser.employmentStatus || targetUser.employmentStatus}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, employmentStatus: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ACTIVE">Aktiv</option>
                    <option value="PARENTAL_LEAVE">Elternzeit</option>
                    <option value="TERMINATED">Gekündigt</option>
                  </select>
                ) : (
                  <p className="py-2 text-gray-900">
                    {targetUser.employmentStatus === 'ACTIVE' ? 'Aktiv' :
                     targetUser.employmentStatus === 'PARENTAL_LEAVE' ? 'Elternzeit' : 'Gekündigt'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                {isEditing ? (
                  <select
                    value={editedUser.role || targetUser.role}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="EMPLOYEE">Mitarbeiter</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                ) : (
                  <p className="py-2 text-gray-900">
                    {targetUser.role === 'EMPLOYEE' ? 'Mitarbeiter' : 
                     targetUser.role === 'ADMIN' ? 'Admin' : 'Super Admin'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Teamzuweisung</h3>
            <div className="space-y-3">
              {allTeams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team.id)}
                        onChange={() => handleTeamToggle(team.id)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    ) : (
                      <div className="mr-3 w-4 h-4 flex items-center justify-center">
                        {userTeams.some(t => t.id === team.id) ? '✅' : '⬜'}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{team.name}</p>
                      {team.description && (
                        <p className="text-sm text-gray-500">{team.description}</p>
                      )}
                    </div>
                  </div>
                  {(selectedTeams.includes(team.id) || userTeams.some(t => t.id === team.id)) && (
                    <div className="flex items-center">
                      {isEditing ? (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={leadTeams.includes(team.id)}
                            onChange={() => handleLeadToggle(team.id)}
                            disabled={!selectedTeams.includes(team.id)}
                            className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-orange-600 font-medium">Team Lead</span>
                        </label>
                      ) : (
                        userLeadTeams.some(t => t.id === team.id) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            👑 Lead
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Übersicht</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Resturlaub</span>
                <span className="font-semibold">{vacationBalance?.remainingDays || 0} Tage</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Teams</span>
                <span className="font-semibold">{userTeams.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Team Lead</span>
                <span className="font-semibold">{userLeadTeams.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Offene Anträge</span>
                <span className="font-semibold">
                  {userRequests.filter(r => r.status === 'PENDING').length}
                </span>
              </div>
            </div>
          </div>

          {/* Coins Management */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coin-Verwaltung</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  🪙 {coinBalance?.balance || 0}
                </div>
                <div className="text-sm text-gray-600">
                  Level {coinBalance?.level || 1} • {coinBalance?.progress || 0} XP
                </div>
              </div>
              
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Anzahl Coins"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Grund (optional)"
                  value={coinReason}
                  onChange={(e) => setCoinReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCoins}
                    disabled={coinAmount <= 0}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    + Hinzufügen
                  </button>
                  <button
                    onClick={handleRemoveCoins}
                    disabled={coinAmount <= 0}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
                  >
                    - Entfernen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                📧 E-Mail senden
              </button>
              <button className="w-full px-4 py-2 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                📄 Dokument zuweisen
              </button>
              <button className="w-full px-4 py-2 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                🎓 Schulung zuweisen
              </button>
              <button className="w-full px-4 py-2 text-left bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">
                🏆 Badge vergeben
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};