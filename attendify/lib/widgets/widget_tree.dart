import 'package:attendify/Pages/Home.dart';
import 'package:attendify/Pages/Profile.dart';
import 'package:attendify/Pages/TimeTable.dart';
import 'package:attendify/Pages/AttendanceHistory.dart';
import 'package:attendify/data/notifiiers.dart';
import 'package:attendify/widgets/NavBar.dart';
import 'package:flutter/material.dart';

List<Widget> pages = [
  Home(),
  const AttendanceHistoryPage(),
  const TimetablePage(),
  Profile(),
];

class widgetTree extends StatelessWidget {
  const widgetTree({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ValueListenableBuilder(
        valueListenable: selectedPageNotifier,
        builder: (context, value, child) {
          return pages.elementAt(value);
        },
      ),
      bottomNavigationBar: NavbarWidget(),
    );
  }
}
