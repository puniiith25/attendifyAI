import 'package:flutter/material.dart';

import '../widgets/timetable_calendar.dart';
import '../Services/timetable_service.dart';

class Timetable extends StatelessWidget {
  const Timetable({super.key});

  @override
  Widget build(BuildContext context) {
    final timetable = TimetableService.getStudentTimetable();

    return Scaffold(
      appBar: AppBar(title: const Text("My Timetable")),

      body: Padding(
        padding: const EdgeInsets.all(12),

        child: TimetableCalendar(timetable: timetable),
      ),
    );
  }
}
