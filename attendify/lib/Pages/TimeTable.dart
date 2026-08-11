import 'package:attendify/widgets/color_codes.dart';
import 'package:flutter/material.dart';
import 'package:attendify/data/notifiiers.dart';

import '../widgets/timetable_calendar.dart';
import '../Services/timetable_service.dart';
import '../Models/timetable_model.dart';

class TimetablePage extends StatefulWidget {
  const TimetablePage({super.key});

  @override
  State<TimetablePage> createState() => _TimetablePageState();
}

class _TimetablePageState extends State<TimetablePage> {
  late Future<List<Timetable>> timetableFuture;

  @override
  void initState() {
    super.initState();
    selectedPageNotifier.addListener(_onTabActive);
    timetableFuture = TimetableService().getStudentTimetable();
  }

  @override
  void dispose() {
    selectedPageNotifier.removeListener(_onTabActive);
    super.dispose();
  }

  void _onTabActive() {
    if (selectedPageNotifier.value == 2) {
      if (mounted) {
        setState(() {
          timetableFuture = TimetableService().getStudentTimetable();
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        title: const Text(
          "Timetable",
          style: TextStyle(color: AppColors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppColors.primary,
        automaticallyImplyLeading: false,
      ),
      body: FutureBuilder<List<Timetable>>(
        future: timetableFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final timetable = snapshot.data ?? [];
          return Padding(
            padding: const EdgeInsets.all(12),
            child: TimetableCalendar(timetable: timetable),
          );
        },
      ),
    );
  }
}
