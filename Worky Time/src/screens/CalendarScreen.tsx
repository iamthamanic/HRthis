import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { useRemindersStore } from '../state/reminders';
import { LeaveRequest, TimeRecord } from '../types';
import { VacationReminder } from '../types/reminders';
import { cn } from '../utils/cn';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  leaves: LeaveRequest[];
  timeRecords: TimeRecord[];
  reminders: VacationReminder[];
}

export const CalendarScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { leaveRequests } = useLeavesStore();
  const { timeRecords } = useTimeRecordsStore();
  const { reminders, getUpcomingVacationAlerts } = useRemindersStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [viewMode, setViewMode] = useState<'leaves' | 'hours' | 'both'>('both');

  // Mock data for team members (in real app, this would come from API)
  const mockTeamLeaves: LeaveRequest[] = [
    ...leaveRequests,
    {
      id: '10',
      userId: '2',
      startDate: '2024-12-16',
      endDate: '2024-12-20',
      comment: 'Winterurlaub',
      status: 'APPROVED',
      type: 'VACATION',
      createdAt: '2024-11-01T10:00:00Z'
    },
    {
      id: '11',
      userId: '3',
      startDate: '2024-12-18',
      endDate: '2024-12-19',
      comment: '',
      status: 'APPROVED',
      type: 'SICK',
      createdAt: '2024-12-18T08:00:00Z'
    },
    {
      id: '12',
      userId: '4',
      startDate: '2024-12-09',
      endDate: '2024-12-13',
      comment: 'Familienurlaub',
      status: 'APPROVED',
      type: 'VACATION',
      createdAt: '2024-11-15T10:00:00Z'
    },
    {
      id: '13',
      userId: '5',
      startDate: '2024-12-02',
      endDate: '2024-12-02',
      comment: 'Erkältung',
      status: 'APPROVED',
      type: 'SICK',
      createdAt: '2024-12-02T07:30:00Z'
    },
    {
      id: '14',
      userId: '6',
      startDate: '2025-01-07',
      endDate: '2025-01-17',
      comment: 'Neujahrsurlaub',
      status: 'APPROVED',
      type: 'VACATION',
      createdAt: '2024-11-20T14:00:00Z'
    },
    {
      id: '15',
      userId: '3',
      startDate: '2024-12-27',
      endDate: '2024-12-31',
      comment: 'Jahresende',
      status: 'APPROVED',
      type: 'VACATION',
      createdAt: '2024-11-25T09:15:00Z'
    }
  ];

  // Mock user names for display
  const getUserName = (userId: string) => {
    const names: { [key: string]: string } = {
      '1': 'Max M.',
      '2': 'Anna A.',
      '3': 'Tom K.',
      '4': 'Lisa S.',
      '5': 'Julia B.',
      '6': 'Marco L.'
    };
    return names[userId] || 'Unbekannt';
  };

  // Generate mock time records for team members
  const generateMockTeamTimeRecords = (): TimeRecord[] => {
    const records: TimeRecord[] = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Generate records for all team members
    const teamUserIds = ['1', '2', '3', '4', '5', '6'];
    
    for (let userId of teamUserIds) {
      for (let day = 1; day <= endOfMonth.getDate(); day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        // Skip if user is on leave
        const dateString = date.toISOString().split('T')[0];
        const isOnLeave = mockTeamLeaves.some(leave => {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          return date >= startDate && date <= endDate && leave.userId === userId && leave.status === 'APPROVED';
        });
        
        if (isOnLeave) continue;
        
        // Generate realistic working hours
        const variations = {
          '1': { baseStart: 8, baseEnd: 17 },   // Max - regular hours
          '2': { baseStart: 9, baseEnd: 18 },   // Anna - later start
          '3': { baseStart: 7, baseEnd: 16 },   // Tom - early bird
          '4': { baseStart: 8.5, baseEnd: 17.5 }, // Lisa - flexible
          '5': { baseStart: 9, baseEnd: 17 },   // Julia - standard
          '6': { baseStart: 8, baseEnd: 16 }    // Marco - early finish
        };
        
        const userPattern = variations[userId as keyof typeof variations] || variations['1'];
        
        const startHour = userPattern.baseStart + (Math.random() * 0.5 - 0.25); // ±15 min variation
        const endHour = userPattern.baseEnd + (Math.random() * 0.5 - 0.25);
        
        const timeIn = new Date(date);
        timeIn.setHours(Math.floor(startHour), Math.floor((startHour % 1) * 60));
        
        const timeOut = new Date(date);
        timeOut.setHours(Math.floor(endHour), Math.floor((endHour % 1) * 60));
        
        const breakMinutes = 30 + Math.floor(Math.random() * 30); // 30-60 min break
        const totalHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60) - (breakMinutes / 60);
        
        records.push({
          id: `${userId}-${dateString}`,
          userId,
          date: dateString,
          timeIn: timeIn.toTimeString().split(' ')[0].substring(0, 5),
          timeOut: timeOut.toTimeString().split(' ')[0].substring(0, 5),
          breakMinutes,
          totalHours: Math.round(totalHours * 100) / 100
        });
      }
    }
    
    return records;
  };

  useEffect(() => {
    generateCalendar();
  }, [currentDate, mockTeamLeaves, timeRecords]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Monday of the week containing the first day
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - daysToSubtract);
    
    // Generate mock team time records
    const teamTimeRecords = generateMockTeamTimeRecords();
    
    // Generate 42 days (6 weeks)
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      // Find leaves for this date
      const dateString = date.toISOString().split('T')[0];
      const dayLeaves = mockTeamLeaves.filter(leave => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        const currentDate = new Date(dateString);
        
        return currentDate >= startDate && currentDate <= endDate && leave.status === 'APPROVED';
      });
      
      // Find time records for this date
      const dayTimeRecords = teamTimeRecords.filter(record => record.date === dateString);
      
      // Find reminders for this date
      const dayReminders = reminders.filter(reminder => reminder.reminderDate === dateString && reminder.isActive);
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        leaves: dayLeaves,
        timeRecords: dayTimeRecords,
        reminders: dayReminders
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getMonthYearText = () => {
    return currentDate.toLocaleDateString('de-DE', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getAverageHours = (timeRecords: TimeRecord[]) => {
    if (timeRecords.length === 0) return 0;
    const totalHours = timeRecords.reduce((sum, record) => sum + record.totalHours, 0);
    return totalHours / timeRecords.length;
  };

  const getHoursColor = (avgHours: number) => {
    if (avgHours === 0) return 'text-gray-300';
    if (avgHours < 7) return 'text-red-500';
    if (avgHours > 9) return 'text-orange-500';
    return 'text-green-500';
  };

  const weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-gray-900">
            Team Kalender
          </Text>
          <View className="flex-row items-center space-x-4">
            {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
              <Pressable 
                onPress={() => navigation.navigate('VacationReminders' as never)}
                className="bg-orange-500 px-3 py-2 rounded-lg"
              >
                <View className="flex-row items-center">
                  <Text className="text-white text-sm font-medium mr-1">🔔</Text>
                  {user && getUpcomingVacationAlerts(user.id).length > 0 && (
                    <View className="bg-red-600 rounded-full w-4 h-4 items-center justify-center">
                      <Text className="text-white text-xs font-bold">
                        {getUpcomingVacationAlerts(user.id).length}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            )}
            <Pressable 
              onPress={() => navigateMonth('prev')}
              className="w-10 h-10 items-center justify-center bg-white rounded-lg shadow-sm"
            >
              <Text className="text-lg text-gray-600">‹</Text>
            </Pressable>
            <Text className="text-lg font-semibold text-gray-900 min-w-32 text-center">
              {getMonthYearText()}
            </Text>
            <Pressable 
              onPress={() => navigateMonth('next')}
              className="w-10 h-10 items-center justify-center bg-white rounded-lg shadow-sm"
            >
              <Text className="text-lg text-gray-600">›</Text>
            </Pressable>
          </View>
        </View>

        {/* View Mode Toggle */}
        <View className="flex-row bg-white rounded-lg p-1 mb-4 shadow-sm">
          <Pressable
            onPress={() => setViewMode('leaves')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md",
              viewMode === 'leaves' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium text-xs",
              viewMode === 'leaves' ? "text-white" : "text-gray-700"
            )}>
              Abwesenheit
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('hours')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md",
              viewMode === 'hours' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium text-xs",
              viewMode === 'hours' ? "text-white" : "text-gray-700"
            )}>
              Stunden
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('both')}
            className={cn(
              "flex-1 py-2 px-3 rounded-md",
              viewMode === 'both' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium text-xs",
              viewMode === 'both' ? "text-white" : "text-gray-700"
            )}>
              Beide
            </Text>
          </Pressable>
        </View>

        {/* Legend */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-sm font-semibold text-gray-900 mb-2">Legende</Text>
          <View className="flex-row flex-wrap gap-4">
            {(viewMode === 'leaves' || viewMode === 'both') && (
              <>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-600">Urlaub</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <Text className="text-sm text-gray-600">Krankheit</Text>
                </View>
              </>
            )}
            {(viewMode === 'hours' || viewMode === 'both') && (
              <>
                <View className="flex-row items-center">
                  <Text className="text-sm text-green-500 font-bold mr-1">8.0h</Text>
                  <Text className="text-sm text-gray-600">Normal</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm text-red-500 font-bold mr-1">6.5h</Text>
                  <Text className="text-sm text-gray-600">Wenig</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm text-orange-500 font-bold mr-1">9.5h</Text>
                  <Text className="text-sm text-gray-600">Viel</Text>
                </View>
              </>
            )}
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
              <Text className="text-sm text-gray-600">Erinnerung</Text>
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          {/* Weekday headers */}
          <View className="flex-row mb-2">
            {weekdays.map((day) => (
              <View key={day} className="flex-1 items-center py-2">
                <Text className="text-sm font-semibold text-gray-500">{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="flex-row flex-wrap">
            {calendarDays.map((day, index) => (
              <Pressable
                key={index}
                className={cn(
                  "w-[14.28%] aspect-square border-b border-r border-gray-100 p-1",
                  !day.isCurrentMonth && "bg-gray-50"
                )}
                onPress={() => {
                  if (day.leaves.length > 0) {
                    // Could show detailed view of leaves for this day
                  }
                }}
              >
                <View className="flex-1">
                  <Text className={cn(
                    "text-sm font-medium mb-1",
                    !day.isCurrentMonth && "text-gray-400",
                    day.isToday && "text-blue-600 font-bold"
                  )}>
                    {day.date.getDate()}
                  </Text>
                  
                  {/* Content based on view mode */}
                  <View className="flex-1 justify-start">
                    {/* Leave indicators */}
                    {(viewMode === 'leaves' || viewMode === 'both') && day.leaves.length > 0 && (
                      <View className="mb-1">
                        {day.leaves.slice(0, viewMode === 'both' ? 1 : 2).map((leave, leaveIndex) => (
                          <View key={leaveIndex} className="mb-0.5">
                            <View className={cn(
                              "px-1 py-0.5 rounded-sm",
                              leave.type === 'VACATION' ? "bg-blue-100" : "bg-red-100"
                            )}>
                              <Text className={cn(
                                "text-xs font-medium",
                                leave.type === 'VACATION' ? "text-blue-700" : "text-red-700"
                              )}>
                                {getUserName(leave.userId)}
                              </Text>
                            </View>
                          </View>
                        ))}
                        {day.leaves.length > (viewMode === 'both' ? 1 : 2) && (
                          <Text className="text-xs text-gray-500">
                            +{day.leaves.length - (viewMode === 'both' ? 1 : 2)}
                          </Text>
                        )}
                      </View>
                    )}
                    
                    {/* Hours indicators */}
                    {(viewMode === 'hours' || viewMode === 'both') && day.timeRecords.length > 0 && (
                      <View className="space-y-0.5">
                        {viewMode === 'hours' ? (
                          // Show individual hours in hours-only mode
                          day.timeRecords.slice(0, 3).map((record, recordIndex) => (
                            <View key={recordIndex} className="flex-row items-center">
                              <Text className={cn(
                                "text-xs font-bold mr-1",
                                getHoursColor(record.totalHours)
                              )}>
                                {record.totalHours.toFixed(1)}h
                              </Text>
                              <Text className="text-xs text-gray-500 flex-1">
                                {getUserName(record.userId)}
                              </Text>
                            </View>
                          ))
                        ) : (
                          // Show average in combined mode
                          <View className="flex-row items-center">
                            <Text className={cn(
                              "text-xs font-bold mr-1",
                              getHoursColor(getAverageHours(day.timeRecords))
                            )}>
                              ⌀{getAverageHours(day.timeRecords).toFixed(1)}h
                            </Text>
                            <Text className="text-xs text-gray-500">
                              ({day.timeRecords.length} MA)
                            </Text>
                          </View>
                        )}
                        {viewMode === 'hours' && day.timeRecords.length > 3 && (
                          <Text className="text-xs text-gray-500">
                            +{day.timeRecords.length - 3}
                          </Text>
                        )}
                      </View>
                    )}
                    
                    {/* Reminder indicators */}
                    {day.reminders.length > 0 && (
                      <View className="absolute top-1 right-1">
                        <View className="w-2 h-2 bg-orange-500 rounded-full" />
                      </View>
                    )}
                    
                    {/* No data indicator */}
                    {day.isCurrentMonth && day.timeRecords.length === 0 && day.leaves.length === 0 && 
                     (day.date.getDay() !== 0 && day.date.getDay() !== 6) && (
                      <Text className="text-xs text-gray-300">-</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Current Month Summary */}
        <View className="bg-white rounded-xl p-4 mt-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Übersicht {getMonthYearText()}
          </Text>
          
          {/* Leaves Summary */}
          {(viewMode === 'leaves' || viewMode === 'both') && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Abwesenheiten</Text>
              {mockTeamLeaves
                .filter(leave => {
                  const leaveStart = new Date(leave.startDate);
                  return leaveStart.getMonth() === currentDate.getMonth() && 
                         leaveStart.getFullYear() === currentDate.getFullYear() &&
                         leave.status === 'APPROVED';
                })
                .map((leave) => (
                  <View key={leave.id} className="flex-row items-center justify-between py-2 border-b border-gray-100">
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-3">
                        {leave.type === 'VACATION' ? '🏖️' : '🏥'}
                      </Text>
                      <View>
                        <Text className="font-medium text-gray-900">
                          {getUserName(leave.userId)}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {new Date(leave.startDate).toLocaleDateString('de-DE')} - {new Date(leave.endDate).toLocaleDateString('de-DE')}
                        </Text>
                      </View>
                    </View>
                    <View className={cn(
                      "px-2 py-1 rounded-full",
                      leave.type === 'VACATION' ? "bg-blue-100" : "bg-red-100"
                    )}>
                      <Text className={cn(
                        "text-xs font-medium",
                        leave.type === 'VACATION' ? "text-blue-700" : "text-red-700"
                      )}>
                        {leave.type === 'VACATION' ? 'Urlaub' : 'Krank'}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )}
          
          {/* Hours Summary */}
          {(viewMode === 'hours' || viewMode === 'both') && (
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Arbeitszeiten-Statistik</Text>
              {(() => {
                const monthRecords = calendarDays.flatMap(day => day.timeRecords);
                const userStats = ['1', '2', '3', '4', '5', '6'].map(userId => {
                  const userRecords = monthRecords.filter(r => r.userId === userId);
                  const totalHours = userRecords.reduce((sum, r) => sum + r.totalHours, 0);
                  const avgHours = userRecords.length > 0 ? totalHours / userRecords.length : 0;
                  const workDays = userRecords.length;
                  
                  return {
                    userId,
                    totalHours,
                    avgHours,
                    workDays,
                    name: getUserName(userId)
                  };
                }).filter(stat => stat.workDays > 0);
                
                return userStats.map((stat) => (
                  <View key={stat.userId} className="flex-row items-center justify-between py-2 border-b border-gray-100">
                    <View className="flex-row items-center">
                      <Text className="text-2xl mr-3">⏰</Text>
                      <View>
                        <Text className="font-medium text-gray-900">
                          {stat.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {stat.workDays} Arbeitstage
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className={cn(
                        "font-bold text-sm",
                        getHoursColor(stat.avgHours)
                      )}>
                        ⌀ {stat.avgHours.toFixed(1)}h
                      </Text>
                      <Text className="text-xs text-gray-500">
                        {stat.totalHours.toFixed(1)}h gesamt
                      </Text>
                    </View>
                  </View>
                ));
              })()}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};