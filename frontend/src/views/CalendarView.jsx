import React, { useEffect, useState } from 'react';

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import huLocale from '@fullcalendar/core/locales/hu';

import { useQuery } from '@tanstack/react-query';
import { Box, Dialog, DialogContent, DialogTitle, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getVisits } from '../fetch/fetchVisits';

const CalendarView = () => {
  const theme = useTheme();
  const mdAndUp = useMediaQuery(theme.breakpoints.up('md'));
  const [events, setEvents] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState();
  const [selectedEvent, setSelectedEvent] = useState();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  const { data } = useQuery(['visits'], () => getVisits());

  const header = {
    left: '',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
    ...(mdAndUp && { left: 'prev,next,today' }),
  };
  const footer = {
    ...(!mdAndUp && {
      right: 'prev,next',
      left: 'today',
    }),
  };
  useEffect(() => {
    if (!data) return;
    setEvents(
      data.map((visit) => ({
        id: visit.id,
        title: 'Workout',
        startStr: visit.check_in_time,
        endStr: visit.check_out_time,
        start: new Date(visit.check_in_time),
        end: new Date(visit.check_out_time),
        editable: true,
      })),
    );
  }, [data]);
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={({ event }) => {
          setSelectedEvent(event);
          console.log(event);
          setSelectedVisit(data.find((v) => (v.id = event.id)));
          setEventDialogOpen(true);
        }}
        headerToolbar={header}
        footerToolbar={footer}
        locale={huLocale}
        height="450px"
      />
      <Dialog
        open={eventDialogOpen}
        onClose={() => setEventDialogOpen(false)}
        TransitionProps={{
          onExited: () => setSelectedVisit(),
        }}
      >
        <DialogTitle>Workout</DialogTitle>
        <DialogContent>
          <Typography>{selectedEvent?.start.toLocaleString()}</Typography>
          <Typography>{selectedEvent?.end?.toLocaleString()}</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CalendarView;
