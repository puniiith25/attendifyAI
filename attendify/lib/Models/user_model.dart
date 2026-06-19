class UserModel {
  final int id;
  final String name;
  final String email;
  final String role;
  final String rollNumber;
  final String branch;
  final int semester;
  final String phone;
  final int admissionYear;
  final String section;
  final String? imageUrl;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.rollNumber,
    required this.branch,
    required this.semester,
    required this.phone,
    required this.admissionYear,
    required this.section,
    this.imageUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json["id"],
      name: json["name"],
      email: json["email"],
      role: json["role"],
      rollNumber: json["roll_number"],
      branch: json["branch"],
      semester: json["semester"],
      phone: json["phone"],
      admissionYear: json["admission_year"],
      section: json["section"],
      imageUrl: json["image_url"],
    );
  }
}
