import 'package:attendify/widgets/HomePage_widgets/student_card.dart';
import 'package:attendify/widgets/color_codes.dart';
import 'package:flutter/material.dart';

class HeaderSection extends StatelessWidget {
  const HeaderSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          width: double.infinity,
          height: 160,
          padding: const EdgeInsets.only(top: 50, left: 30),
          decoration: const BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(20),
            ),
          ),
          child: const Text(
            "Attendify.ai",
            style: TextStyle(
              color: AppColors.white,
              fontSize: 25,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),

        const Positioned(
          bottom: -30,
          left: 30,
          right: 30,
          child: StudentCard(),
        ),
      ],
    );
  }
}
