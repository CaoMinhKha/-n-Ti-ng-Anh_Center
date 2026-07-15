import 'package:flutter/material.dart';

import '../../duong_dan/duong_dan.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';


import 'giao_dien_tong_quan_admin.dart';
import 'giao_dien_hoc_vien_admin.dart';
import 'giao_dien_giao_vien_admin.dart';
import 'giao_dien_khoa_hoc_admin.dart';
import 'giao_dien_lop_admin.dart';
import 'giao_dien_phan_cong_admin.dart';
import 'giao_dien_dang_ky_admin.dart';
import 'giao_dien_danh_muc_admin.dart';
import 'giao_dien_dot_khai_giang_admin.dart';



class AdminParentScreen extends StatefulWidget {

  const AdminParentScreen({super.key});


  @override
  State<AdminParentScreen> createState()
      => _AdminParentScreenState();

}




class _AdminParentScreenState
extends State<AdminParentScreen>{



int _index = 0;


String _adminName =
    "Quản trị viên";



late List<Widget> _pages;



@override
void initState(){

 super.initState();


 _pages=[

 const AdminDashboardScreen(),


 const QuanLyNguoiDungScreen(),


 const AdminCourseListScreen(),


 const AdminClassListScreen(),


 const AdminAssignmentListScreen(),


 const AdminRegistrationListScreen(),


 const AdminCategoryListScreen(),


 const AdminOpeningSessionListScreen(),


 ];



_loadUser();


}





Future<void> _loadUser() async{


final name =
await UserSession.getUserName();


if(mounted){

setState((){

_adminName =
name ?? "Quản trị viên";

});

}


}







Future<void> _logout() async{


await UserSession.logout();


if(mounted){

Navigator.pushNamedAndRemoveUntil(

context,

AppRoutes.login,

(route)=>false

);

}


}








@override
Widget build(BuildContext context){


return Scaffold(


backgroundColor:
const Color(0xffF8FAFC),



appBar:

AppBar(


backgroundColor:
Colors.white,


elevation:0,


title:


Column(

crossAxisAlignment:
CrossAxisAlignment.start,


children:[


Text(

_pagesName(),

style:

const TextStyle(

color:
Color(0xff1E293B),

fontSize:18,

fontWeight:
FontWeight.bold

)

),



Text(

_adminName,

style:

const TextStyle(

color:
Colors.grey,

fontSize:12

)

)



],

),



actions:[


IconButton(

onPressed:
_logout,


icon:

const Icon(

Icons.logout,

color:
Colors.red

)

)



],


),






body:

AnimatedSwitcher(

duration:
const Duration(
milliseconds:300
),

child:

_pages[_index],

),






bottomNavigationBar:


NavigationBar(


selectedIndex:
_index,


onDestinationSelected:(value){


setState((){


_index=value;


});


},



backgroundColor:
Colors.white,



destinations:[


const NavigationDestination(

icon:
Icon(Icons.dashboard_outlined),

selectedIcon:
Icon(Icons.dashboard),

label:"Trang chủ"

),



const NavigationDestination(

icon:
Icon(Icons.people_outline),

selectedIcon:
Icon(Icons.people),

label:"Người dùng"

),



const NavigationDestination(

icon:
Icon(Icons.book_outlined),

selectedIcon:
Icon(Icons.book),

label:"Khóa học"

),



const NavigationDestination(

icon:
Icon(Icons.class_outlined),

selectedIcon:
Icon(Icons.class_),

label:"Lớp học"

),



],



),



);



}






String _pagesName(){


switch(_index){


case 0:
return "Dashboard";


case 1:
return "Người dùng";


case 2:
return "Khóa học";


case 3:
return "Lớp học";


case 4:
return "Phân công";


case 5:
return "Đăng ký";


case 6:
return "Danh mục";


case 7:
return "Khai giảng";


default:
return "Admin";


}



}



}









class QuanLyNguoiDungScreen extends StatelessWidget{


const QuanLyNguoiDungScreen({super.key});



@override
Widget build(BuildContext context){


return DefaultTabController(


length:2,


child:

Column(

children:[



const TabBar(

labelColor:
Color(0xff2563EB),

tabs:[

Tab(
icon:
Icon(Icons.school),
text:"Học viên"
),


Tab(
icon:
Icon(Icons.person),
text:"Giáo viên"
),


],

),




Expanded(

child:

TabBarView(

children:[


const AdminStudentListScreen(),


const AdminTeacherListScreen(),


],


)

)



],



),



);



}



}