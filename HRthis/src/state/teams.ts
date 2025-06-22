import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Team, User } from '../types';

/**
 * Zustand store for team management
 * Handles all team-related operations including team creation, member management, and lead assignments
 */
interface TeamsState {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getAllTeams: () => Team[];
  getTeamById: (teamId: string) => Team | undefined;
  getTeamsByUserId: (userId: string) => Team[];
  getTeamsLedByUser: (userId: string) => Team[];
  createTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Team>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMemberToTeam: (teamId: string, userId: string) => Promise<void>;
  removeMemberFromTeam: (teamId: string, userId: string) => Promise<void>;
  setTeamLead: (teamId: string, userId: string, isLead: boolean) => Promise<void>;
  getTeamMembers: (teamId: string, allUsers: User[]) => User[];
  getTeamLeads: (teamId: string, allUsers: User[]) => User[];
}

// Mock team data
const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'Entwicklung',
    description: 'Software Development Team',
    organizationId: 'org1',
    leadIds: ['2'], // Anna Admin is lead
    memberIds: ['1', '2'], // Max and Anna
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'team2',
    name: 'Marketing',
    description: 'Marketing and Design Team',
    organizationId: 'org1',
    leadIds: ['2'], // Anna Admin is lead
    memberIds: ['2', '3'], // Anna and Tom
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'team3',
    name: 'Quality Assurance',
    description: 'Testing and QA Team',
    organizationId: 'org1',
    leadIds: ['2'], // Anna Admin is lead
    memberIds: ['2', '4'], // Anna and Test User
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const useTeamsStore = create<TeamsState>()(
  persist(
    (set, get) => ({
      teams: mockTeams,
      isLoading: false,
      error: null,

      /**
       * Get all teams in the organization
       * @returns Array of all teams
       */
      getAllTeams: () => {
        return get().teams;
      },

      /**
       * Get a specific team by its ID
       * @param teamId - The ID of the team to retrieve
       * @returns The team if found, undefined otherwise
       */
      getTeamById: (teamId: string) => {
        return get().teams.find(team => team.id === teamId);
      },

      /**
       * Get all teams a user belongs to
       * @param userId - The ID of the user
       * @returns Array of teams the user is a member of
       */
      getTeamsByUserId: (userId: string) => {
        return get().teams.filter(team => team.memberIds.includes(userId));
      },

      /**
       * Get all teams where a user is a lead
       * @param userId - The ID of the user
       * @returns Array of teams where the user is a lead
       */
      getTeamsLedByUser: (userId: string) => {
        return get().teams.filter(team => team.leadIds.includes(userId));
      },

      /**
       * Create a new team
       * @param teamData - Team data without system-generated fields
       * @returns The newly created team
       * @throws Error if team creation fails
       */
      createTeam: async (teamData) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call - in production, this would be an actual API request
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newTeam: Team = {
            ...teamData,
            id: `team${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set(state => ({
            teams: [...state.teams, newTeam],
            isLoading: false
          }));
          
          return newTeam;
        } catch (error) {
          set({ isLoading: false, error: 'Failed to create team' });
          throw error;
        }
      },

      /**
       * Update an existing team
       * @param teamId - The ID of the team to update
       * @param updates - Partial team data to update
       * @throws Error if team update fails
       */
      updateTeam: async (teamId: string, updates) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            teams: state.teams.map(team =>
              team.id === teamId
                ? { ...team, ...updates, updatedAt: new Date().toISOString() }
                : team
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to update team' });
          throw error;
        }
      },

      deleteTeam: async (teamId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            teams: state.teams.filter(team => team.id !== teamId),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to delete team' });
          throw error;
        }
      },

      addMemberToTeam: async (teamId: string, userId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            teams: state.teams.map(team =>
              team.id === teamId && !team.memberIds.includes(userId)
                ? { 
                    ...team, 
                    memberIds: [...team.memberIds, userId],
                    updatedAt: new Date().toISOString()
                  }
                : team
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to add member to team' });
          throw error;
        }
      },

      removeMemberFromTeam: async (teamId: string, userId: string) => {
        set({ isLoading: true });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            teams: state.teams.map(team =>
              team.id === teamId
                ? { 
                    ...team, 
                    memberIds: team.memberIds.filter(id => id !== userId),
                    leadIds: team.leadIds.filter(id => id !== userId), // Remove from leads too
                    updatedAt: new Date().toISOString()
                  }
                : team
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to remove member from team' });
          throw error;
        }
      },

      /**
       * Set or remove a user as team lead
       * @param teamId - The ID of the team
       * @param userId - The ID of the user
       * @param isLead - Whether the user should be a lead
       * @throws Error if operation fails
       */
      setTeamLead: async (teamId: string, userId: string, isLead: boolean) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            teams: state.teams.map(team => {
              if (team.id !== teamId) return team;
              
              let newLeadIds = [...team.leadIds];
              let newMemberIds = [...team.memberIds];
              
              if (isLead) {
                // Add as lead and ensure they're a member
                if (!newLeadIds.includes(userId)) {
                  newLeadIds.push(userId);
                }
                if (!newMemberIds.includes(userId)) {
                  newMemberIds.push(userId);
                }
              } else {
                // Remove from leads
                newLeadIds = newLeadIds.filter(id => id !== userId);
              }
              
              return {
                ...team,
                leadIds: newLeadIds,
                memberIds: newMemberIds,
                updatedAt: new Date().toISOString()
              };
            }),
            isLoading: false
          }));
        } catch (error) {
          set({ isLoading: false, error: 'Failed to update team lead' });
          throw error;
        }
      },

      getTeamMembers: (teamId: string, allUsers: User[]) => {
        const team = get().getTeamById(teamId);
        if (!team) return [];
        
        return allUsers.filter(user => team.memberIds.includes(user.id));
      },

      getTeamLeads: (teamId: string, allUsers: User[]) => {
        const team = get().getTeamById(teamId);
        if (!team) return [];
        
        return allUsers.filter(user => team.leadIds.includes(user.id));
      }
    }),
    {
      name: 'teams-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ teams: state.teams }),
    }
  )
);