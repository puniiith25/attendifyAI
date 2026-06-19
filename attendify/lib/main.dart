import 'package:attendify/Screens/Auth_Pages/Login_Page.dart';
import 'package:flutter/material.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // Main  Page
  // Student APP
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Attendify.ai',
      debugShowCheckedModeBanner: false,

      theme: ThemeData(colorScheme: .fromSeed(seedColor: Colors.deepPurple)),
      home: LoginScreen(),
    );
  }
}
// Student App