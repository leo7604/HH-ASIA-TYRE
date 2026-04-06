import { useState, useEffect } from 'react';

function CalendarView({ appointments, onSelectAppointment }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = formatDateToString(date);
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Format date to YYYY-MM-DD
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0-6, Sunday-Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Check if date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-brand-raised/30"></div>);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateAppointments = getAppointmentsForDate(date);
      const hasAppointments = dateAppointments.length > 0;
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-32 border border-brand-border p-2 cursor-pointer transition-all hover:bg-brand-raised/50 ${
            isSelected(date) ? 'bg-brand-yellow/10 border-brand-yellow' : 'bg-brand-card'
          } ${!isCurrentMonth(date) ? 'opacity-30' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${
              isToday(date) ? 'bg-brand-yellow text-brand-black w-7 h-7 rounded-full flex items-center justify-center' : 'text-white'
            }`}>
              {day}
            </span>
            {hasAppointments && (
              <span className="text-xs bg-brand-yellow/20 text-brand-yellow px-2 py-0.5 rounded-full">
                {dateAppointments.length}
              </span>
            )}
          </div>
          
          {/* Show appointment previews */}
          <div className="space-y-1 overflow-hidden">
            {dateAppointments.slice(0, 3).map((apt, idx) => (
              <div
                key={idx}
                className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                  apt.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  apt.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}
                title={`${apt.customerName} - ${apt.time}`}
              >
                {apt.time} {apt.customerName}
              </div>
            ))}
            {dateAppointments.length > 3 && (
              <div className="text-[10px] text-brand-textDim pl-1">
                +{dateAppointments.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Get selected date appointments
  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
      {/* Calendar Header */}
      <div className="p-6 border-b border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-brand-raised rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-brand-raised rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-brand-yellow text-brand-black rounded-md font-semibold hover:bg-yellow-400 transition-colors"
          >
            Today
          </button>
        </div>
        
        {/* Day names */}
        <div className="grid grid-cols-7 gap-px">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-brand-textMuted py-2">
              {day}
            </div>
          ))}
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-brand-border">
        {generateCalendarDays()}
      </div>
      
      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t border-brand-border p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Appointments for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8 text-brand-textMuted">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No appointments scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => onSelectAppointment && onSelectAppointment(apt)}
                  className="flex items-center justify-between p-4 bg-brand-raised rounded-lg hover:bg-brand-raised/80 transition-colors cursor-pointer border border-brand-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-lg font-bold text-brand-yellow">{apt.time}</div>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{apt.customerName}</p>
                      <p className="text-sm text-brand-textMuted">
                        {apt.vehicleYear} {apt.vehicleMake} {apt.vehicleModel}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {apt.services?.slice(0, 2).map((service, idx) => (
                          <span key={idx} className="text-xs bg-brand-yellow/10 text-brand-yellow px-2 py-0.5 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      apt.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                    <svg className="w-5 h-5 text-brand-textMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CalendarView;
