import 'package:flutter/material.dart';

class Profile extends StatelessWidget {
  const Profile({super.key});

  @override
  Widget build(BuildContext context) {
    // TEMP DATA
    final Map<String, dynamic> student = {
      "name": "Punitha KM",
      "studentId": "CSE20240123",
      "course": "BTech",
      "branch": "Computer Science",
      "semester": "4",
      "email": "punitha@example.com",
      "photo": "https://i.pravatar.cc/150?img=47",
      "faceRegistered": true,
      "lastUpdated": "12 Mar 2026",
      "confidence": "97%",
    };

    return Scaffold(
      appBar: AppBar(title: const Text("Student Profile")),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),

        child: Column(
          children: [
            /* =========================
               PROFILE HEADER
            ========================= */
            Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),

              child: Padding(
                padding: const EdgeInsets.all(20),

                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundImage: NetworkImage(student["photo"] as String),
                    ),

                    const SizedBox(height: 12),

                    Text(
                      student["name"] as String,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 6),

                    Text("ID: ${student["studentId"]}"),
                    Text("${student["course"]} - ${student["branch"]}"),
                    Text("Semester ${student["semester"]}"),
                    Text(student["email"] as String),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            /* =========================
               FACE AUTHENTICATION
            ========================= */
            Card(
              child: Column(
                children: [
                  const ListTile(
                    leading: Icon(Icons.face),
                    title: Text("Face Authentication"),
                  ),

                  ListTile(
                    title: const Text("Face Registered"),

                    trailing: Text(
                      (student["faceRegistered"] as bool) ? "Yes" : "No",
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),

                    child: ElevatedButton(
                      onPressed: () {},
                      child: const Text("Register / Update Face"),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            /* =========================
               FACE STATUS
            ========================= */
            Card(
              child: Column(
                children: [
                  const ListTile(
                    leading: Icon(Icons.verified),
                    title: Text("Face Authentication Status"),
                  ),

                  ListTile(
                    title: const Text("Registered"),
                    trailing: Text(
                      (student["faceRegistered"] as bool) ? "Yes" : "No",
                    ),
                  ),

                  ListTile(
                    title: const Text("Last Updated"),
                    trailing: Text(student["lastUpdated"] as String),
                  ),

                  ListTile(
                    title: const Text("Confidence Score"),
                    trailing: Text(student["confidence"] as String),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            /* =========================
               SETTINGS
            ========================= */
            Card(
              child: Column(
                children: const [
                  ListTile(
                    leading: Icon(Icons.lock),
                    title: Text("Change Password"),
                  ),

                  ListTile(
                    leading: Icon(Icons.notifications),
                    title: Text("Notifications"),
                  ),

                  ListTile(
                    leading: Icon(Icons.privacy_tip),
                    title: Text("Privacy"),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            /* =========================
               LOGOUT BUTTON
            ========================= */
            SizedBox(
              width: double.infinity,

              child: ElevatedButton.icon(
                onPressed: () {},

                icon: const Icon(Icons.logout),
                label: const Text("Logout"),

                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: const EdgeInsets.all(14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
