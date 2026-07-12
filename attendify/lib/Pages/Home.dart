import 'package:attendify/widgets/HomePage_widgets/class_card.dart';
import 'package:attendify/widgets/HomePage_widgets/quick_actions.dart';
import 'package:attendify/widgets/color_codes.dart';
import 'package:flutter/material.dart';

import 'package:attendify/widgets/HomePage_widgets/attendance_card.dart';
import 'package:attendify/widgets/HomePage_widgets/header.dart';
import 'package:attendify/Services/timetable_service.dart';
import 'package:attendify/Services/attendance_service.dart';
import 'package:attendify/Services/profile_Services.dart';
import 'package:attendify/Models/timetable_model.dart';
import 'package:attendify/Models/user_model.dart';
import 'package:attendify/data/notifiiers.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  late Future<Map<String, dynamic>> homeDataFuture;

  @override
  void initState() {
    super.initState();
    _loadHomeData();
  }

  void _loadHomeData() {
    homeDataFuture = Future.wait([
      TimetableService().getStudentTimetable(),
      AttendanceService().getAttendanceStats(),
      ProfileServices().getProfile(),
    ]).then((results) {
      final timetable = results[0] as List<Timetable>;
      final stats = results[1] as List<SubjectAttendance>;
      final student = results[2] as UserModel;

      // Get current weekday (0=Sunday, 1=Monday, ..., 6=Saturday)
      final int todayDay = DateTime.now().weekday % 7;
      final todayClasses = timetable.where((t) => t.dayOfWeek == todayDay).toList();

      // Calculate overall attendance
      int totalConducted = 0;
      int totalPresent = 0;
      for (var s in stats) {
        totalConducted += s.totalSessions;
        totalPresent += s.presentSessions;
      }
      
      double overallPercent = 0.0;
      if (totalConducted > 0) {
        overallPercent = (totalPresent / totalConducted);
      }

      return {
        "todayClasses": todayClasses,
        "overallPercent": overallPercent,
        "student": student,
      };
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade200,
      body: FutureBuilder<Map<String, dynamic>>(
        future: homeDataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Text(
                  "Error loading dashboard: ${snapshot.error}",
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.grey),
                ),
              ),
            );
          }

          final data = snapshot.data!;
          final List<Timetable> todayClasses = data["todayClasses"];
          final double overallPercent = data["overallPercent"];
          final UserModel student = data["student"];

          return RefreshIndicator(
            onRefresh: () async {
              setState(() {
                _loadHomeData();
              });
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                children: [
                  PreferredSize(
                    preferredSize: const Size.fromHeight(180),
                    child: HeaderSection(student: student),
                  ),

                  const SizedBox(height: 60),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      QuickButton(
                        icon: Icons.bar_chart,
                        label: 'Attendance',
                        color: AppColors.primary,
                        onTap: () {
                          selectedPageNotifier.value = 1; // Switch to Attendance tab
                        },
                      ),
                      QuickButton(
                        icon: Icons.calendar_month,
                        label: 'TimeTable',
                        color: AppColors.primary,
                        onTap: () {
                          selectedPageNotifier.value = 2; // Switch to Timetable tab
                        },
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  const Padding(
                    padding: EdgeInsets.only(left: 25),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Attendance',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  AttendanceCard(
                    value: overallPercent,
                    percentageText: "${(overallPercent * 100).toStringAsFixed(0)}%",
                  ),

                  const SizedBox(height: 20),
                  const Padding(
                    padding: EdgeInsets.only(left: 25),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Today's Classes",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),

                  /* CLASS LIST */
                  todayClasses.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.symmetric(vertical: 30),
                          child: Text(
                            "No classes scheduled for today",
                            style: TextStyle(color: Colors.grey, fontWeight: FontWeight.w500),
                          ),
                        )
                      : Column(
                          children: todayClasses.map((classData) {
                            return ClassCard(
                              subject: classData.subject,
                              time: "${classData.startTime} - ${classData.endTime}",
                              teacher: classData.teacher,
                              room: classData.room,
                              status: "Scheduled",
                            );
                          }).toList(),
                        ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
