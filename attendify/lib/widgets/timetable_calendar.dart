import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../Models/timetable_model.dart';

class TimetableCalendar extends StatefulWidget {
  final List<Timetable> timetable;

  const TimetableCalendar({super.key, required this.timetable});

  @override
  State<TimetableCalendar> createState() => _TimetableCalendarState();
}

class _TimetableCalendarState extends State<TimetableCalendar> {
  DateTime focusedDay = DateTime.now();
  DateTime? selectedDay;

  List<Timetable> _getEventsForDay(DateTime day) {
    return widget.timetable.where((t) {
      bool correctDay = t.dayOfWeek == (day.weekday % 7);

      bool validDate =
          day.isAfter(t.validFrom.subtract(const Duration(days: 1))) &&
          day.isBefore(t.validTo.add(const Duration(days: 1)));

      return correctDay && validDate;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TableCalendar(
          firstDay: DateTime(2020),
          lastDay: DateTime(2035),
          focusedDay: focusedDay,

          calendarFormat: CalendarFormat.week,

          selectedDayPredicate: (day) => isSameDay(selectedDay, day),

          onDaySelected: (selected, focused) {
            setState(() {
              selectedDay = selected;
              focusedDay = focused;
            });
          },

          eventLoader: _getEventsForDay,
        ),

        const SizedBox(height: 10),

        Expanded(
          child: ListView(
            children: _getEventsForDay(selectedDay ?? focusedDay).map((t) {
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),

                child: ListTile(
                  title: Text(t.subject),

                  subtitle: Text(
                    "${t.teacher} • Room ${t.room}\n"
                    "${t.startTime} - ${t.endTime}",
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}
