import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { useRemindersStore } from '../state/reminders';
import { LeaveRequest, TimeRecord } from '../types';
import { VacationReminder } from '../types/reminders';
import { CalendarDay } from '../types/calendar';
import { YearView } from '../components/YearView';
import { cn } from '../utils/cn';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'vacation' | 'sick' | 'work' | 'reminder' | 'personal';
  userId?: string;
  color: string;
}

/**
 * Enhanced calendar screen with personal and team views
 * Features vacation planning, time tracking integration, and event management
 */
export const CalendarScreen = () => {
  const navigate = useNavigate();
  const { user, getAllUsers } = useAuthStore();
  const { getAllLeaveRequests } = useLeavesStore();
  const { getTimeRecordsForPeriod } = useTimeRecordsStore();
  const { reminders } = useRemindersStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('personal');
  const [calendarView, setCalendarView] = useState<'month' | 'year'>('month');
  const [filterMode, setFilterMode] = useState<'all' | 'leaves' | 'work'>('all');
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Check if user is admin
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN';
  
  const allUsers = useMemo(() => getAllUsers(), [getAllUsers]);
  const allLeaves = getAllLeaveRequests();

  /**
   * Gets user name by ID
   */
  const getUserName = (userId: string): string => {
    const foundUser = allUsers.find(u => u.id === userId);
    if (foundUser) {
      return `${foundUser.firstName || foundUser.name.split(' ')[0]} ${foundUser.lastName || foundUser.name.split(' ')[1] || ''}`.trim();
    }
    
    const names: { [key: string]: string } = {
      '1': 'Max M.',
      '2': 'Anna A.',
      '3': 'Tom K.',
      '4': 'Test U.',
      '5': 'Lisa S.',
      '6': 'Julia B.',
      '7': 'Marco L.'
    };
    return names[userId] || 'Unbekannt';
  };

  /**
   * Generates calendar events for the current month
   */
  const generateCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get month range
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const startDateStr = startOfMonth.toISOString().split('T')[0];
    const endDateStr = endOfMonth.toISOString().split('T')[0];

    // Add leave events
    allLeaves
      .filter(leave => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        return (leaveStart <= endOfMonth && leaveEnd >= startOfMonth) && 
               leave.status === 'APPROVED' &&
               (viewMode === 'team' || leave.userId === user?.id);
      })
      .forEach(leave => {
        const startDate = new Date(Math.max(new Date(leave.startDate).getTime(), startOfMonth.getTime()));
        const endDate = new Date(Math.min(new Date(leave.endDate).getTime(), endOfMonth.getTime()));
        
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          events.push({
            id: `${leave.id}-${date.toISOString().split('T')[0]}`,
            title: viewMode === 'team' ? 
              `${getUserName(leave.userId)} - ${leave.type === 'VACATION' ? 'Urlaub' : 'Krank'}` :
              leave.type === 'VACATION' ? 'Urlaub' : 'Krank',
            date: date.toISOString().split('T')[0],
            type: leave.type === 'VACATION' ? 'vacation' : 'sick',
            userId: leave.userId,
            color: leave.type === 'VACATION' ? 'bg-blue-500' : 'bg-red-500'
          });
        }
      });

    // Add time records for personal view
    if (viewMode === 'personal' && user) {
      const timeRecords = getTimeRecordsForPeriod(user.id, startDateStr, endDateStr);
      timeRecords.forEach(record => {
        if (record.timeOut) { // Only completed records
          events.push({
            id: `time-${record.id}`,
            title: `${record.totalHours.toFixed(1)}h gearbeitet`,
            date: record.date,
            type: 'work',
            color: record.totalHours >= 8 ? 'bg-green-500' : 
                   record.totalHours >= 6 ? 'bg-yellow-500' : 'bg-red-500'
          });
        }
      });
    }

    // Add reminders
    reminders
      .filter(reminder => {
        const reminderDate = new Date(reminder.reminderDate);
        return reminderDate >= startOfMonth && reminderDate <= endOfMonth && 
               reminder.isActive &&
               (viewMode === 'team' || reminder.userId === user?.id);
      })
      .forEach(reminder => {
        events.push({
          id: `reminder-${reminder.id}`,
          title: reminder.message,
          date: reminder.reminderDate,
          type: 'reminder',
          color: 'bg-orange-500'
        });
      });

    return events;
  };

  /**
   * Generates calendar days with events and time data
   */
  useEffect(() => {
    const generateCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // First day of the month
      const firstDay = new Date(year, month, 1);
      
      // Start from Monday of the week containing the first day
      const startDate = new Date(firstDay);
      const dayOfWeek = firstDay.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate.setDate(firstDay.getDate() - daysToSubtract);
      
      // Generate time records for the month
      const startDateStr = new Date(year, month, 1).toISOString().split('T')[0];
      const endDateStr = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      // Get user's time records if in personal mode
      const userTimeRecords = user && viewMode === 'personal' ? 
        getTimeRecordsForPeriod(user.id, startDateStr, endDateStr) : [];
      
      // Generate team time records for team view
      const teamTimeRecords = viewMode === 'team' ? 
        allUsers.flatMap(u => getTimeRecordsForPeriod(u.id, startDateStr, endDateStr)) : [];
      
      // Generate 42 days (6 weeks)
      const days: CalendarDay[] = [];
      const today = new Date();
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = date.getMonth() === month;
        const isToday = date.toDateString() === today.toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        // Find leaves for this date
        const dateString = date.toISOString().split('T')[0];
        const dayLeaves = allLeaves.filter(leave => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const currentDate = new Date(dateString);
          
          return currentDate >= startDate && currentDate <= endDate && 
                 leave.status === 'APPROVED' &&
                 (viewMode === 'team' || leave.userId === user?.id);
        });

        // User's leaves for personal view
        const userLeaves = allLeaves.filter(leave => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const currentDate = new Date(dateString);
          
          return currentDate >= startDate && currentDate <= endDate && 
                 leave.userId === user?.id && leave.status === 'APPROVED';
        });
        
        // Find time records for this date
        const dayTimeRecords = teamTimeRecords.filter(record => record.date === dateString);
        const userTimeRecord = userTimeRecords.find(record => record.date === dateString) || null;
        
        // Find reminders for this date
        const dayReminders = reminders.filter(reminder => 
          reminder.reminderDate === dateString && reminder.isActive &&
          (viewMode === 'team' || reminder.userId === user?.id)
        );
        
        days.push({
          date,
          entries: [], // CalendarEntry[] - we'll populate this if needed
          isToday,
          isWeekend,
          isCurrentMonth,
          userLeaves,
          userTimeRecord,
          leaves: dayLeaves,
          reminders: dayReminders
        });
      }
      
      setCalendarDays(days);
    };
    
    generateCalendar();
  }, [currentDate, allLeaves, reminders, viewMode, user, isAdmin, allUsers, getTimeRecordsForPeriod]);

  /**
   * Navigation functions
   */
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  /**
   * Get month year text
   */
  const getMonthYearText = () => {
    return currentDate.toLocaleDateString('de-DE', {
      month: 'long',
      year: 'numeric'
    });
  };

  /**
   * Generate year view data with weeks for vacation overview.
   * Creates a nested structure: userId -> weekNumber -> LeaveRequest[]
   * 
   * @returns Object mapping user IDs to week numbers to leave requests
   */
  const generateYearData = (): { [userId: string]: { [week: string]: LeaveRequest[] } } => {
    const year = currentDate.getFullYear();
    const yearData: { [userId: string]: { [week: string]: LeaveRequest[] } } = {};
    
    // Get all users for team view
    const usersToShow = viewMode === 'team' ? allUsers : (user ? [user] : []);
    
    // Initialize user data
    usersToShow.forEach(u => {
      yearData[u.id] = {};
    });

    // Get all approved leaves for the year
    const yearLeaves = allLeaves.filter(leave => {
      const leaveYear = new Date(leave.startDate).getFullYear();
      return leaveYear === year && leave.status === 'APPROVED';
    });

    // Process each week of the year (52-53 weeks)
    for (let week = 1; week <= 53; week++) {
      const weekStart = getDateOfWeek(week, year);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      usersToShow.forEach(u => {
        yearData[u.id][week] = yearLeaves.filter(leave => {
          if (leave.userId !== u.id) return false;
          
          const leaveStart = new Date(leave.startDate);
          const leaveEnd = new Date(leave.endDate);
          
          // Check if leave overlaps with this week
          return leaveStart <= weekEnd && leaveEnd >= weekStart;
        });
      });
    }

    return yearData;
  };

  /**
   * Get the first day of a specific week in a year
   */
  const getDateOfWeek = (week: number, year: number) => {
    const jan1 = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const weekStart = new Date(jan1.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Adjust to Monday
    const dayOfWeek = weekStart.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    weekStart.setDate(weekStart.getDate() + diff);
    
    return weekStart;
  };

  /**
   * Get week number for a date
   */
  const getWeekNumber = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay() + 1) / 7);
  };

  /**
   * Get vacation days remaining for current user
   */
  const getVacationStats = () => {
    if (!user) return { total: 0, used: 0, remaining: 0 };
    
    const currentYear = new Date().getFullYear();
    const approvedVacations = allLeaves.filter(leave =>
      leave.userId === user.id &&
      leave.type === 'VACATION' &&
      leave.status === 'APPROVED' &&
      new Date(leave.startDate).getFullYear() === currentYear
    );
    
    const usedDays = approvedVacations.reduce((total, leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + days;
    }, 0);
    
    const totalDays = user.vacationDays || 30;
    
    return {
      total: totalDays,
      used: usedDays,
      remaining: Math.max(0, totalDays - usedDays)
    };
  };

  /**
   * Renders day content based on view mode and filters
   */
  const renderDayContent = (day: CalendarDay) => {
    const dayDateString = day.date instanceof Date ? day.date.toISOString().split('T')[0] : day.date;
    const events = generateCalendarEvents().filter(event => event.date === dayDateString);
    
    // Apply filter
    const filteredEvents = events.filter(event => {
      if (filterMode === 'all') return true;
      if (filterMode === 'leaves') return event.type === 'vacation' || event.type === 'sick';
      if (filterMode === 'work') return event.type === 'work';
      return true;
    });

    return (
      <div className="h-full flex flex-col p-1">
        {/* Day number */}
        <span className={cn(
          "text-sm font-medium mb-1",
          !day.isCurrentMonth && "text-gray-400",
          day.isToday && "text-blue-600 font-bold",
          day.isWeekend && day.isCurrentMonth && "text-gray-600"
        )}>
          {day.date instanceof Date ? day.date.getDate() : new Date(day.date).getDate()}
        </span>
        
        {/* Events */}
        <div className="flex-1 space-y-0.5">
          {filteredEvents.slice(0, 3).map((event, index) => (
            <div key={index} className={cn(
              "text-xs px-1 py-0.5 rounded text-white truncate",
              event.color
            )}>
              {event.title}
            </div>
          ))}
          
          {filteredEvents.length > 3 && (
            <div className="text-xs text-gray-500">
              +{filteredEvents.length - 3} mehr
            </div>
          )}
        </div>
        
        {/* Weekend indicator */}
        {day.isWeekend && day.isCurrentMonth && (
          <div className="text-xs text-gray-400 mt-auto">
            {(day.date instanceof Date ? day.date.getDay() : new Date(day.date).getDay()) === 6 ? 'SA' : 'SO'}
          </div>
        )}
      </div>
    );
  };

  /**
   * Handle day click
   */
  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
    setShowEventModal(true);
  };

  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const vacationStats = getVacationStats();

  if (!user) return null;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            {viewMode === 'personal' ? 'Mein Kalender' : 'Team Kalender'}
          </h1>
          
          <div className="flex items-center space-x-3">
            {/* Team Calendar Link for Admins */}
            {isAdmin && (
              <button
                onClick={() => navigate('/team-calendar')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                📊 Team-Kalender
              </button>
            )}
            
            {/* Quick Actions */}
            <button
              onClick={() => navigate('/request-leave')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + Urlaub
            </button>
            
            {/* Today Button */}
            <button
              onClick={goToToday}
              className="bg-white px-3 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm border"
            >
              Heute
            </button>
            
            {/* Month/Year Navigation */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => calendarView === 'month' ? navigateMonth('prev') : navigateYear('prev')}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg text-gray-600">‹</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-900 min-w-40 text-center">
                {calendarView === 'month' ? getMonthYearText() : currentDate.getFullYear()}
              </h2>
              <button 
                onClick={() => calendarView === 'month' ? navigateMonth('next') : navigateYear('next')}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg text-gray-600">›</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* View Mode Toggle */}
          <div className="lg:col-span-1">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('personal')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
                  viewMode === 'personal' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
                )}
              >
                👤 Persönlich
              </button>
              <button
                onClick={() => setViewMode('team')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
                  viewMode === 'team' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
                )}
              >
                👥 Team
              </button>
            </div>
          </div>

          {/* Calendar View Toggle */}
          <div className="lg:col-span-1">
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setCalendarView('month')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
                  calendarView === 'month' ? "bg-green-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
                )}
              >
                📅 Monat
              </button>
              <button
                onClick={() => setCalendarView('year')}
                className={cn(
                  "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
                  calendarView === 'year' ? "bg-green-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
                )}
              >
                📆 Jahr
              </button>
            </div>
          </div>

          {/* Vacation Stats (Personal View Only) */}
          {viewMode === 'personal' && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Urlaubsübersicht {new Date().getFullYear()}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{vacationStats.total}</p>
                    <p className="text-xs text-gray-500">Gesamt</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{vacationStats.used}</p>
                    <p className="text-xs text-gray-500">Genommen</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{vacationStats.remaining}</p>
                    <p className="text-xs text-gray-500">Verfügbar</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (vacationStats.used / vacationStats.total) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {((vacationStats.used / vacationStats.total) * 100).toFixed(0)}% verbraucht
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex bg-white rounded-lg p-1 mb-4 shadow-sm">
          <button
            onClick={() => setFilterMode('all')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
              filterMode === 'all' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            Alle
          </button>
          <button
            onClick={() => setFilterMode('leaves')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
              filterMode === 'leaves' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
            )}
          >
            Abwesenheit
          </button>
          {viewMode === 'personal' && (
            <button
              onClick={() => setFilterMode('work')}
              className={cn(
                "flex-1 py-2 px-3 rounded-md transition-colors text-sm",
                filterMode === 'work' ? "bg-blue-500 text-white" : "bg-transparent text-gray-700 hover:bg-gray-100"
              )}
            >
              Arbeitszeit
            </button>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="flex items-center justify-center py-3">
                <span className="text-sm font-semibold text-gray-500">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid - Month View */}
          {calendarView === 'month' && (
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  className={cn(
                    "aspect-square border-b border-r border-gray-100 text-left hover:bg-gray-50 transition-colors relative",
                    !day.isCurrentMonth && "bg-gray-50",
                    day.isToday && "bg-blue-50 border-blue-200",
                    day.isWeekend && "bg-gray-25"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {renderDayContent(day)}
                </button>
              ))}
            </div>
          )}

          {/* Year View */}
          {calendarView === 'year' && (
            <YearView 
              year={currentDate.getFullYear()} 
              yearData={generateYearData()} 
              allUsers={viewMode === 'team' ? allUsers : (user ? [user] : [])}
              viewMode={viewMode}
              getUserName={getUserName}
            />
          )}
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl p-4 mt-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Legende</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Urlaub</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Krankheit</span>
            </div>
            {viewMode === 'personal' && (
              <>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Vollzeit (≥8h)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Teilzeit (6-8h)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <span className="text-sm text-gray-600">Unterzeit (&lt;6h)</span>
                </div>
              </>
            )}
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
              <span className="text-sm text-gray-600">Erinnerung</span>
            </div>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {showEventModal && selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {(selectedDay.date instanceof Date ? selectedDay.date : new Date(selectedDay.date)).toLocaleDateString('de-DE', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {/* User's events */}
              {selectedDay.userLeaves?.map(leave => (
                <div key={leave.id} className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {leave.type === 'VACATION' ? '🏖️' : '🏥'}
                    </span>
                    <div>
                      <p className="font-medium">
                        {leave.type === 'VACATION' ? 'Urlaub' : 'Krankheit'}
                      </p>
                      {leave.comment && (
                        <p className="text-sm text-gray-600">{leave.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* User's time record */}
              {selectedDay.userTimeRecord && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">⏰</span>
                    <div>
                      <p className="font-medium">
                        {selectedDay.userTimeRecord.totalHours.toFixed(1)}h gearbeitet
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedDay.userTimeRecord.timeIn} - {selectedDay.userTimeRecord.timeOut || 'läuft'}
                        {selectedDay.userTimeRecord.breakMinutes > 0 && (
                          <span> (Pause: {selectedDay.userTimeRecord.breakMinutes}min)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Team events (if team view) */}
              {viewMode === 'team' && selectedDay.leaves?.map(leave => (
                <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {leave.type === 'VACATION' ? '🏖️' : '🏥'}
                    </span>
                    <div>
                      <p className="font-medium">
                        {getUserName(leave.userId)} - {leave.type === 'VACATION' ? 'Urlaub' : 'Krank'}
                      </p>
                      {leave.comment && (
                        <p className="text-sm text-gray-600">{leave.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* No events */}
              {(selectedDay.userLeaves?.length || 0) === 0 && 
               !selectedDay.userTimeRecord && 
               (selectedDay.leaves?.length || 0) === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Keine Ereignisse an diesem Tag
                </p>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  navigate('/request-leave');
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Urlaub beantragen
              </button>
              <button
                onClick={() => {
                  setShowEventModal(false);
                  navigate('/time');
                }}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Zeiten erfassen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};