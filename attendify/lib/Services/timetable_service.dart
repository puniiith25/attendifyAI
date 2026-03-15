import '../Models/timetable_model.dart';

class TimetableService {
  static List<Timetable> getStudentTimetable() {
    return [
      /* MONDAY */
      Timetable(
        dayOfWeek: 1,
        subject: "Data Structures",
        teacher: "Dr Priya Sharma",
        room: "CS301",
        startTime: "09:00",
        endTime: "10:00",
        validFrom: DateTime(2026, 1, 1),
        validTo: DateTime(2026, 5, 30),
      ),

      Timetable(
        dayOfWeek: 1,
        subject: "Operating Systems",
        teacher: "Prof Rajesh Kumar",
        room: "CS302",
        startTime: "10:00",
        endTime: "11:00",
        validFrom: DateTime(2026, 1, 1),
        validTo: DateTime(2026, 5, 30),
      ),

      Timetable(
        dayOfWeek: 1,
        subject: "Database Systems",
        teacher: "Dr Anitha",
        room: "CS303",
        startTime: "11:30",
        endTime: "12:30",
        validFrom: DateTime(2026, 1, 1),
        validTo: DateTime(2026, 5, 30),
      ),

      Timetable(
        dayOfWeek: 1,
        subject: "Computer Networks",
        teacher: "Prof Suresh",
        room: "CS304",
        startTime: "14:00",
        endTime: "15:00",
        validFrom: DateTime(2026, 1, 1),
        validTo: DateTime(2026, 5, 30),
      ),

      /* TUESDAY */
      Timetable(
        dayOfWeek: 2,
        subject: "Machine Learning",
        teacher: "Dr Kavitha",
        room: "CS201",
        startTime: "09:00",
        endTime: "10:00",
        validFrom: DateTime(2026, 1, 1),
        validTo: DateTime(2026, 5, 30),
      ),

      Timetable(
        dayOfWeek: 2,
        subject: "Software Engineering",
        teacher: "Dr Meena",
        room: "CS202",
        startTime: "10:00",
        endTime: "11:00",
        validFrom: DateTime(2026, 1, 1),
        validTo: DateTime(2026, 5, 30),
      ),

      Timetable(
        dayOfWeek: 2,
        subject: "Cloud Computing",
        teacher: "Dr Prakash",
        room: "CS203",
        startTime: "11:30",
        endTime: "12:30",
        validFrom: DateTime(2026, 1, 1),
        validTo: DateTime(2026, 5, 30),
      ),
    ];
  }
}
