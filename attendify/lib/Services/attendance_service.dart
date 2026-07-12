import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class SubjectAttendance {
  final int subjectId;
  final String subjectName;
  final String subjectCode;
  final int totalSessions;
  final int presentSessions;

  SubjectAttendance({
    required this.subjectId,
    required this.subjectName,
    required this.subjectCode,
    required this.totalSessions,
    required this.presentSessions,
  });

  factory SubjectAttendance.fromJson(Map<String, dynamic> json) {
    return SubjectAttendance(
      subjectId: json['subject_id'],
      subjectName: json['subject_name'] ?? 'Unknown Subject',
      subjectCode: json['subject_code'] ?? '',
      totalSessions: json['total_sessions'] ?? 0,
      presentSessions: json['present_sessions'] ?? 0,
    );
  }

  double get percentage {
    if (totalSessions == 0) return 0.0;
    return (presentSessions / totalSessions) * 100;
  }
}

class AttendanceService {
  final storage = const FlutterSecureStorage();
  final backendurl = "http://localhost:8000/api/v1/students/my-attendance-stats";

  Future<List<SubjectAttendance>> getAttendanceStats() async {
    final token = await storage.read(key: "token");

    final res = await http.get(
      Uri.parse(backendurl),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
    );
    final data = jsonDecode(res.body);
    if (res.statusCode == 200) {
      final List list = data["stats"] ?? [];
      return list.map((item) => SubjectAttendance.fromJson(item)).toList();
    }
    throw Exception(data["message"] ?? "Failed to load attendance statistics");
  }
}
