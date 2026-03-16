import 'package:attendify/widgets/HomePage_widgets/class_card.dart';
import 'package:attendify/widgets/HomePage_widgets/quick_actions.dart';
import 'package:attendify/widgets/color_codes.dart';
import 'package:flutter/material.dart';

import 'package:attendify/widgets/HomePage_widgets/attendance_card.dart';
import 'package:attendify/widgets/HomePage_widgets/header.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  final List<Map<String, String>> classes = [
    {
      "subject": "Data Structures",
      "time": "9:00 AM - 10:00 AM",
      "teacher": "Dr. Priya Sharma",
      "room": "CS-301",
      "status": "Completed",
    },
    {
      "subject": "Operating Systems",
      "time": "10:00 AM - 11:00 AM",
      "teacher": "Prof. Rajesh Kumar",
      "room": "CS-302",
      "status": "Ongoing",
    },
    {
      "subject": "Database Systems",
      "time": "11:30 AM - 12:30 PM",
      "teacher": "Dr. Anitha R.",
      "room": "CS-303",
      "status": "Upcoming",
    },
    {
      "subject": "Computer Networks",
      "time": "2:00 PM - 3:00 PM",
      "teacher": "Prof. Suresh M.",
      "room": "CS-Lab1",
      "status": "Upcoming",
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade200,

      body: SingleChildScrollView(
        child: Column(
          children: [
            const HeaderSection(),

            const SizedBox(height: 60),

            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                QuickButton(
                  icon: Icons.qr_code_scanner,
                  label: 'QR SCAN',
                  color: AppColors.primary,
                ),
                QuickButton(
                  icon: Icons.bar_chart,
                  label: 'Attendance',
                  color: AppColors.primary,
                ),
                QuickButton(
                  icon: Icons.calendar_month,
                  label: 'TimeTable',
                  color: AppColors.primary,
                ),
              ],
            ),

            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(left: 25),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Attendance',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ),
            const SizedBox(height: 6),
            const AttendanceCard(),

            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.only(left: 25),
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
            Column(
              children: classes.map((classData) {
                return ClassCard(
                  subject: classData["subject"]!,
                  time: classData["time"]!,
                  teacher: classData["teacher"]!,
                  room: classData["room"]!,
                  status: classData["status"]!,
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}
