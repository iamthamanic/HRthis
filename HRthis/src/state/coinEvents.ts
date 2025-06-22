import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Represents a coin-based event or milestone that users can unlock
 */
export interface CoinEvent {
  /** Unique identifier for the event */
  id: string;
  /** Display title of the event */
  title: string;
  /** Detailed description of the event */
  description: string;
  /** Number of coins required to unlock this event */
  requiredCoins: number;
  /** Description of what the user receives when unlocking this event */
  reward: string;
  /** Whether this event is currently active and available */
  isActive: boolean;
  /** ISO timestamp of when the event was created */
  createdAt: string;
}

interface CoinEventsState {
  /** List of all coin events */
  events: CoinEvent[];
  /** Loading state for async operations */
  isLoading: boolean;
  
  /** Get all currently active events */
  getActiveEvents: () => CoinEvent[];
  
  /** Get events that the user has enough coins to unlock */
  getUnlockedEvents: (userBalance: number) => CoinEvent[];
  
  /** Get the next event the user can work towards */
  getNextEvent: (userBalance: number) => CoinEvent | null;
  
  /** Add a new coin event */
  addEvent: (event: Omit<CoinEvent, 'id' | 'createdAt'>) => Promise<void>;
  
  /** Update an existing event */
  updateEvent: (eventId: string, updates: Partial<CoinEvent>) => Promise<void>;
  
  /** Delete an event */
  deleteEvent: (eventId: string) => Promise<void>;
}

// Mock data for initial events
const mockEvents: CoinEvent[] = [
  {
    id: '1',
    title: 'Bronze Status',
    description: 'Achieve Bronze status and unlock basic perks',
    requiredCoins: 100,
    reward: 'Bronze badge + 5% discount on company merchandise',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    title: 'Silver Status',
    description: 'Level up to Silver status for enhanced benefits',
    requiredCoins: 250,
    reward: 'Silver badge + 10% discount + Priority support',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '3',
    title: 'Gold Status',
    description: 'Reach Gold status and enjoy premium perks',
    requiredCoins: 500,
    reward: 'Gold badge + 15% discount + VIP lounge access + 1 extra vacation day',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '4',
    title: 'Platinum Status',
    description: 'Achieve the highest status level with exclusive rewards',
    requiredCoins: 1000,
    reward: 'Platinum badge + 20% discount + Executive lounge + 2 extra vacation days + Personal assistant for 1 month',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
  },
];

export const useCoinEventsStore = create<CoinEventsState>()(
  persist(
    (set, get) => ({
      events: mockEvents,
      isLoading: false,

      getActiveEvents: () => {
        return get().events.filter(event => event.isActive);
      },

      getUnlockedEvents: (userBalance: number) => {
        return get().events.filter(
          event => event.isActive && userBalance >= event.requiredCoins
        );
      },

      getNextEvent: (userBalance: number) => {
        const activeEvents = get().getActiveEvents();
        const affordableEvents = activeEvents
          .filter(event => event.requiredCoins > userBalance)
          .sort((a, b) => a.requiredCoins - b.requiredCoins);
        
        return affordableEvents[0] || null;
      },

      addEvent: async (eventData) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newEvent: CoinEvent = {
          ...eventData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          events: [...state.events, newEvent],
          isLoading: false,
        }));
      },

      updateEvent: async (eventId, updates) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          events: state.events.map(event =>
            event.id === eventId ? { ...event, ...updates } : event
          ),
          isLoading: false,
        }));
      },

      deleteEvent: async (eventId) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          events: state.events.filter(event => event.id !== eventId),
          isLoading: false,
        }));
      },
    }),
    {
      name: 'coin-events-storage',
    }
  )
);