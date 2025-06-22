import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useTeamsStore } from '../state/teams';
import { useLeavesStore } from '../state/leaves';
// import { useCoinsStore } from '../state/coins';
import { cn } from '../utils/cn';
import { User } from '../types';

/**
 * Extended user interface for team management view
 * Includes additional computed fields for display purposes
 */
interface TeamMemberView extends User {
  teamNames: string[];
  remainingVacationDays: number;
  lastLoginDays: number;
  pendingRequests: number;
}

/**
 * Team Management Screen Component
 * Main dashboard for HR admins to manage teams and team members
 * Features include team assignment, lead designation, and member overview
 */
export const TeamManagementScreen = () => {
  const { user } = useAuthStore();
  const { getAllUsers } = useAuthStore();
  const { getAllTeams, getTeamsByUserId } = useTeamsStore();
  const { getVacationBalance } = useLeavesStore();
  // const { getCoinBalance } = useCoinsStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  // Check if current user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';

  const allUsers = getAllUsers();
  const allTeams = getAllTeams();

  // Transform users to team member view
  const teamMembers: TeamMemberView[] = useMemo(() => {
    return allUsers.map(user => {
      const userTeams = getTeamsByUserId(user.id);
      const teamNames = userTeams.map(team => team.name);
      const vacationBalance = getVacationBalance(user.id);
      
      return {
        ...user,
        teamNames,
        remainingVacationDays: vacationBalance?.remainingDays || 0,
        lastLoginDays: Math.floor(Math.random() * 30), // Mock data
        pendingRequests: 0, // Would come from requests store
        coinWallet: user.coinWallet || 0,
        coinProgress: user.coinProgress || 0,
        level: user.level || 1
      };
    });
  }, [allUsers, allTeams, getTeamsByUserId, getVacationBalance]);

  // Filter and sort team members
  const filteredMembers = useMemo(() => {
    let filtered = teamMembers.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.teamNames.some(team => team.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || member.employmentStatus === filterStatus;
      const matchesRole = filterRole === 'all' || member.role === filterRole;

      return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'position':
          return (a.position || '').localeCompare(b.position || '');
        case 'vacation':
          return b.remainingVacationDays - a.remainingVacationDays;
        case 'coins':
          return (b.coinWallet || 0) - (a.coinWallet || 0);
        case 'lastLogin':
          return a.lastLoginDays - b.lastLoginDays;
        default:
          return 0;
      }
    });

    return filtered;
  }, [teamMembers, searchTerm, filterStatus, filterRole, sortBy]);

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teamverwaltung</h1>
            <p className="text-gray-600">Verwalten Sie alle Mitarbeitenden und Teams</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/team-management/teams"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
            >
              Teams verwalten
            </Link>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              + Mitarbeiter hinzufügen
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <span className="text-blue-600">👥</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gesamt Mitarbeiter</p>
                <p className="text-xl font-semibold">{allUsers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktive</p>
                <p className="text-xl font-semibold">
                  {allUsers.filter(u => u.employmentStatus === 'ACTIVE').length}
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
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-xl font-semibold">
                  {allUsers.filter(u => u.role !== 'EMPLOYEE').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <span className="text-purple-600">🏢</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Teams</p>
                <p className="text-xl font-semibold">{allTeams.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Suche</label>
            <input
              type="text"
              placeholder="Name, Email, Position, Team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Alle</option>
              <option value="ACTIVE">Aktiv</option>
              <option value="PARENTAL_LEAVE">Elternzeit</option>
              <option value="TERMINATED">Gekündigt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Alle</option>
              <option value="EMPLOYEE">Mitarbeiter</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sortierung</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="position">Position</option>
              <option value="vacation">Resturlaub</option>
              <option value="coins">Coins</option>
              <option value="lastLogin">Letzter Login</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitarbeiter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position & Teams
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arbeitszeit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resturlaub
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coins & Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{member.position || 'Keine Position'}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.teamNames.map((teamName, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {teamName}
                        </span>
                      ))}
                      {member.teamNames.length === 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Kein Team
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      member.employmentStatus === 'ACTIVE' 
                        ? "bg-green-100 text-green-800"
                        : member.employmentStatus === 'PARENTAL_LEAVE'
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {member.employmentStatus === 'ACTIVE' ? 'Aktiv' :
                       member.employmentStatus === 'PARENTAL_LEAVE' ? 'Elternzeit' : 'Gekündigt'}
                    </span>
                    <div className="mt-1">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs",
                        member.role === 'EMPLOYEE' 
                          ? "bg-gray-100 text-gray-800"
                          : "bg-orange-100 text-orange-800"
                      )}>
                        {member.role === 'EMPLOYEE' ? 'Mitarbeiter' : 
                         member.role === 'ADMIN' ? 'Admin' : 'Super Admin'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.weeklyHours || 0}h/Woche
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.remainingVacationDays} Tage</div>
                    <div className="text-xs text-gray-500">von {member.vacationDays || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      🪙 {member.coinWallet || 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      Level {member.level || 1} • {member.coinProgress || 0} XP
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/team-management/user/${member.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Details
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600">
                      ⚙️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Keine Mitarbeiter gefunden.</p>
          </div>
        )}
      </div>
    </div>
  );
};