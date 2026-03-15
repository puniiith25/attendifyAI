import 'package:flutter/material.dart';

class QuickButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;

  const QuickButton({
    super.key,
    required this.icon,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(icon, color: Colors.white),
        ),

        const SizedBox(height: 6),

        Text(
          label,
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
        ),
      ],
    );
  }
}
