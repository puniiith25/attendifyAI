import 'package:flutter/material.dart';

class ClassCard extends StatelessWidget {
  final String subject;
  final String time;
  final String teacher;
  final String room;
  final String status;

  const ClassCard({
    super.key,
    required this.subject,
    required this.time,
    required this.teacher,
    required this.room,
    required this.status,
  });

  Color getStatusColor() {
    switch (status) {
      case "Completed":
        return Colors.green;
      case "Ongoing":
        return Colors.orange;
      default:
        return Colors.blue;
    }
  }

  Color getStatusBackground() {
    switch (status) {
      case "Completed":
        return Colors.green.shade100;
      case "Ongoing":
        return Colors.orange.shade100;
      default:
        return Colors.blue.shade100;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),

      child: Container(
        padding: const EdgeInsets.all(16),

        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),

        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            /* LEFT ICON */
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.bar_chart, color: Colors.blue),
            ),

            const SizedBox(width: 14),

            /* CONTENT */
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    subject,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),

                  const SizedBox(height: 6),

                  Row(
                    children: [
                      const Icon(
                        Icons.access_time,
                        size: 16,
                        color: Colors.grey,
                      ),

                      const SizedBox(width: 6),

                      Flexible(
                        child: Text(
                          time,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 6),

                  /* TEACHER + ROOM */
                  Wrap(
                    spacing: 14,
                    runSpacing: 4,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.menu_book,
                            size: 16,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            teacher,
                            style: const TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),

                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.location_on,
                            size: 16,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            room,
                            style: const TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 10),

            /* STATUS BADGE */
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),

              decoration: BoxDecoration(
                color: getStatusBackground(),
                borderRadius: BorderRadius.circular(20),
              ),

              child: Text(
                status,
                style: TextStyle(
                  color: getStatusColor(),
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
