class Timetable {
  final int dayOfWeek;
  final String subject;
  final String teacher;
  final String room;
  final String startTime;
  final String endTime;

  final DateTime validFrom;
  final DateTime validTo;

  Timetable({
    required this.dayOfWeek,
    required this.subject,
    required this.teacher,
    required this.room,
    required this.startTime,
    required this.endTime,
    required this.validFrom,
    required this.validTo,
  });
}
