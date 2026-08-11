import 'package:attendify/Services/attendance_service.dart';
import 'package:flutter/material.dart';
import 'package:attendify/data/notifiiers.dart';

class AttendanceHistoryPage extends StatefulWidget {
  const AttendanceHistoryPage({super.key});

  @override
  State<AttendanceHistoryPage> createState() => _AttendanceHistoryPageState();
}

class _AttendanceHistoryPageState extends State<AttendanceHistoryPage> {
  late Future<List<SubjectAttendance>> statsFuture;

  @override
  void initState() {
    super.initState();
    selectedPageNotifier.addListener(_onTabActive);
    statsFuture = AttendanceService().getAttendanceStats();
  }

  @override
  void dispose() {
    selectedPageNotifier.removeListener(_onTabActive);
    super.dispose();
  }

  void _onTabActive() {
    if (selectedPageNotifier.value == 1) {
      if (mounted) {
        setState(() {
          statsFuture = AttendanceService().getAttendanceStats();
        });
      }
    }
  }

  Color _getProgressColor(double percentage) {
    if (percentage >= 75) return const Color(0xFF10B981);
    if (percentage >= 50) return Colors.amber;
    return const Color(0xFFF43F5E);
  }

  @override
  Widget build(BuildContext context) {
    const primaryBlue = Color(0xFF172554);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: const Text(
          "Attendance Statistics",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: primaryBlue,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: false,
      ),
      body: FutureBuilder<List<SubjectAttendance>>(
        future: statsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 60,
                      color: Color(0xFFF43F5E),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      snapshot.error.toString(),
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ],
                ),
              ),
            );
          }

          final stats = snapshot.data ?? [];

          if (stats.isEmpty) {
            return const Center(
              child: Text(
                "No class attendance records found.",
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16.0),
            itemCount: stats.length,
            itemBuilder: (context, index) {
              final item = stats[index];
              final double percent = item.percentage;
              final Color progressColor = _getProgressColor(percent);

              return Card(
                elevation: 1,
                margin: const EdgeInsets.only(bottom: 16.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16.0),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  item.subjectName,
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: primaryBlue,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  item.subjectCode.isNotEmpty
                                      ? item.subjectCode
                                      : "No Code",
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Colors.grey,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: progressColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              "${percent.toStringAsFixed(0)}%",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: progressColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "Classes Attended",
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Text(
                            "${item.presentSessions} / ${item.totalSessions}",
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(6),
                        child: LinearProgressIndicator(
                          value: item.totalSessions > 0
                              ? (item.presentSessions / item.totalSessions)
                              : 0.0,
                          backgroundColor: Colors.grey[200],
                          valueColor: AlwaysStoppedAnimation<Color>(
                            progressColor,
                          ),
                          minHeight: 8,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
