import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { useRemindersStore } from '../state/reminders';
import { CalendarDay, CalendarEvent, CalendarViewMode, VacationStats } from '../types/calendar';

export const useCalendarData = (viewMode: CalendarViewMode, currentDate: Date) => {
  const { user, getAllUsers } = useAuthStore();
  const { getAllLeaveRequests } = useLeavesStore();
  const { getTimeRecordsForPeriod } = useTimeRecordsStore();
  const { reminders } = useRemindersStore();
  
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  
  const allUsers = useMemo(() => getAllUsers(), [getAllUsers]);
  const allLeaves = getAllLeaveRequests();

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

  const generateCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
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
            userId: leave.userId,
            userName: getUserName(leave.userId),
            date: date.toISOString().split('T')[0],
            type: leave.type === 'VACATION' ? 'urlaub' : 'krank',
            status: 'genehmigt'
          });
        }
      });

    // Add time records for personal view
    if (viewMode === 'personal' && user) {
      const timeRecords = getTimeRecordsForPeriod(user.id, startDateStr, endDateStr);
      timeRecords.forEach(record => {
        if (record.timeOut) {
          events.push({
            userId: user.id,
            userName: getUserName(user.id),
            date: record.date,
            type: 'zeit',
            stunden: record.totalHours
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
          userId: reminder.userId,
          userName: getUserName(reminder.userId),
          date: reminder.reminderDate,
          type: 'meeting', // Using 'meeting' as closest equivalent
          title: reminder.message
        });
      });

    return events;
  };

  const getVacationStats = (): VacationStats => {
    if (!user) return { totalDays: 0, usedDays: 0, remainingDays: 0, pendingDays: 0 };
    
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
      totalDays: totalDays,
      usedDays: usedDays,
      remainingDays: Math.max(0, totalDays - usedDays),
      pendingDays: 0 // TODO: Calculate pending days from requests with status 'PENDING'
    };
  };

  const generateYearData = (): { [userId: string]: { [week: string]: any[] } } => {
    const year = currentDate.getFullYear();
    const yearData: { [userId: string]: { [week: string]: any[] } } = {};
    
    const usersToShow = viewMode === 'team' ? allUsers : (user ? [user] : []);
    
    usersToShow.forEach(u => {
      yearData[u.id] = {};
    });

    const yearLeaves = allLeaves.filter(leave => {
      const leaveYear = new Date(leave.startDate).getFullYear();
      return leaveYear === year && leave.status === 'APPROVED';
    });

    for (let week = 1; week <= 53; week++) {
      const weekStart = getDateOfWeek(week, year);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      usersToShow.forEach(u => {
        yearData[u.id][week] = yearLeaves.filter(leave => {
          if (leave.userId !== u.id) return false;
          
          const leaveStart = new Date(leave.startDate);
          const leaveEnd = new Date(leave.endDate);
          
          return leaveStart <= weekEnd && leaveEnd >= weekStart;
        });
      });
    }

    return yearData;
  };

  const getDateOfWeek = (week: number, year: number) => {
    const jan1 = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const weekStart = new Date(jan1.getTime() + days * 24 * 60 * 60 * 1000);
    
    const dayOfWeek = weekStart.getDay();
    const diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    weekStart.setDate(weekStart.getDate() + diff);
    
    return weekStart;
  };

  useEffect(() => {
    const generateCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      const dayOfWeek = firstDay.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate.setDate(firstDay.getDate() - daysToSubtract);
      
      const startDateStr = new Date(year, month, 1).toISOString().split('T')[0];
      const endDateStr = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const userTimeRecords = user && viewMode === 'personal' ? 
        getTimeRecordsForPeriod(user.id, startDateStr, endDateStr) : [];
      
      const teamTimeRecords = viewMode === 'team' ? 
        allUsers.flatMap(u => getTimeRecordsForPeriod(u.id, startDateStr, endDateStr)) : [];
      
      const days: CalendarDay[] = [];
      const today = new Date();
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = date.getMonth() === month;
        const isToday = date.toDateString() === today.toDateString();
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        const dateString = date.toISOString().split('T')[0];
        const dayLeaves = allLeaves.filter(leave => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const currentDate = new Date(dateString);
          
          return currentDate >= startDate && currentDate <= endDate && 
                 leave.status === 'APPROVED' &&
                 (viewMode === 'team' || leave.userId === user?.id);
        });

        const userLeaves = allLeaves.filter(leave => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const currentDate = new Date(dateString);
          
          return currentDate >= startDate && currentDate <= endDate && 
                 leave.userId === user?.id && leave.status === 'APPROVED';
        });
        
        const dayTimeRecords = teamTimeRecords.filter(record => record.date === dateString);
        const userTimeRecord = userTimeRecords.find(record => record.date === dateString) || null;
        
        const dayReminders = reminders.filter(reminder => 
          reminder.reminderDate === dateString && reminder.isActive &&
          (viewMode === 'team' || reminder.userId === user?.id)
        );
        
        days.push({
          date,
          entries: [], // CalendarEntry[] - populate if needed
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
  }, [currentDate, allLeaves, reminders, viewMode, user, allUsers, getTimeRecordsForPeriod]);

  return {
    calendarDays,
    allUsers,
    generateCalendarEvents,
    getVacationStats,
    generateYearData,
    getUserName
  };
};