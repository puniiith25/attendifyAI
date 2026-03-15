import 'package:flutter/material.dart';

class QR_Scaner extends StatefulWidget {
  const QR_Scaner({super.key});

  @override
  State<QR_Scaner> createState() => _QR_ScanerState();
}

class _QR_ScanerState extends State<QR_Scaner> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Text("QR_Scaner"));
  }
}
