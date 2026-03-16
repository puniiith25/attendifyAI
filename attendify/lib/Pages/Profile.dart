import 'package:attendify/widgets/color_codes.dart';
import 'package:flutter/material.dart';

class Profile extends StatelessWidget {
  const Profile({super.key});

  @override
  Widget build(BuildContext context) {
    final Map<String, dynamic> student = {
      "name": "Punitha KM",
      "studentId": "CSE20240123",
      "course": "BTech",
      "branch": "Computer Science",
      "semester": "4",
      "email": "punitha@example.com",
      "photo":
          "https://toipguxmufufcqlrfdcr.supabase.co/storage/v1/object/public/Students-faces/student_123_1773168892643.jpg",
      "faceRegistered": true,
      "lastUpdated": "12 Mar 2026",
      "confidence": "97%",
    };

    const primaryBlue = Color(0xFF172554);

    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        child: Column(
          children: [
            /* =========================
               PROFILE HEADER
            ========================= */
            Container(
              width: double.infinity,
              padding: const EdgeInsets.fromLTRB(20, 60, 20, 30),
              decoration: const BoxDecoration(
                color: primaryBlue,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(28),
                  bottomRight: Radius.circular(28),
                ),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 55,
                    backgroundColor: Colors.white,
                    child: CircleAvatar(
                      radius: 52,
                      backgroundImage: NetworkImage(student["photo"]),
                    ),
                  ),

                  const SizedBox(height: 14),

                  Text(
                    student["name"],
                    style: const TextStyle(
                      fontSize: 22,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 16),

                  /* STUDENT INFO CHIPS */
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    alignment: WrapAlignment.center,
                    children: [
                      _infoChip(Icons.badge, "ID ${student["studentId"]}"),
                      _infoChip(
                        Icons.school,
                        "${student["course"]} ${student["branch"]}",
                      ),
                      _infoChip(
                        Icons.calendar_today,
                        "Semester ${student["semester"]}",
                      ),
                      _infoChip(Icons.email, student["email"]),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  /* =========================
                     FACE AUTHENTICATION
                  ========================= */
                  Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        const ListTile(
                          leading: Icon(Icons.face),
                          title: Text("Face Authentication"),
                        ),

                        ListTile(
                          title: const Text("Face Registered"),
                          trailing: Text(
                            student["faceRegistered"] ? "Yes" : "No",
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ),

                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primaryBlue,
                            ),
                            onPressed: () {},
                            child: const Text(
                              "Register / Update Face",
                              style: TextStyle(color: AppColors.white),
                            ),
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
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        const ListTile(
                          leading: Icon(Icons.verified),
                          title: Text("Face Authentication Status"),
                        ),

                        ListTile(
                          title: const Text("Registered"),
                          trailing: Text(
                            student["faceRegistered"] ? "Yes" : "No",
                          ),
                        ),

                        ListTile(
                          title: const Text("Last Updated"),
                          trailing: Text(student["lastUpdated"]),
                        ),

                        ListTile(
                          title: const Text("Confidence Score"),
                          trailing: Text(student["confidence"]),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  /* =========================
                     SETTINGS
                  ========================= */
                  Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
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

                  const SizedBox(height: 25),

                  /* =========================
                     LOGOUT BUTTON
                  ========================= */
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.logout, color: AppColors.white),
                      label: const Text(
                        "Logout",
                        style: TextStyle(color: AppColors.white),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        padding: const EdgeInsets.all(16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 30),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  /* =========================
     STUDENT INFO CHIP
  ========================= */

  Widget _infoChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 16),
          const SizedBox(width: 6),
          Text(text, style: const TextStyle(color: Colors.white, fontSize: 13)),
        ],
      ),
    );
  }
}
