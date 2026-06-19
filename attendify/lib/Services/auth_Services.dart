import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class AuthServices {
  final backendurl = "http://localhost:8000/api/v1/users/login";
  final storage = FlutterSecureStorage();
  Future<String> UserSignUP({
    required String email,
    required String password,
  }) async {
    try {
      final res = await http.post(
        Uri.parse(backendurl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      if (res.statusCode == 200 || res.statusCode == 201) {
        final data = jsonDecode(res.body);
        await storage.write(key: "token", value: data["token"]);
        return data['message'] ?? "User registered successfully";
      } else {
        final data = jsonDecode(res.body);

        return data['message'] ?? "Registration failed";
      }
    } catch (e) {
      return "Error: $e";
    }
  }
}
