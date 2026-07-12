import 'package:flutter/material.dart';
import 'package:attendify/widgets/color_codes.dart';

class StudentCard extends StatelessWidget {
  final String name;
  final String rollNumber;
  final String branch;
  final int semester;
  final String? imageUrl;

  const StudentCard({
    super.key,
    required this.name,
    required this.rollNumber,
    required this.branch,
    required this.semester,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
      ),

      child: Row(
        children: [
          const SizedBox(width: 20),

          CircleAvatar(
            radius: 20,
            backgroundImage: imageUrl != null ? NetworkImage(imageUrl!) : null,
            child: imageUrl == null ? const Icon(Icons.person) : null,
          ),

          const SizedBox(width: 10),

          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name.toUpperCase(),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              Text(
                rollNumber,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),

          const Spacer(),

          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                branch.toUpperCase(),
                style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
              ),
              Text(
                "${semester}TH SEM",
                style: const TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ],
          ),

          const SizedBox(width: 20),
        ],
      ),
    );
  }
}
