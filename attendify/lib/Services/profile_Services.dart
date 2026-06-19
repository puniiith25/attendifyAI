import 'dart:convert';

import 'package:attendify/Models/user_model.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class ProfileServices {
  final storage = const FlutterSecureStorage();
  final backendurl = "http://localhost:8000/api/v1/students/my-student";

  Future<UserModel> getProfile() async {
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
      return UserModel.fromJson(data["student"]);
    }
    throw Exception(data["message"] ?? "Failed to load profile");
  }
}
