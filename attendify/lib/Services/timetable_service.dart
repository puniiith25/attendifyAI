import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import '../Models/timetable_model.dart';

class TimetableService {
  final storage = const FlutterSecureStorage();
  final backendurl = "http://localhost:8000/api/v1/timetable/student-timetable";

  Future<List<Timetable>> getStudentTimetable() async {
    try {
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
        final List list = data["timetable"] ?? [];
        return list.map((item) {
          // Format start_time and end_time (from "09:00:00" to "09:00")
          String rawStart = item["start_time"] ?? "00:00:00";
          String rawEnd = item["end_time"] ?? "00:00:00";
          String startTime = rawStart.length >= 5 ? rawStart.substring(0, 5) : rawStart;
          String endTime = rawEnd.length >= 5 ? rawEnd.substring(0, 5) : rawEnd;

          return Timetable(
            dayOfWeek: item["day_of_week"] ?? 1,
            subject: item["subject"] ?? "Unknown",
            teacher: item["teacher"] ?? "Professor",
            room: item["classroom"] ?? "N/A",
            startTime: startTime,
            endTime: endTime,
            validFrom: DateTime.tryParse(item["valid_from"] ?? "") ?? DateTime.now(),
            validTo: DateTime.tryParse(item["valid_to"] ?? "") ?? DateTime.now(),
          );
        }).toList();
      }
      throw Exception(data["message"] ?? "Failed to load timetable");
    } catch (e) {
      print("Timetable load error: $e");
      rethrow;
    }
  }
}
