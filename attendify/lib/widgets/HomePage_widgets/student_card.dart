import 'package:flutter/material.dart';
import 'package:attendify/widgets/color_codes.dart';

class StudentCard extends StatelessWidget {
  const StudentCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)],
      ),

      child: const Row(
        children: [
          SizedBox(width: 20),

          CircleAvatar(radius: 20, child: Icon(Icons.person)),

          SizedBox(width: 10),

          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("PUNITHA KM", style: TextStyle(fontWeight: FontWeight.bold)),
              Text(
                "2411021061279",
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),

          Spacer(),

          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "BTECH CSE",
                style: TextStyle(fontSize: 10, color: Colors.grey),
              ),
              Text(
                "4TH SEM",
                style: TextStyle(fontSize: 10, color: Colors.grey),
              ),
            ],
          ),

          SizedBox(width: 20),
        ],
      ),
    );
  }
}
