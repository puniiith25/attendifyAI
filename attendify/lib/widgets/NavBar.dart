import 'package:attendify/data/notifiiers.dart';
import 'package:attendify/widgets/color_codes.dart';
import 'package:flutter/material.dart';

class NavbarWidget extends StatefulWidget {
  const NavbarWidget({super.key});

  @override
  State<NavbarWidget> createState() => _NavbarWidgetState();
}

class _NavbarWidgetState extends State<NavbarWidget> {
  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: selectedPageNotifier,
      builder: (context, selectedPage, child) {
        return NavigationBarTheme(
          data: NavigationBarThemeData(
            backgroundColor: AppColors.primary,

            indicatorColor: AppColors.primary,

            iconTheme: WidgetStateProperty.resolveWith<IconThemeData>((states) {
              if (states.contains(WidgetState.selected)) {
                return IconThemeData(color: AppColors.white, size: 26);
              }
              return const IconThemeData(color: Colors.grey, size: 24);
            }),

            labelTextStyle: WidgetStateProperty.resolveWith<TextStyle>((
              states,
            ) {
              if (states.contains(WidgetState.selected)) {
                return TextStyle(
                  color: AppColors.white,
                  fontWeight: FontWeight.w600,
                );
              }
              return const TextStyle(color: Colors.grey);
            }),
          ),

          child: NavigationBar(
            selectedIndex: selectedPage,
            onDestinationSelected: (value) {
              selectedPageNotifier.value = value;
            },

            destinations: const [
              NavigationDestination(
                icon: Icon(Icons.home_outlined),
                selectedIcon: Icon(Icons.home),
                label: 'Home',
              ),
              NavigationDestination(
                icon: Icon(Icons.qr_code_scanner),
                selectedIcon: Icon(Icons.qr_code_2_sharp),
                label: 'QR Scan',
              ),
              NavigationDestination(
                icon: Icon(Icons.calendar_month),
                selectedIcon: Icon(Icons.calendar_month_rounded),
                label: 'TimeTable',
              ),
              NavigationDestination(
                icon: Icon(Icons.person_outline),
                selectedIcon: Icon(Icons.person),
                label: 'Profile',
              ),
            ],
          ),
        );
      },
    );
  }
}
